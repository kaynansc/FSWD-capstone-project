"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryUseCase = void 0;
const app_error_1 = require("@/shared/errors/app-error");
class CategoryUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async createCategory(data) {
        const existingCategory = await this.repository.findByName(data.name);
        if (existingCategory) {
            throw new app_error_1.ConflictError('Category with this name already exists');
        }
        return this.repository.create(data);
    }
    async getCategoryById(id) {
        const category = await this.repository.findById(id);
        if (!category) {
            throw new app_error_1.NotFoundError('Category not found');
        }
        return category;
    }
    async listCategories(params) {
        return this.repository.findAll(params);
    }
    async updateCategory(id, data) {
        await this.getCategoryById(id);
        if (data.name) {
            const existingCategory = await this.repository.findByName(data.name);
            if (existingCategory && existingCategory.id !== id) {
                throw new app_error_1.ConflictError('Category with this name already exists');
            }
        }
        return this.repository.update(id, data);
    }
    async deleteCategory(id) {
        const category = await this.getCategoryById(id);
        // Check if category is in use
        if (category._count.communities > 0 || category._count.interests > 0) {
            throw new app_error_1.ConflictError('Cannot delete category that is in use');
        }
        return this.repository.delete(id);
    }
}
exports.CategoryUseCase = CategoryUseCase;
