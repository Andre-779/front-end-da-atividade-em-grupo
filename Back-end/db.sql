CREATE DATABASE system_cep;

USE system_cep;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

SELECT * FROM usuarios;

INSERT INTO usuarios (nome, email, senha, role) 
VALUES ('will pascini', 'will@email.com', '123456', 'user');