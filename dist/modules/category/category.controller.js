"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = categoryRoutes;
const category_usecase_1 = require("./category.usecase");
const category_repository_1 = require("./category.repository");
const category_schema_1 = require("./category.schema");
const zod_to_json_schema_1 = require("zod-to-json-schema");
const auth_middleware_1 = require("../auth/auth.middleware");
async function categoryRoutes(app) {
    const repository = new category_repository_1.CategoryRepository();
    const useCase = new category_usecase_1.CategoryUseCase(repository);
    // Public routes
    app.get('/', {
        schema: {
            querystring: (0, zod_to_json_schema_1.zodToJsonSchema)(category_schema_1.listCategoriesSchema)
        }
    }, async (request, reply) => {
        const params = request.query;
        const categories = await useCase.listCategories(params);
        return reply.send(categories);
    });
    app.get('/:id', async (request, reply) => {
        const { id } = request.params;
        const category = await useCase.getCategoryById(id);
        return reply.send(category);
    });
    // Protected routes (admin only)
    app.register(async function (app) {
        app.addHook('onRequest', auth_middleware_1.authenticate);
        app.addHook('onRequest', (0, auth_middleware_1.authorizeRole)(['admin']));
        app.post('/', {
            schema: {
                body: (0, zod_to_json_schema_1.zodToJsonSchema)(category_schema_1.createCategorySchema)
            }
        }, async (request, reply) => {
            const data = request.body;
            const category = await useCase.createCategory(data);
            return reply.status(201).send(category);
        });
        app.put('/:id', {
            schema: {
                body: (0, zod_to_json_schema_1.zodToJsonSchema)(category_schema_1.updateCategorySchema)
            }
        }, async (request, reply) => {
            const { id } = request.params;
            const data = request.body;
            const category = await useCase.updateCategory(id, data);
            return reply.send(category);
        });
        app.delete('/:id', async (request, reply) => {
            const { id } = request.params;
            await useCase.deleteCategory(id);
            return reply.status(204).send();
        });
    });
}
