-- Set character encoding
SET NAMES 'utf8mb4';

-- Create database
CREATE DATABASE IF NOT EXISTS `queenless_pollination_platform`;

-- Select database
USE `queenless_pollination_platform`;

-- Create product table
CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create purchase table
CREATE TABLE purchase (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create purchase_item table (junction table for purchases and products)
CREATE TABLE purchase_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchase(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

-- Add initial products
INSERT INTO product (name, price, description) VALUES
('小蜂箱', 799.00, '適合小型溫室的蜂箱。'),
('大蜂箱', 1599.00, '適合大型溫室的蜂箱。');

-- Add initial purchases using 台大地址
INSERT INTO purchase (name, email, address) VALUES
('呀哈哈', 'test@test.com', '臺北市大安區羅斯福路四段1號'),
('呀哈哈', 'test@test.com', '臺北市大安區羅斯福路四段1號');

-- Add initial purchase_item entries
INSERT INTO purchase_item (purchase_id, product_id, quantity) VALUES
(1, 1, 4),
(1, 2, 5);
