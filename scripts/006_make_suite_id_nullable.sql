-- ============================================
-- Make suite_id nullable in test_executions
-- ============================================
-- Esto permite que los tests del playground se guarden sin estar asociados a una suite

-- Eliminar la restricción NOT NULL de suite_id
ALTER TABLE test_executions 
  ALTER COLUMN suite_id DROP NOT NULL;

-- Ahora los test_executions pueden tener suite_id = NULL
-- Esto es útil para tests ad-hoc del playground que no pertenecen a ninguna suite
