import { randomUUID } from "node:crypto";
import { DeviceLicenseStatus } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { config } from "../config.js";

function plusDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function normalizeStatus(license: {
  status: DeviceLicenseStatus;
  expiresAt: Date;
  graceUntil: Date;
}): {
  status: DeviceLicenseStatus;
  isActive: boolean;
  isWithinGrace: boolean;
} {
  const now = new Date();
  const isWithinGrace = now <= license.graceUntil;
  const expired = now > license.expiresAt;

  if (license.status === DeviceLicenseStatus.revoked) {
    return {
      status: DeviceLicenseStatus.revoked,
      isActive: false,
      isWithinGrace: false,
    };
  }

  if (expired && !isWithinGrace) {
    return {
      status: DeviceLicenseStatus.expired,
      isActive: false,
      isWithinGrace: false,
    };
  }

  if (expired && isWithinGrace) {
    return {
      status: DeviceLicenseStatus.expired,
      isActive: true,
      isWithinGrace: true,
    };
  }

  return {
    status: DeviceLicenseStatus.active,
    isActive: true,
    isWithinGrace: false,
  };
}

export async function activateDeviceLicense(
  fastify: FastifyInstance,
  input: {
    deviceId: string;
    deviceName: string;
    platform: string;
    appVersion?: string;
    activationCode: string;
  },
) {
  if (input.activationCode !== config.licenseActivationCode) {
    throw new Error("Codice attivazione non valido.");
  }

  const now = new Date();
  const expiresAt = plusDays(now, Math.max(1, config.licenseDurationDays));
  const graceUntil = plusDays(expiresAt, Math.max(1, config.licenseGraceDays));

  const existing = await fastify.prisma.deviceLicense.findUnique({
    where: { deviceId: input.deviceId },
  });

  if (existing?.status === DeviceLicenseStatus.revoked) {
    throw new Error("Device revocato. Contattare amministratore.");
  }

  const heartbeatToken = existing?.heartbeatToken ?? randomUUID();

  const upserted = await fastify.prisma.deviceLicense.upsert({
    where: { deviceId: input.deviceId },
    update: {
      deviceName: input.deviceName,
      platform: input.platform,
      appVersion: input.appVersion,
      activationCode: input.activationCode,
      status: DeviceLicenseStatus.active,
      activatedAt: now,
      expiresAt,
      graceUntil,
      lastSeenAt: now,
      revokedAt: null,
      revokedReason: null,
      heartbeatToken,
    },
    create: {
      deviceId: input.deviceId,
      deviceName: input.deviceName,
      platform: input.platform,
      appVersion: input.appVersion,
      activationCode: input.activationCode,
      status: DeviceLicenseStatus.active,
      activatedAt: now,
      expiresAt,
      graceUntil,
      lastSeenAt: now,
      heartbeatToken,
    },
  });

  return {
    licenseId: upserted.id,
    deviceId: upserted.deviceId,
    heartbeatToken: upserted.heartbeatToken,
    status: upserted.status,
    expiresAt: upserted.expiresAt,
    graceUntil: upserted.graceUntil,
    isActive: true,
    isWithinGrace: false,
    serverTime: now,
  };
}

export async function validateDeviceLicense(
  fastify: FastifyInstance,
  input: {
    deviceId: string;
    heartbeatToken: string;
  },
) {
  const license = await fastify.prisma.deviceLicense.findUnique({
    where: { deviceId: input.deviceId },
  });

  if (!license || license.heartbeatToken !== input.heartbeatToken) {
    return {
      found: false,
      isActive: false,
      reason: "device_not_found_or_token_invalid",
      serverTime: new Date(),
    };
  }

  const normalized = normalizeStatus(license);
  if (normalized.status !== license.status) {
    await fastify.prisma.deviceLicense.update({
      where: { id: license.id },
      data: {
        status: normalized.status,
      },
    });
  }

  return {
    found: true,
    isActive: normalized.isActive,
    isWithinGrace: normalized.isWithinGrace,
    status: normalized.status,
    expiresAt: license.expiresAt,
    graceUntil: license.graceUntil,
    revokedAt: license.revokedAt,
    revokedReason: license.revokedReason,
    serverTime: new Date(),
  };
}

export async function heartbeatDeviceLicense(
  fastify: FastifyInstance,
  input: {
    deviceId: string;
    heartbeatToken: string;
    appVersion?: string;
  },
) {
  const validation = await validateDeviceLicense(fastify, {
    deviceId: input.deviceId,
    heartbeatToken: input.heartbeatToken,
  });

  if (!validation.found || !validation.isActive) {
    return validation;
  }

  await fastify.prisma.deviceLicense.update({
    where: { deviceId: input.deviceId },
    data: {
      lastSeenAt: new Date(),
      appVersion: input.appVersion,
    },
  });

  return {
    ...validation,
    heartbeatAccepted: true,
  };
}

export async function revokeDeviceLicense(
  fastify: FastifyInstance,
  input: {
    deviceId: string;
    reason?: string;
  },
) {
  const license = await fastify.prisma.deviceLicense.findUnique({ where: { deviceId: input.deviceId } });
  if (!license) {
    throw new Error("Device non trovato.");
  }

  return fastify.prisma.deviceLicense.update({
    where: { id: license.id },
    data: {
      status: DeviceLicenseStatus.revoked,
      revokedAt: new Date(),
      revokedReason: input.reason,
    },
  });
}

export async function requireActiveLicense(
  fastify: FastifyInstance,
  input: {
    deviceId: string;
    heartbeatToken: string;
  },
) {
  const validation = await validateDeviceLicense(fastify, input);
  if (!validation.found || !validation.isActive) {
    throw new Error("Licenza device non valida o scaduta.");
  }

  return fastify.prisma.deviceLicense.findUniqueOrThrow({
    where: { deviceId: input.deviceId },
  });
}
