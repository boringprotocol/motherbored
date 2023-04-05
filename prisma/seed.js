const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  try {
    // Seed Role data
    const roles = [
      {
        name: "n3wb",
        max_peers: 5,
        max_claims: 5,
        max_drips: 5,
      },
      {
        name: "supporter",
        max_peers: 10,
        max_claims: 10,
        max_drips: 10,
      },
      {
        name: "x",
        max_peers: 25,
        max_claims: 25,
        max_drips: 25,
      },
      {
        name: "l33t",
        max_peers: 50,
        max_claims: 50,
        max_drips: 50,
      },
      {
        name: "drip_lord",
        max_peers: 0,
        max_claims: 0,
        max_drips: -1,
      },
    ];

    const createdRoles = await prisma.role.createMany({
      data: roles,
    });

    // Seed Subscription data
    const subscriptions = [
      {
        name: "Basic",
        price: 5,
        billingCycle: "Monthly",
        roles: {
          connect: [{ id: createdRoles[0].id }],
        },
      },
      {
        name: "Pro",
        price: 10,
        billingCycle: "Monthly",
        roles: {
          connect: [
            { id: createdRoles[0].id },
            { id: createdRoles[1].id },
          ],
        },
      },
      {
        name: "Premium",
        price: 25,
        billingCycle: "Monthly",
        roles: {
          connect: [
            { id: createdRoles[0].id },
            { id: createdRoles[1].id },
            { id: createdRoles[2].id },
          ],
        },
      },
      {
        name: "Elite",
        price: 50,
        billingCycle: "Monthly",
        roles: {
          connect: [
            { id: createdRoles[0].id },
            { id: createdRoles[1].id },
            { id: createdRoles[2].id },
            { id: createdRoles[3].id },
            { id: createdRoles[4].id },
          ],
        },
      },
    ];

    for (let subscription of subscriptions) {
      await prisma.subscription.create({
        data: subscription,
      });
    }

    console.log("Seeding complete.");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
