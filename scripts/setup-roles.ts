import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create default roles if they don't exist
    const roles = [
      {
        name: 'user',
        description: 'Regular user with basic privileges'
      },
      {
        name: 'organizer',
        description: 'Can create and manage communities'
      },
      {
        name: 'admin',
        description: 'Has full access to all features'
      }
    ]

    for (const role of roles) {
      await prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: role
      })
    }

    console.log('Roles setup completed successfully')
  } catch (error) {
    console.error('Error setting up roles:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 