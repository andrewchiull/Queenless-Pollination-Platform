-- Set character encoding
SET NAMES 'utf8mb4';

-- Create database
CREATE DATABASE IF NOT EXISTS `queenless_pollination_platform`;

-- Select database
USE `queenless_pollination_platform`;

-- -- Create product table
-- CREATE TABLE product (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
--     price DECIMAL(10, 2) NOT NULL,
--     description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create purchase table
-- CREATE TABLE purchase (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
--     purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create customer table
-- CREATE TABLE customer (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
--     email VARCHAR(255) NOT NULL,
--     address TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
-- );

-- -- Create purchase_customer_link table (junction table for purchases and customers)
-- CREATE TABLE purchase_customer_link (
--     purchase_id INT NOT NULL,
--     customer_id INT NOT NULL,
--     PRIMARY KEY (purchase_id, customer_id),
--     FOREIGN KEY (purchase_id) REFERENCES purchase(id) ON DELETE CASCADE,
--     FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
-- );

-- -- Create item table
-- CREATE TABLE item (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     product_id INT NOT NULL,
--     quantity INT NOT NULL,
--     FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
-- );

-- -- Create purchase_item_link table (junction table for purchases and items)
-- CREATE TABLE purchase_item_link (
--     purchase_id INT NOT NULL,
--     item_id INT NOT NULL,
--     PRIMARY KEY (purchase_id, item_id),
--     FOREIGN KEY (purchase_id) REFERENCES purchase(id) ON DELETE CASCADE,
--     FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE
-- );


-- -- Add initial products
-- INSERT INTO product (name, price, description) VALUES
-- ('小蜂箱', 799.00, '適合小型溫室的蜂箱。'),
-- ('大蜂箱', 1599.00, '適合大型溫室的蜂箱。');

-- -- Add initial purchases
-- INSERT INTO purchase (description) VALUES
-- ('purchase #1 by customer #1 "呀哈哈": 小蜂箱 x 1, 大蜂箱 x 2'),
-- ('purchase #2 by customer #2 "嗚啦啦": 小蜂箱 x 2, 大蜂箱 x 1'),
-- ('purchase #3 by customer #1 "呀哈哈": 小蜂箱 x 3, 大蜂箱 x 3');

-- -- Add initial customers with 台大地址
-- INSERT INTO customer (name, email, address) VALUES
-- ('呀哈哈', 'yahaha@test.com', '臺北市大安區羅斯福路四段1號'),
-- ('嗚啦啦', 'wulala@test.com', '臺北市大安區羅斯福路四段1號');

-- -- Add initial purchase_customer_link entries
-- INSERT INTO purchase_customer_link (purchase_id, customer_id) VALUES
-- (1, 1),  -- purchase #1 by customer #1 '呀哈哈'
-- (2, 2),  -- purchase #2 by customer #2 '嗚啦啦'
-- (3, 1);  -- purchase #3 by customer #1 '呀哈哈'

-- -- Add initial item entries
-- INSERT INTO item (product_id, quantity) VALUES
-- (1, 1),  -- purchase #1: 小蜂箱 x 1
-- (2, 2),  -- purchase #1: 大蜂箱 x 2
-- (1, 2),  -- purchase #2: 小蜂箱 x 2
-- (2, 1),  -- purchase #2: 大蜂箱 x 1
-- (1, 3),  -- purchase #3: 小蜂箱 x 3
-- (2, 3);  -- purchase #3: 大蜂箱 x 3

-- -- Add initial purchase_item_link entries
-- INSERT INTO purchase_item_link (purchase_id, item_id) VALUES
-- (1, 1),  -- purchase #1: item #1
-- (1, 2),  -- purchase #1: item #2
-- (2, 3),  -- purchase #2: item #3
-- (2, 4),  -- purchase #2: item #4
-- (3, 5),  -- purchase #3: item #5
-- (3, 6);  -- purchase #3: item #6