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

CREATE TABLE IF NOT EXISTS hospedes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(50),
  quarto VARCHAR(20) NOT NULL,
  checkin DATE,
  checkout DATE,
  cep VARCHAR(20) NOT NULL,
  logradouro VARCHAR(255),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  uf VARCHAR(2),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM hospedes;

USE system_cep;

CREATE TABLE IF NOT EXISTS hospedes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(50),
  quarto VARCHAR(20) NOT NULL,
  checkin DATE,
  checkout DATE,
  cep VARCHAR(20) NOT NULL,
  logradouro VARCHAR(255),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  uf VARCHAR(2),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);