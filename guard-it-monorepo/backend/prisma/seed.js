import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient({});

async function main() {
  console.log('Seeding database...');

  // Upsert Security Metrics
  const metrics = [
    { label: "Reaction Speed", value: "14ms", detail: "Proactive latency" },
    { label: "Predictive Accuracy", value: "99.9%", detail: "ML-driven confidence" },
    { label: "System Uptime", value: "100%", detail: "Architectural stability" }
  ];

  for (const metric of metrics) {
    await prisma.securityMetric.create({
      data: metric
    });
  }

  // Upsert System Status
  await prisma.systemStatus.create({
    data: {
      status: "nominal",
      message: "Security architecture fully operational."
    }
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
