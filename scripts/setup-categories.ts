import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create default categories if they don't exist
    const categories = [
      {
        name: 'Cultural',
        description: 'Groups focused on cultural activities, traditions, and heritage'
      },
      {
        name: 'Professional',
        description: 'Career-focused groups and professional networking'
      },
      {
        name: 'Sports & Recreation',
        description: 'Sports teams, fitness groups, and outdoor activities'
      },
      {
        name: 'Technology',
        description: 'Tech meetups, coding groups, and digital innovation'
      },
      {
        name: 'Arts & Creativity',
        description: 'Art groups, music bands, and creative workshops'
      },
      {
        name: 'Education',
        description: 'Study groups, workshops, and learning communities'
      },
      {
        name: 'Health & Wellness',
        description: 'Health support groups, meditation, and wellness activities'
      },
      {
        name: 'Social',
        description: 'Social clubs and friendship groups'
      },
      {
        name: 'Environmental',
        description: 'Environmental conservation and sustainability groups'
      },
      {
        name: 'Hobbies',
        description: 'Groups for various hobbies and interests'
      },
      {
        name: 'Faith & Spirituality',
        description: 'Religious and spiritual communities'
      },
      {
        name: 'Gaming',
        description: 'Video games, board games, and tabletop RPG communities'
      }
    ]

    for (const category of categories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category
      })
    }

    console.log('Categories setup completed successfully')
  } catch (error) {
    console.error('Error setting up categories:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 