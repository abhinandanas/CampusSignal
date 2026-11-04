import * as repository from '../repositories/locations.repository.js';

export function createLocationsService(repo = repository) {
  return { list: () => repo.findAll() };
}
