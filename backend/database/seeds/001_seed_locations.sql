-- ============================================================================
-- CampusSignal — Database Seed: 001_seed_locations.sql
-- Purpose: Populate clearly labelled example buildings and test zones
-- Idempotent: Safe to execute multiple times (ON CONFLICT DO NOTHING)
-- Note: No fake or fabricated network test measurements are inserted.
-- ============================================================================

INSERT INTO locations (building_name, floor, zone_name, description, target_ap, is_active)
VALUES
    ('Example Building A', 0, 'Example Zone A1', 'Example location for development and testing.', NULL, true),
    ('Example Building A', 1, 'Example Zone A2', 'Example location for development and testing.', NULL, true),
    ('Example Building B', 0, 'Example Zone B1', 'Example location for development and testing.', NULL, true)

ON CONFLICT (building_name, floor, zone_name) DO NOTHING;
