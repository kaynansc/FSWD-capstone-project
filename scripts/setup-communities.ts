import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // First, let's get an admin user to be the organizer
    const adminUser = await prisma.user.findFirst({
      where: {
        role: {
          name: 'admin'
        }
      }
    })

    if (!adminUser) {
      throw new Error('No admin user found. Please run create-admin script first.')
    }

    const categories = await prisma.category.findMany()
    const categoryNameToId = categories.reduce((acc, category) => {
      acc[category.name] = category.id
      return acc
    }, {} as Record<string, string>)

    const communities = [
      {
        name: 'Creative Arts Workshop',
        description: 'A vibrant community for artists to share their work, learn new techniques, and collaborate on projects. We host weekly workshops and monthly art exhibitions.',
        categoryId: categoryNameToId['Arts & Creativity'],
        location: 'Downtown Art Center, San Francisco',
        latitude: 37.7749,
        longitude: -122.4194,
        organizerId: adminUser.id,
      },
      {
        name: 'Tech Innovators Hub',
        description: 'A community of tech enthusiasts, developers, and innovators. We organize coding workshops, hackathons, and tech talks to foster innovation and learning.',
        categoryId: categoryNameToId['Technology'],
        location: 'Innovation Center, Silicon Valley',
        latitude: 37.3875,
        longitude: -122.0575,
        organizerId: adminUser.id
      },
      {
        name: 'Wellness Warriors',
        description: 'Join us for yoga sessions, meditation workshops, and holistic health discussions. We focus on mental and physical well-being through community support.',
        categoryId: categoryNameToId['Health & Wellness'],
        location: 'Harmony Wellness Center, Los Angeles',
        latitude: 34.0522,
        longitude: -118.2437,
        organizerId: adminUser.id
      },
      {
        name: 'Gaming League',
        description: 'A community for gamers of all levels. We organize tournaments, game nights, and discussions about the latest in gaming.',
        categoryId: categoryNameToId['Gaming'],
        location: 'GameHub Arena, Seattle',
        latitude: 47.6062,
        longitude: -122.3321,
        organizerId: adminUser.id
      },
      {
        name: 'Environmental Champions',
        description: 'Dedicated to environmental conservation and sustainability. We organize clean-up drives, workshops on sustainable living, and environmental awareness campaigns.',
        categoryId: categoryNameToId['Environmental'],
        location: 'Green Park Community Center, Portland',
        latitude: 45.5155,
        longitude: -122.6789,
        organizerId: adminUser.id
      }
    ]

    for (const community of communities) {
      await prisma.community.create({
        data: community
      })
    }

    console.log('Communities setup completed successfully')
  } catch (error) {
    console.error('Error setting up communities:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 