import {
  activateDeviceLicense,
  heartbeatDeviceLicense,
  syncAck,
  syncPull,
  syncPush,
  validateDeviceLicense,
} from "../api";

export interface DeviceContext {
  deviceId: string;
  deviceName: string;
  platform: string;
  appVersion: string;
  heartbeatToken?: string;
  status?: "active" | "expired" | "revoked";
  isActive?: boolean;
  isWithinGrace?: boolean;
  lastValidationAt?: string;
}

interface QueuedSyncEvent {
  clientEventId: string;
  eventType: string;
  entityType: string;
  entityId?: string;
  payload: unknown;
  occurredAt: string;
}

const DEVICE_CONTEXT_KEY = "fedshield_device_context";
const SYNC_QUEUE_KEY = "fedshield_sync_queue";
const SYNC_CURSOR_KEY = "fedshield_sync_cursor";

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function generateDeviceId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `fedshield-${crypto.randomUUID()}`;
  }

  return `fedshield-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export function getDeviceContext(): DeviceContext {
  const existing = readJson<DeviceContext | null>(DEVICE_CONTEXT_KEY, null);
  if (existing?.deviceId) {
    return existing;
  }

  const context: DeviceContext = {
    deviceId: generateDeviceId(),
    deviceName: "FedShield Desktop",
    platform: (window.fedshield?.platform ?? "windows").toString(),
    appVersion: "0.5.0",
  };

  writeJson(DEVICE_CONTEXT_KEY, context);
  return context;
}

function saveDeviceContext(context: DeviceContext): void {
  writeJson(DEVICE_CONTEXT_KEY, context);
}

export async function ensureLicenseActivation(): Promise<DeviceContext> {
  const context = getDeviceContext();
  const activationCode = import.meta.env.VITE_LICENSE_ACTIVATION_CODE ?? "FEDSHIELD-DEMO-KEY";

  const activateFreshLicense = async (): Promise<DeviceContext> => {
    const activated = await activateDeviceLicense({
      deviceId: context.deviceId,
      deviceName: context.deviceName,
      platform: context.platform,
      appVersion: context.appVersion,
      activationCode,
    });

    const next: DeviceContext = {
      ...context,
      heartbeatToken: activated.heartbeatToken,
      status: activated.status,
      isActive: activated.isActive,
      isWithinGrace: activated.isWithinGrace,
      lastValidationAt: activated.serverTime,
    };
    saveDeviceContext(next);
    return next;
  };

  if (!context.heartbeatToken) {
    return activateFreshLicense();
  }

  const validation = await validateDeviceLicense({
    deviceId: context.deviceId,
    heartbeatToken: context.heartbeatToken,
  });

  if (!validation.found) {
    return activateFreshLicense();
  }

  const next: DeviceContext = {
    ...context,
    status: validation.status,
    isActive: validation.isActive,
    isWithinGrace: validation.isWithinGrace,
    lastValidationAt: validation.serverTime,
  };
  saveDeviceContext(next);
  return next;
}

export async function sendLicenseHeartbeat(): Promise<DeviceContext> {
  const context = getDeviceContext();
  if (!context.heartbeatToken) {
    return ensureLicenseActivation();
  }

  const heartbeat = await heartbeatDeviceLicense({
    deviceId: context.deviceId,
    heartbeatToken: context.heartbeatToken,
    appVersion: context.appVersion,
  });

  const next: DeviceContext = {
    ...context,
    status: heartbeat.status,
    isActive: heartbeat.isActive,
    isWithinGrace: heartbeat.isWithinGrace,
    lastValidationAt: heartbeat.serverTime,
  };

  saveDeviceContext(next);
  return next;
}

export function queueSyncEvent(event: {
  eventType: string;
  entityType: string;
  entityId?: string;
  payload: unknown;
}) {
  const queue = readJson<QueuedSyncEvent[]>(SYNC_QUEUE_KEY, []);
  const queued: QueuedSyncEvent = {
    clientEventId: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    eventType: event.eventType,
    entityType: event.entityType,
    entityId: event.entityId,
    payload: event.payload,
    occurredAt: new Date().toISOString(),
  };

  queue.push(queued);
  writeJson(SYNC_QUEUE_KEY, queue);
}

export function getSyncQueueSize(): number {
  return readJson<QueuedSyncEvent[]>(SYNC_QUEUE_KEY, []).length;
}

export async function flushSyncQueue(token: string): Promise<{ pushed: number; duplicates: number }> {
  const context = await ensureLicenseActivation();
  if (!context.heartbeatToken) {
    throw new Error("Heartbeat token assente.");
  }

  const queue = readJson<QueuedSyncEvent[]>(SYNC_QUEUE_KEY, []);
  if (queue.length === 0) {
    return { pushed: 0, duplicates: 0 };
  }

  const payload = queue.slice(0, 500);
  const result = await syncPush(token, {
    deviceId: context.deviceId,
    heartbeatToken: context.heartbeatToken,
    events: payload,
  });

  const processed = result.accepted + result.duplicates;
  writeJson(SYNC_QUEUE_KEY, queue.slice(processed));

  return {
    pushed: result.accepted,
    duplicates: result.duplicates,
  };
}

export async function pullAndAcknowledge(token: string): Promise<{ received: number }> {
  const context = await ensureLicenseActivation();
  if (!context.heartbeatToken) {
    throw new Error("Heartbeat token assente.");
  }

  const cursor = localStorage.getItem(SYNC_CURSOR_KEY) ?? undefined;
  const delta = await syncPull(token, {
    deviceId: context.deviceId,
    heartbeatToken: context.heartbeatToken,
    since: cursor,
  });

  await syncAck(token, {
    deviceId: context.deviceId,
    heartbeatToken: context.heartbeatToken,
    cursor: delta.nextCursor,
  });

  localStorage.setItem(SYNC_CURSOR_KEY, delta.nextCursor);

  const received = Object.values(delta.data).reduce<number>((sum, value) => {
    if (Array.isArray(value)) {
      return sum + value.length;
    }
    return sum;
  }, 0);

  return { received };
}
