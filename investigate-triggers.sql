-- =================================================================
-- INVESTIGATE TRIGGERS
-- Run this to see exactly what triggers are active on the 'products' table
-- =================================================================

SELECT 
    tgname AS trigger_name,
    proname AS function_called,
    CASE WHEN (tgtype & 2)::boolean THEN 'BEFORE' ELSE 'AFTER' END as timing,
    CASE WHEN (tgtype & 4)::boolean THEN 'INSERT' ELSE '' END || 
    CASE WHEN (tgtype & 8)::boolean THEN 'DELETE' ELSE '' END ||
    CASE WHEN (tgtype & 16)::boolean THEN 'UPDATE' ELSE '' END as event
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'public.products'::regclass;

