"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformUsecase = void 0;
class PlatformUsecase {
    constructor(platformRepository) {
        this.platformRepository = platformRepository;
    }
    async getSummary() {
        const [communities, users, events] = await Promise.all([
            this.platformRepository.getCommunities(),
            this.platformRepository.getUsers(),
            this.platformRepository.getEvents(),
        ]);
        return {
            communities,
            users,
            events,
        };
    }
}
exports.PlatformUsecase = PlatformUsecase;
