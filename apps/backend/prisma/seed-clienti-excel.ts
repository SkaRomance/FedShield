import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CLIENTS_FROM_EXCEL = [
  {
    code: "0001",
    name: "(Asilo Sole dei Bimbi) SANTA CHIARA SOCIETA' COOPERATIVA SOCIALE",
    city: "VIBO VALENTIA",
    legalAddress: "VIA LEONARDO SCIASCIA",
    province: "VV",
    vatNumber: "03160240796",
    fiscalCode: "03160240796",
    cap: "89900",
    sdiCode: "0000000",
    mobilePhone: "338/1051484 - 339/5337917",
    email: "soledeibimbi@gmail.com",
    pec: "santachiara.vv@pec.it",
    atecoCode: "88.91.00",
    riskLevel: "Basso",
  },
  {
    code: "0002",
    name: "2C IMPIANTI DI SUPPA COSTANTINO",
    city: "SAN COSTANTINO CALABRO",
    legalAddress: "VIA SABOTINO 24",
    province: "VV",
    vatNumber: "02292480791",
    fiscalCode: "SPPCTN77P10F537W",
    cap: "89851",
    sdiCode: "0000000",
    mobilePhone: "+39 347 674 0254",
    pec: "dueciimpiantielettrici@pec.it",
    atecoCode: "43.21.01",
    riskLevel: "Medio",
  },
  {
    code: "0003",
    name: "2DI GROUP S.R.L.",
    city: "MILANO",
    legalAddress: "VIA CRESCENZAGO, 55",
    province: "MI",
    vatNumber: "06857940966",
    fiscalCode: "06857940966",
    cap: "20134",
    sdiCode: "W7YVJK9",
    email: "amministrazione@2digroup.it; contabilita@2digroup.it",
    atecoCode: "70.22.09",
    riskLevel: "Basso",
  },
];

async function main() {
  console.log("Seeding clienti da Clienti.xlsx...");
  for (const client of CLIENTS_FROM_EXCEL) {
    const upserted = await prisma.company.upsert({
      where: { vatNumber: client.vatNumber },
      create: {
        ...client,
      },
      update: {
        code: client.code,
        fiscalCode: client.fiscalCode,
        province: client.province,
        cap: client.cap,
        sdiCode: client.sdiCode,
        mobilePhone: client.mobilePhone,
        email: client.email,
        pec: client.pec,
        city: client.city,
        legalAddress: client.legalAddress,
        atecoCode: client.atecoCode,
        riskLevel: client.riskLevel,
      },
    });
    console.log(`✓ Cliente: ${upserted.name} (${upserted.code}) - ${upserted.city} (${upserted.province})`);
  }
}

main()
  .catch((e) => {
    console.error("Errore seed clienti excel:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
