import { createLocationsService } from '../services/locations.service.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Factory for creating the Locations Controller.
 * Handles HTTP requests, reads query parameters, coordinates with service,
 * and serializes consistent JSON envelopes.
 *
 * @param {Object} service - Location service instance
 * @returns {Object} Controller with action methods
 */
export function createLocationsController(service = createLocationsService()) {
  return {
    /**
     * GET /api/locations
     * Query parameters: building, floor, search
     */
    list: async (req, res) => {
      const { building, floor, search } = req?.query || {};

      // Validate floor if provided
      if (floor !== undefined && floor !== null && String(floor).trim() !== '') {
        const parsed = Number(floor);
        if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
          return res.status(400).json({
            success: false,
            status: 'error',
            message: 'Invalid query parameters',
            details: ['floor must be a valid integer'],
          });
        }
      }

      const data = await service.list({ building, floor, search });
      return res.json({
        success: true,
        status: 'success',
        count: data.length,
        data,
      });
    },

    /**
     * GET /api/locations/:id
     * Path parameter: id (UUID)
     */
    get: async (req, res) => {
      const id = req?.params?.id;
      if (!id || !UUID_PATTERN.test(id)) {
        return res.status(400).json({
          success: false,
          status: 'error',
          message: 'Validation failed',
          details: ['id must be a valid location UUID'],
        });
      }

      const location = await service.get(id);
      if (!location) {
        return res.status(404).json({
          success: false,
          status: 'error',
          message: 'Location not found',
          details: [`No campus location exists with id ${id}`],
        });
      }

      return res.json({
        success: true,
        status: 'success',
        data: location,
      });
    },
  };
}
