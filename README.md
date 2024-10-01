# Queenless-Pollination-Platform

## Todos

- shopping
    - [ ] Install dependencies
    - [x] Install MySQL
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

## address-to-latlon
[運輸資料流通服務平臺(Transport Data eXchange , TDX) | TDX 運輸資料流通服務](https://tdx.transportdata.tw/)
[2024 [地址轉換經緯度]TDX地址轉經緯度小工具(期間限定)](https://www.spatialgeolab.com/address-to-latlon-part3/)
[地理編碼服務  |  Maps JavaScript API  |  Google for Developers](https://developers.google.com/maps/documentation/javascript/geocoding?hl=zh-tw)

## Docker

### Get started

See [Get Docker Desktop | Docker Docs](https://docs.docker.com/get-started/introduction/get-docker-desktop/)

### Run hello-world

```bash
# run the hello-world container
docker run -d -p 8080:80 docker/welcome-to-docker

# open in browser to see the result
open http://localhost:8080/
```

## Database: MySQL

### Install MySQL 8.4.2
See:
1. [建置多容器應用程式（MySQL、Docker Compose） | Microsoft Learn](https://learn.microsoft.com/zh-tw/visualstudio/docker/tutorials/tutorial-multi-container-app-mysql#prerequisites)
2. [mysql - Official Image | Docker Hub](https://hub.docker.com/_/mysql)

Cautions:
- In the command line, use your own password instead of `tmp-password`.
- If you don't need to expose port 3306 to host, remove `-p 3306:3306` from the command.

```bash
# create a network
docker network create queenless-pollination-platform

# run the MySQL container
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

# In the mysql CLI, show databases.
SHOW DATABASES;
```

You should see the `queenless-pollination-platform` in the database list, like this:
```
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

### Select database and create tables

```sql
-- Select database
USE `queenless-pollination-platform`;

-- Create products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create buyers table
CREATE TABLE buyers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```
