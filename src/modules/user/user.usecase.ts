import { UserRepository } from './user.repository'
import { CreateUserInput, UpdateUserInput } from './user.schema'

export class UserUseCase {
  constructor(private repository: UserRepository) {}

  async createUser(data: CreateUserInput) {
    const existingUser = await this.repository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('User already exists')
    }
    return this.repository.create(data)
  }

  async getUserById(id: string) {
    const user = await this.repository.findById(id)
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  async updateUser(id: string, data: UpdateUserInput) {
    await this.getUserById(id)
    return this.repository.update(id, data)
  }

  async deleteUser(id: string) {
    await this.getUserById(id)
    return this.repository.delete(id)
  }
} 