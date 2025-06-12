import { CategoryRepository } from './category.repository'
import { CreateCategoryInput, UpdateCategoryInput } from './category.schema'
import { ConflictError, NotFoundError } from '@/shared/errors/app-error'

export class CategoryUseCase {
  constructor(private repository: CategoryRepository) {}

  async createCategory(data: CreateCategoryInput) {
    const existingCategory = await this.repository.findByName(data.name)
    if (existingCategory) {
      throw new ConflictError('Category with this name already exists')
    }

    return this.repository.create(data)
  }

  async getCategoryById(id: string) {
    const category = await this.repository.findById(id)
    if (!category) {
      throw new NotFoundError('Category not found')
    }
    return category
  }

  async listCategories() {
    return this.repository.findAll()
  }

  async updateCategory(id: string, data: UpdateCategoryInput) {
    await this.getCategoryById(id)

    if (data.name) {
      const existingCategory = await this.repository.findByName(data.name)
      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictError('Category with this name already exists')
      }
    }

    return this.repository.update(id, data)
  }

  async deleteCategory(id: string) {
    const category = await this.getCategoryById(id)
    
    // Check if category is in use
    if (category._count.communities > 0 || category._count.interests > 0) {
      throw new ConflictError('Cannot delete category that is in use')
    }

    return this.repository.delete(id)
  }
} 