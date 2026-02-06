INSERT INTO members (name, email, member_type, joined_at) VALUES
('Juan Pérez', 'juan.perez@email.com', 'estudiante', '2023-01-15'),
('María García', 'm.garcia@email.com', 'profesor', '2023-02-20'),
('Carlos Rodríguez', 'carlos.rod@email.com', 'externo', '2023-03-10'),
('Ana Martínez', 'ana.mtz@email.com', 'estudiante', '2023-04-05'),
('Luis Hernández', 'luis.h@email.com', 'estudiante', '2023-05-12'),
('Elena Gómez', 'elena.g@email.com', 'profesor', '2023-06-18'),
('Roberto Sánchez', 'roberto.s@email.com', 'externo', '2023-07-22'),
('Lucía Díaz', 'lucia.d@email.com', 'estudiante', '2023-08-30'),
('Fernando Ruiz', 'fer.ruiz@email.com', 'estudiante', '2023-09-14'),
('Sofía Torres', 'sofia.t@email.com', 'profesor', '2023-10-01'),
('Diego Castro', 'diego.c@email.com', 'estudiante', '2023-11-05'),
('Isabel Vega', 'isabel.v@email.com', 'externo', '2023-12-10');

INSERT INTO books (title, author, category, isbn) VALUES
('Clean Code', 'Robert C. Martin', 'Software', '9780132350884'),
('The Pragmatic Programmer', 'Andrew Hunt', 'Software', '9780201616224'),
('Don Quijote de la Mancha', 'Miguel de Cervantes', 'Literatura', '9788424116286'),
('Cien Años de Soledad', 'Gabriel García Márquez', 'Literatura', '9780307474728'),
('Design Patterns', 'Erich Gamma', 'Software', '9780201633610'),
('Introduction to Algorithms', 'Thomas Cormen', 'Ciencia', '9780262033848'),
('Cosmos', 'Carl Sagan', 'Ciencia', '9780345331359'),
('El Aleph', 'Jorge Luis Borges', 'Literatura', '9788420633304'),
('Atomic Habits', 'James Clear', 'Autoayuda', '9780735211292'),
('Refactoring', 'Martin Fowler', 'Software', '9780134757599');

INSERT INTO copies (book_id, barcode, status) VALUES
(1, 'BC-001', 'prestado'), (1, 'BC-002', 'disponible'),
(2, 'BC-003', 'disponible'), (2, 'BC-004', 'mantenimiento'),
(3, 'BC-005', 'prestado'), (3, 'BC-006', 'disponible'),
(4, 'BC-007', 'prestado'), (4, 'BC-008', 'perdido'),
(5, 'BC-009', 'disponible'), (5, 'BC-010', 'disponible'),
(6, 'BC-011', 'prestado'), (7, 'BC-012', 'disponible'),
(8, 'BC-013', 'prestado'), (9, 'BC-014', 'disponible'),
(10, 'BC-015', 'disponible');

INSERT INTO loans (copy_id, member_id, loaned_at, due_at, returned_at) VALUES
(1, 1, '2024-01-01', '2024-01-08', '2024-01-07'), 
(5, 2, '2024-01-05', '2024-01-12', '2024-01-15'), 
(7, 4, '2024-01-10', '2024-01-17', NULL),         
(11, 5, '2024-01-15', '2024-01-22', NULL),        
(13, 8, '2024-01-20', '2024-01-27', NULL),        
(2, 1, '2024-02-01', '2024-02-08', '2024-02-08'), 
(6, 10, '2024-02-05', '2024-02-12', NULL),        
(1, 3, '2023-12-15', '2023-12-22', '2023-12-28'), 
(3, 6, '2024-01-02', '2024-01-09', '2024-01-09');

INSERT INTO fines (loan_id, amount, paid_at) VALUES
(2, 50.00, '2024-01-16'), 
(3, 120.00, NULL),         
(4, 85.00, NULL),         
(8, 45.00, '2023-12-30'); 