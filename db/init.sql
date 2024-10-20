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

-- Create customer table
CREATE TABLE customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    email VARCHAR(255) NOT NULL,
    address TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
);

-- Create purchase table
CREATE TABLE purchase (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
);

-- Create purchase_customer_link table (junction table for purchases and customers)
CREATE TABLE purchase_customer_link (
    purchase_id INT NOT NULL,
    customer_id INT NOT NULL,
    PRIMARY KEY (purchase_id, customer_id),
    FOREIGN KEY (purchase_id) REFERENCES purchase(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
);

-- Add initial products
INSERT INTO product (name, price, description) VALUES
('小蜂箱', 799.00, '適合小型溫室的蜂箱。'),
('大蜂箱', 1599.00, '適合大型溫室的蜂箱。');

-- Add initial customers with 台大地址
INSERT INTO customer (name, email, address) VALUES
('呀哈哈', 'yahaha@test.com', '臺北市大安區羅斯福路四段1號'),
('嗚啦啦', 'wulala@test.com', '臺北市大安區羅斯福路四段1號');

-- Add initial purchases
INSERT INTO purchase (product_name) VALUES
('小蜂箱'),  -- Purchase by '呀哈哈'
('大蜂箱');  -- Purchase by '嗚啦啦'

-- Add initial purchase_customer_link entries
INSERT INTO purchase_customer_link (purchase_id, customer_id) VALUES
(1, 1),  -- '呀哈哈' bought 1 小蜂箱
(1, 2),  -- '呀哈哈' bought 2 大蜂箱
(2, 1),  -- '嗚啦啦' bought 1 小蜂箱
(2, 2);  -- '嗚啦啦' bought 2 大蜂箱