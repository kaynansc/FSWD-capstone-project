import { compare, hash } from 'bcrypt'
import { LoginInput, RegisterInput } from './auth.schema'
import { UserRepository } from '../user/user.repository'
import { UnauthorizedError, ConflictError } from '@/shared/errors/app-error'

export class AuthUseCase {
  constructor(
    private userRepository: UserRepository
  ) {}

  async login(data: LoginInput) {
    const user = await this.userRepository.findByEmail(data.email)
    if (!user) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const isValidPassword = await compare(data.password, user.password)
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name
    }
  }

  async register(data: RegisterInput) {
    const existingUser = await this.userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new ConflictError('Email already registered')
    }

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: await hash(data.password, 10),
      roleId: process.env.DEFAULT_ROLE_ID || 'user-role-id'
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name
    }
  }
} 