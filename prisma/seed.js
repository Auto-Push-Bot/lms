import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.usertype.createMany({
        data: [
            { name: 'Admin' },
            { name: 'Becario' },
            { name: 'Invitado' },
        ],
        skipDuplicates: true,
    });
    await prisma.userstatus.createMany({
        data: [
            { name: 'Pendiente' },
            { name: 'Activo' },
            { name: 'Expirado' },
            { name: 'Inactivo' },
        ],
        skipDuplicates: true,
    });
    await prisma.taskstatus.createMany({
        data: [
            { name: 'Pendiente' },
            { name: 'Completada' },
            { name: 'En Progreso' },
        ],
        skipDuplicates: true,
    });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });