import * as repository from '../repositories/tests.repository.js';
import * as locationsRepository from '../repositories/locations.repository.js';
import { classifyStatus } from '../validators/test.validator.js';

export function createNetworkTestService(testsRepo = repository, locationRepo = locationsRepository) {
  return {
    async create(input) {
      const location = await locationRepo.findById(input.locationId);
      if (!location) return null;
      return testsRepo.create({ ...input, status: classifyStatus(input.downloadMbps) });
    },
    list: (filters) => testsRepo.findAll(filters),
    get: (id) => testsRepo.findById(id),
  };
}
