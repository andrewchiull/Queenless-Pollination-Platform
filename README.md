# Queenless-Pollination-Platform

## Todos

- route-planning
    - [ ] Add OR-tools
    - [ ] Compare:
        - [ ] Google Maps API: Route Optimization
        - [ ] OR-tools + Google Maps API: Distance Matrix
        - [ ] Mapbox API: Route Optimization
        - [ ] OR-tools + Mapbox API: Distance Matrix
    - [ ] Frontend
        - [ ] Next.js
        - [ ] how to access from shopping
- [ ] Containerization
    - [ ] docker-compose

## Docker

### Install MySQL 8.4.2
See:
1. [建置多容器應用程式（MySQL、Docker Compose） | Microsoft Learn](https://learn.microsoft.com/zh-tw/visualstudio/docker/tutorials/tutorial-multi-container-app-mysql#prerequisites)
2. [mysql - Official Image | Docker Hub](https://hub.docker.com/_/mysql)

Cautions:
- In the command line, **USE YOUR OWN PASSWORD** instead of `tmp-password`.
- If you don't need to expose port 3306 to host, remove `-p 3306:3306` from the `docker run` command.

```bash
# Create a network
docker network create queenless-pollination-platform

# Run the MySQL container
docker run -d \
  --name mysql-queenless \
  --network queenless-pollination-platform --network-alias mysql \
  -v mysql-queenless-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=tmp-password \
  -e MYSQL_DATABASE=queenless-pollination-platform \
  -p 3306:3306 \
  mysql:8.4.2
```

### Connect to MySQL

```bash
# Connect to the MySQL container and use mysql CLI.
docker exec -it mysql-queenless mysql -u root -p
```

To check if the connection is successful, type `SHOW DATABASES;` in the mysql CLI.
```sql
SHOW DATABASES;
```

You should see the `queenless-pollination-platform` in the database list, like this:
```text
mysql> SHOW DATABASES;
+--------------------------------+
| Database                       |
+--------------------------------+
| information_schema             |
| mysql                          |
| performance_schema             |
| queenless-pollination-platform |
| sys                            |
+--------------------------------+
5 rows in set (0.00 sec)
```

If needed, type `exit` to exit the mysql CLI.

### Create tables

```sql
-- Select database
USE `queenless-pollination-platform`;

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
```
