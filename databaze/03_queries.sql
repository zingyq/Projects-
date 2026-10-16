SELECT login, email 
FROM users
ORDER BY login ASC; 

SELECT title status 
FROM tasks 
WHERE status = 'done';

SELECT status, COUNT(*) AS liczba_zadan FROM tasks 
GROUP BY status 
ORDER BY cnt DESC;

SELECT tasks.title, users.login 
FROM tasks t
JOIN users u ON t.users_id = u.id; 