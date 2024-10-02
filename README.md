# Queenless-Pollination-Platform

### Prerequisites
- Docker
- Docker Compose

## Database and Application Setup

- In `docker-compose.yml`, if you don't need to expose port 3306 to host, remove `ports: - "3306:3306"`
- In `.env`, **USE YOUR OWN PASSWORD** instead of `tmp-password`.

    ```bash
    # In .env
    MYSQL_DATABASE=queenless-pollination-platform
    MYSQL_ROOT_PASSWORD=**your_own_password**
    ```


Start the services:
```bash
docker-compose up -d
```

### Test connection to MySQL

To check if the connection is successful:

```bash
# Connect to the MySQL container and use mysql CLI.
docker-compose exec db mysql -u root -p
```

```sql
-- In the mysql CLI
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


# Queenless-Pollination-Platform


### API Development

The backend API is located in `shopping/backend/src/routes.ts`. Key endpoints:
- GET `/products`: Fetches all products
- POST `/orders`: Submits a new order

### Frontend Development

The frontend order form is located in `shopping/frontend/src/app/order/components/OrderForm.tsx`.

### Stopping the Application

To stop the application and remove the containers:
```bash
docker-compose down
```

To stop the application and remove the containers, networks, and volumes:
```bash
docker-compose down -v
```