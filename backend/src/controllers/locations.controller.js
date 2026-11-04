import { createLocationsService } from '../services/locations.service.js';

export function createLocationsController(service = createLocationsService()) {
  return { list: async (_req, res) => {
    const data = await service.list();
    res.json({ status: 'success', count: data.length, data });
  } };
}
