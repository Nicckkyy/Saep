CREATE DATABASE IF NOT EXISTS saep_db;
USE saep_db;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  senha VARCHAR(255) NOT NULL
);

-- -----------------------------------------------------
-- Tabela 2: produtos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT NULL,
  preco DECIMAL(10,2) NOT NULL,
  quantidade_estoque INT NOT NULL,
  estoque_minimo INT NOT NULL
);

-- -----------------------------------------------------
-- Tabela 3: movimentacoes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS movimentacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produto_id INT NOT NULL,
  usuario_id INT NOT NULL,
  tipo ENUM('entrada', 'saida') NOT NULL,
  quantidade INT NOT NULL,
  data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- Definição das Chaves Estrangeiras (Foreign Keys) conforme DER
  CONSTRAINT fk_movimentacoes_produtos
    FOREIGN KEY (produto_id)
    REFERENCES produtos (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    
  CONSTRAINT fk_movimentacoes_usuarios
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- POPULAÇÃO DE DADOS (INSERTS) - Requisito: Mínimo 3 por tabela
-- -----------------------------------------------------

-- Inserindo Usuários
INSERT INTO usuarios (nome, email, senha) VALUES 
('Rafael Macharete', 'rafael@saep.com', 'admin123'),
('Gestor de Estoque', 'gestor@saep.com', 'senha456'),
('Colaborador', 'colab@saep.com', 'user789');

-- Inserindo Produtos
-- Atenção: Coluna 'quantidade_estoque' conforme seu DER
INSERT INTO produtos (nome, descricao, preco, quantidade_estoque, estoque_minimo) VALUES 
('Martelo de Unha', 'Cabo emborrachado anti-impacto', 29.90, 50, 10),
('Chave Phillips', 'Haste em cromo vanádio', 15.50, 8, 5),
('Serrote Profissional', 'Lâmina de aço temperado', 45.00, 20, 5);

-- Inserindo Movimentações
INSERT INTO movimentacoes (produto_id, usuario_id, tipo, quantidade, data_movimentacao) VALUES 
(1, 1, 'entrada', 50, '2025-12-01 08:00:00'), -- Entrada inicial de Martelos
(2, 2, 'saida', 2, '2025-12-01 10:00:00'),    -- Saída de Chaves (Estoque baixou)
(3, 3, 'entrada', 10, '2025-12-01 14:30:00');  -- Entrada de Serrotes