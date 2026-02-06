DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user') THEN
        DROP ROLE app_user;
    END IF;
END $$;

CREATE ROLE app_user WITH LOGIN PASSWORD 'biblioteca_pass';

-- Quitar permisos por defecto en tablas
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;

-- Dar permisos de SELECT solo sobre las vistas
GRANT SELECT ON vw_most_borrowed_books TO app_user;
GRANT SELECT ON vw_overdue_loans TO app_user;
GRANT SELECT ON vw_fines_summary TO app_user;
GRANT SELECT ON vw_member_activity TO app_user;
GRANT SELECT ON vw_inventory_health TO app_user;