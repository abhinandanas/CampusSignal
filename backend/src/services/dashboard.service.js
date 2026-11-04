import * as repository from '../repositories/tests.repository.js';

export function createDashboardService(repo = repository) {
  return { summary: () => repo.getSummary() };
}
