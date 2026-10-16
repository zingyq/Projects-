INSERT INTO users (login, email, password_hash, role) VALUES
('us1','us1@example.com','hash1','user'),
('us2','us2@example.com','hash2','user'),
('us3','us3@example.com','hash3','user'),
('alex','admin@example.com','hashadmin','admin'),
('us4','u4@example.com','hash4','user');

INSERT INTO tasks (title, description, status, user_id) VALUES
('Przygotować makietę','Ekran listy i formularza','new', 1),
('Zrobić backend','API do zadań','in_progress', 2),
('Styl UI','Poprawić kolory i interakcje','new', 3),
('Testy','Napisać testy e2e','in_progress', 4),
('Deploy','Wdrążyć na serwer','new', 5);

INSERT INTO comments (content, task_id, user_id) VALUES
('Super pomysł', 1, 2),
('Zgadzam się', 1, 3),
('Dodałem PR', 2, 4),
('Poprawiłem kolor', 3, 1),
('Gotowe do deploy', 5, 4);