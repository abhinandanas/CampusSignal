-- ============================================================================
-- CampusSignal — Database Migration: 001_create_tables.sql
-- Purpose: Create initial relational tables, constraints, and query indexes
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table: locations
-- Represents physical campus buildings, floors, and specific test zones
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_name VARCHAR(100) NOT NULL CHECK (length(trim(building_name)) > 0),
    floor INTEGER NOT NULL,
    zone_name VARCHAR(120) NOT NULL CHECK (length(trim(zone_name)) > 0),
    description TEXT,
    target_ap VARCHAR(64),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_location_building_floor_zone UNIQUE (building_name, floor, zone_name)
);
-- Index for searching and filtering by building
-- Index for searching and filtering by building
CREATE INDEX IF NOT EXISTS idx_locations_active_building ON locations(is_active, building_name);

-- ----------------------------------------------------------------------------
-- Table: network_tests
-- Stores empirical Wi-Fi throughput and latency measurements submitted by clients
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS network_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    download_speed_mbps DECIMAL(8, 2) NOT NULL CHECK (download_speed_mbps BETWEEN 0.0 AND 10000.0),
    upload_speed_mbps DECIMAL(8, 2) NOT NULL CHECK (upload_speed_mbps BETWEEN 0.0 AND 10000.0),
    latency_ms DECIMAL(8, 2) NOT NULL CHECK (latency_ms BETWEEN 0.0 AND 10000.0),
    jitter_ms DECIMAL(8, 2) CHECK (jitter_ms BETWEEN 0.0 AND 10000.0),
    packet_loss_percent DECIMAL(5, 2) CHECK (packet_loss_percent >= 0.0 AND packet_loss_percent <= 100.0),
    quality_category VARCHAR(16) NOT NULL CHECK (quality_category IN ('Good', 'Moderate', 'Poor')),
    network_ssid VARCHAR(64),
    client_device VARCHAR(255),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Query performance indexes for dashboard and history aggregation
CREATE INDEX IF NOT EXISTS idx_network_tests_location_id ON network_tests(location_id);
CREATE INDEX IF NOT EXISTS idx_network_tests_recorded_at ON network_tests(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_network_tests_location_recorded_at ON network_tests(location_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_network_tests_quality ON network_tests(quality_category);
