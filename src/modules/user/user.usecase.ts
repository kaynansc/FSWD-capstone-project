import { hash } from 'bcrypt'
import { UserRepository } from './user.repository'
import { CreateUserInput, UpdateUserProfileInput } from './user.schema'
import { NotFoundError } from '@/shared/errors/app-error'

export class UserUseCase {
  constructor(private userRepository: UserRepository) {}

  async createUser(data: CreateUserInput) {
    const existingUser = await this.userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await hash(data.password, 10)
    const userData = {
      ...data,
      password: hashedPassword,
      roleId: process.env.DEFAULT_ROLE_ID || 'user-role-id' // You should set this in your .env
    }

    return this.userRepository.create(userData)
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  async deleteUser(id: string) {
    await this.getUserById(id)
    return this.userRepository.delete(id)
  }

  async getCurrentUserProfile(userId: string) {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      phoneNumber: user.phoneNumber,
      interests: user.interests.map(interest => {
        return {
          id: interest.category.id,
          name: interest.category.name
        }
      }),
      role: user.role.name,
      createdAt: user.createdAt
    }
  }

  async updateCurrentUserProfile(userId: string, data: UpdateUserProfileInput) {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    const updatedUser = await this.userRepository.update(userId, data)
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      phoneNumber: updatedUser.phoneNumber,
      interests: updatedUser.interests.map(interest => interest.categoryId),
      role: updatedUser.role.name,
      updatedAt: updatedUser.updatedAt
    }
  }
} 