CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    member_type VARCHAR(20) CHECK (member_type IN ('estudiante', 'profesor', 'externo')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    isbn VARCHAR(20) UNIQUE
);

CREATE TABLE copies (
    id SERIAL PRIMARY KEY,
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    barcode VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'disponible' CHECK (status IN ('disponible', 'prestado', 'mantenimiento', 'perdido'))
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    copy_id INT REFERENCES copies(id),
    member_id INT REFERENCES members(id),
    loaned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_at TIMESTAMP NOT NULL,
    returned_at TIMESTAMP
);

CREATE TABLE fines (
    id SERIAL PRIMARY KEY,
    loan_id INT REFERENCES loans(id),
    amount DECIMAL(10,2) NOT NULL,
    paid_at TIMESTAMP
);