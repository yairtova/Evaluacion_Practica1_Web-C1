--- 1. RANKING DE LIBROS (WINDOW FUNCTION)
--- Devuelve: Los libros más solicitados con su posición en el ranking.
--- Grain: Un libro por fila.
--- Métricas: total_prestamos, posicion_ranking.
--- Verify: SELECT * FROM vw_most_borrowed_books WHERE total_prestamos > 0;
CREATE VIEW vw_most_borrowed_books AS
SELECT 
    b.title AS titulo_libro,
    b.author AS autor_libro,
    COUNT(l.id) AS total_prestamos,
    RANK() OVER (ORDER BY COUNT(l.id) DESC) AS posicion_ranking
FROM books b
JOIN copies c ON b.id = c.book_id
JOIN loans l ON c.id = l.copy_id
GROUP BY b.id, b.title, b.author;

--- 2. PRÉSTAMOS VENCIDOS (CTE + CASE)
--- Devuelve: Préstamos que pasaron su fecha de entrega sin ser devueltos.
--- Grain: Un préstamo vencido por fila.
--- Métricas: dias_atraso, monto_sugerido (multa base).
--- Verify: SELECT * FROM vw_overdue_loans WHERE dias_atraso > 0;
CREATE VIEW vw_overdue_loans AS
WITH overdue_calc AS (
    SELECT 
        l.id AS loan_id,
        m.name AS socio,
        b.title AS libro,
        CURRENT_DATE - l.due_at::date AS dias_atraso
    FROM loans l
    JOIN members m ON l.member_id = m.id
    JOIN copies c ON l.copy_id = c.id
    JOIN books b ON c.book_id = b.id
    WHERE l.returned_at IS NULL AND l.due_at < CURRENT_TIMESTAMP
)
SELECT 
    loan_id, socio, libro, dias_atraso,
    CASE 
        WHEN dias_atraso > 15 THEN dias_atraso * 10.0
        ELSE dias_atraso * 5.0
    END AS multa_sugerida
FROM overdue_calc;

--- 3. RESUMEN MENSUAL DE MULTAS (HAVING)
--- Devuelve: Sumatoria de multas agrupadas por mes.
--- Grain: Un mes por fila.
--- Métricas: total_recaudado, ratio_pagado.
--- Verify: SELECT * FROM vw_fines_summary;
CREATE VIEW vw_fines_summary AS
SELECT 
    TO_CHAR(loaned_at, 'YYYY-MM') AS mes_reporte,
    SUM(amount) AS total_monto,
    COUNT(f.id) AS total_multas,
    ROUND((SUM(CASE WHEN paid_at IS NOT NULL THEN amount ELSE 0 END) / SUM(amount)) * 100, 2) AS porcentaje_pagado
FROM fines f
JOIN loans l ON f.loan_id = l.id
GROUP BY mes_reporte
HAVING SUM(amount) > 0;

--- 4. ACTIVIDAD DE SOCIOS (HAVING + COALESCE)
--- Devuelve: Lista de socios y su nivel de uso de la biblioteca.
--- Grain: Un socio por fila.
--- Métricas: total_prestamos, estatus_actividad.
--- Verify: SELECT * FROM vw_member_activity WHERE total_prestamos > 0;
CREATE VIEW vw_member_activity AS
SELECT 
    m.name AS nombre_socio,
    m.member_type AS tipo,
    COALESCE(COUNT(l.id), 0) AS total_prestamos,
    CASE 
        WHEN COUNT(l.id) > 5 THEN 'Muy Activo'
        WHEN COUNT(l.id) BETWEEN 1 AND 5 THEN 'Regular'
        ELSE 'Inactivo'
    END AS estatus_actividad
FROM members m
LEFT JOIN loans l ON m.id = l.member_id
GROUP BY m.id, m.name, m.member_type
HAVING COUNT(l.id) >= 0;

--- 5. SALUD DE INVENTARIO (CASE/COALESCE)
--- Devuelve: Disponibilidad de libros por categoría.
--- Grain: Una categoría por fila.
--- Métricas: stock_total, pct_disponible.
--- Verify: SELECT * FROM vw_inventory_health;
CREATE VIEW vw_inventory_health AS
SELECT 
    b.category AS categoria,
    COUNT(c.id) AS stock_total,
    SUM(CASE WHEN c.status = 'disponible' THEN 1 ELSE 0 END) AS disponibles,
    COALESCE(ROUND((SUM(CASE WHEN c.status = 'disponible' THEN 1 ELSE 0 END)::numeric / COUNT(c.id)) * 100, 2), 0) AS porcentaje_disponibilidad
FROM books b
JOIN copies c ON b.id = c.book_id
GROUP BY b.category;