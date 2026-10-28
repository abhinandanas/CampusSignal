import { createNetworkTestService } from '../services/networkTest.service.js';
import { validateCreateTest, validateId, validateListFilters } from '../validators/test.validator.js';

function badRequest(res, message, details) { return res.status(400).json({ status: 'error', message, details }); }

export function createTestsController(service = createNetworkTestService()) {
  return {
    create: async (req, res) => {
      const { errors } = validateCreateTest(req.body);
      if (errors.length) return badRequest(res, 'Validation failed', errors);
      const data = await service.create(req.body);
      if (!data) return res.status(404).json({ status: 'error', message: 'Location not found', details: [`No location exists with id ${req.body.locationId}`] });
      return res.status(201).json({ status: 'success', message: 'Network test record created successfully', data });
    },
    list: async (req, res) => {
      const { errors, filters } = validateListFilters(req.query);
      if (errors.length) return badRequest(res, 'Invalid query parameters', errors);
      const data = await service.list(filters);
      return res.json({ status: 'success', count: data.length, data });
    },
    get: async (req, res) => {
      const id = validateId(req.params.id);
      if (!id) return badRequest(res, 'Validation failed', ['id must be a positive integer']);
      const data = await service.get(id);
      if (!data) return res.status(404).json({ status: 'error', message: 'Test not found', details: [`No test record exists with id ${id}`] });
      return res.json({ status: 'success', data });
    },
  };
}
