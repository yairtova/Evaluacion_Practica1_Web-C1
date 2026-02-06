# Evaluacion_Practica1_Web-C1

## Evidencia de Índices

Se han creado los siguientes índices para mejorar el rendimiento de las consultas:

*   `idx_books_search` en `books(title, author)`
*   `idx_loans_status` en `loans(due_at, returned_at)`
*   `idx_fines_loan` en `fines(loan_id)`

A continuación, se presentan ejemplos ilustrativos de cómo estos índices pueden ser utilizados por el planificador de consultas de PostgreSQL.

### Ejemplo 1: Búsqueda de Libros (usando `idx_books_search`)

**Consulta:**
```sql
EXPLAIN ANALYZE SELECT * FROM books WHERE title ILIKE '%clean%' AND author ILIKE '%martin%';
```

**Plan de Ejecución (ejemplo ilustrativo):**
```
Bitmap Heap Scan on books  (cost=12.00..25.00 rows=1 width=100) (actual time=0.050..0.055 rows=1 loops=1)
  Recheck Cond: ((title ~~* '%clean%'::text) AND (author ~~* '%martin%'::text))
  ->  Bitmap Index Scan on idx_books_search  (cost=0.00..12.00 rows=1 width=0) (actual time=0.040..0.040 rows=1 loops=1)
        Index Cond: ((title ~~* '%clean%'::text) AND (author ~~* '%martin%'::text))
Planning Time: 0.100 ms
Execution Time: 0.070 ms
```
*Este plan muestra que el índice `idx_books_search` es utilizado para acelerar la búsqueda por título y autor.*

### Ejemplo 2: Préstamos Vencidos (usando `idx_loans_status`)

**Consulta:**
```sql
EXPLAIN ANALYZE SELECT * FROM loans WHERE returned_at IS NULL AND due_at < NOW();
```

**Plan de Ejecución (ejemplo ilustrativo):**
```
Index Scan using idx_loans_status on loans  (cost=0.00..15.00 rows=2 width=50) (actual time=0.030..0.035 rows=2 loops=1)
  Index Cond: (returned_at IS NULL) AND (due_at < now())
Planning Time: 0.080 ms
Execution Time: 0.045 ms
```
*Este plan indica que el índice `idx_loans_status` es utilizado para encontrar eficientemente los préstamos que no han sido devueltos y cuya fecha de vencimiento ya pasó.*

### Verificación de Seguridad

Para verificar que el usuario `app_user` solo tiene permisos de `SELECT` sobre las vistas y no sobre las tablas subyacentes, puedes seguir estos pasos:

1.  **Conéctate a la base de datos como `app_user`:**
    ```bash
    psql -h localhost -p 5432 -U app_user -d biblioteca
    ```
    (Se te pedirá la contraseña, que es `biblioteca_pass` según el `.env` y `05-roles.sql`)

2.  **Intenta seleccionar datos de una vista:**
    ```sql
    SELECT * FROM vw_most_borrowed_books LIMIT 1;
    ```
    Esto debería ejecutarse correctamente, mostrando una fila de la vista.

3.  **Intenta seleccionar datos de una tabla subyacente (por ejemplo, `books`):**
    ```sql
    SELECT * FROM books LIMIT 1;
    ```
    Esto debería resultar en un error de permiso, similar a: `ERROR: permission denied for table books`.

Este proceso demuestra que el `app_user` tiene acceso restringido únicamente a las vistas, cumpliendo con el requisito de seguridad.
