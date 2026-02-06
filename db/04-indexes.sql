CREATE INDEX idx_books_search ON books(title, author);
CREATE INDEX idx_loans_status ON loans(due_at, returned_at);
CREATE INDEX idx_fines_loan ON fines(loan_id);