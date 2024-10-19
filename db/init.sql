-- Set character encoding
SET NAMES 'utf8mb4';

-- Create database
CREATE DATABASE IF NOT EXISTS `queenless_pollination_platform`;

-- Select database
USE `queenless_pollination_platform`;

-- Create products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    email VARCHAR(255) NOT NULL,
    address TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Add initial products
INSERT INTO products (name, price, description) VALUES
('小蜂箱', 799.00, '適合小型溫室的蜂箱。'),
('大蜂箱', 1599.00, '適合大型溫室的蜂箱。');

-- Add initial orders using 台大地址
INSERT INTO orders (name, email, address, product_id, quantity) VALUES
('呀哈哈', 'test@test.com', '臺北市大安區羅斯福路四段1號', 1, 1),
('呀哈哈', 'test@test.com', '臺北市大安區羅斯福路四段1號', 2, 3);