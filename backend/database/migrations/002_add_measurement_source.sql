-- Record whether a measurement came from the browser or an explicitly labelled demo.
-- Safe to apply when the column already exists.
ALTER TABLE network_tests
  ADD COLUMN IF NOT EXISTS measurement_source VARCHAR(16) NOT NULL DEFAULT 'browser';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'network_tests_measurement_source_check'
  ) THEN
    ALTER TABLE network_tests
      ADD CONSTRAINT network_tests_measurement_source_check
      CHECK (measurement_source IN ('browser', 'demo'));
  END IF;
END $$;
