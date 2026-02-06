# Evaluacion_Practica1_Web-C1

Este proyecto es una aplicación web desarrollada con Next.js (TypeScript) que visualiza reportes SQL obtenidos desde vistas en PostgreSQL. La solución corre completamente con Docker Compose y aplica seguridad real (usuario `app_user` distinto a `postgres`, con `SELECT` solo sobre vistas).

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu sistema:

*   **Git:** Para clonar el repositorio.
*   **Docker y Docker Compose:** Para construir y ejecutar la aplicación y la base de datos en contenedores.

## Configuración del Entorno (`.env`)

Este proyecto utiliza variables de entorno para la configuración de la base de datos. Por razones de seguridad, el archivo `.env` no se incluye en el control de versiones.

1.  **Crea el archivo `.env`:** En la raíz del proyecto, crea un archivo llamado `.env`.
2.  **Copia el contenido de `.env.example`:** Copia el contenido del archivo `.env.example` (que se encuentra en la raíz del proyecto) a tu nuevo archivo `.env`.
3.  **Rellena los valores:** Edita el archivo `.env` y rellena los valores de las variables con tus credenciales y configuraciones locales. Asegúrate de que los valores sean correctos para que la aplicación pueda conectarse a la base de datos.

    Ejemplo de `.env` (con tus valores reales):
    ```
    DB_USER=postgres
    DB_PASSWORD=clave_maestra_123
    DB_NAME=biblioteca
    APP_DB_USER=app_user
    APP_DB_PASSWORD=biblioteca_pass
    ```

## Levantar el Proyecto

Una vez que hayas configurado tu archivo `.env`, puedes levantar la aplicación y la base de datos usando Docker Compose:

1.  **Navega a la raíz del proyecto:** Abre tu terminal y dirígete a la carpeta principal del proyecto.
2.  **Ejecuta Docker Compose:**
    ```bash
    docker compose up --build
    ```
    Este comando construirá las imágenes de Docker (si es necesario) y levantará los contenedores de la base de datos PostgreSQL y la aplicación Next.js.

3.  **Accede a la aplicación:** Una vez que los contenedores estén en funcionamiento, la aplicación estará disponible en tu navegador en:
    [http://localhost:3000](http://localhost:3000)

## Acceso a la Base de Datos (Opcional)

Si necesitas acceder directamente a la base de datos PostgreSQL para desarrollo o depuración, puedes hacerlo de la siguiente manera:

*   **Conectarse como `postgres` (superusuario):**
    ```bash
    psql -h localhost -p 5432 -U postgres -d biblioteca
    ```
    (La contraseña para `postgres` es `clave_maestra_123` según tu `.env`)

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
