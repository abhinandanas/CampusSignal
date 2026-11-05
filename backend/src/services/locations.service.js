import * as defaultRepository from '../repositories/locations.repository.js';

/**
 * Factory for creating the Locations Service.
 * Implements business logic, query sanitization, and coordinates repository calls.
 *
 * @param {Object} repo - Location data access repository
 * @returns {Object} Locations service instance
 */
export function createLocationsService(repo = defaultRepository) {
  return {
    /**
     * Retrieve campus locations with optional validated filters.
     *
     * @param {Object} [filters] - { building, floor, search }
     * @returns {Promise<Array>} Normalized array of location records
     */
    async list(filters = {}) {
      const sanitizedFilters = {};

      if (filters.building !== undefined && filters.building !== null) {
        const building = String(filters.building).trim();
        if (building.length > 0 && building.length <= 100) {
          sanitizedFilters.building = building;
        }
      }

      if (filters.floor !== undefined && filters.floor !== null && String(filters.floor).trim() !== '') {
        const floorNum = Number.parseInt(filters.floor, 10);
        if (!Number.isNaN(floorNum) && floorNum >= -10 && floorNum <= 100) {
          sanitizedFilters.floor = floorNum;
        }
      }

      if (filters.search !== undefined && filters.search !== null) {
        const search = String(filters.search).trim();
        if (search.length > 0 && search.length <= 100) {
          sanitizedFilters.search = search;
        }
      }

      const locations = await repo.findAll(sanitizedFilters);
      return Array.isArray(locations) ? locations : [];
    },

    /**
     * Retrieve a single campus location by ID.
     *
     * @param {string} id - Location UUID
     * @returns {Promise<Object|null>}
     */
    async get(id) {
      if (!id || typeof id !== 'string') return null;
      return repo.findById(id);
    },
  };
}
