# Queenless-Pollination-Platform

## Services

1. shopping-frontend: `localhost:3000`
2. ~~ shopping-backend: `localhost:5000` ~~ **Deprecated:** Use routing-backend instead.
3. routing-backend: `localhost:5001`
4. map-demo: `localhost:3000/map`

## Deployment

### 1. Setup `.env`.

You can copy `.env.example` to `.env` and modify it.

```bash
# /.env
# Password for MySQL root user
MYSQL_ROOT_PASSWORD=YOUR_OWN_PASSWORD

# Mapbox Access Token
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=YOUR_OWN_TOKEN
```

**Or use safer methods like `docker secret` to manage secrets.**

### 2. Start the services:

```bash
docker compose up -d
```

### 3. Stop the services

To stop the application temporarily:
```bash
docker compose stop
```

To start again:
```bash
docker compose start
```

To stop and remove all the containers, networks, and volumes:
```bash
docker compose down -v
```

### 4. If you modified the source code of a service:

To rebuild the whole application:
```bash
docker compose up -d --build
```

To rebuild a certain service without restarting other services:
```bash
docker compose up -d --no-deps --build <service_name>
```

## Development


### 1. shopping-frontend: Frontend for user

The most important part `OrderForm` is located in `shopping/frontend/src/app/order/components/OrderForm.tsx`.

### 2. shopping-backend: APIs for orders

The backend API is located in `shopping/backend/src/routes.ts`.
- GET `/products`: Fetches all products from MySQL database. (If the database is not ready, it will fetch products from `shopping/backend/data/products.json` instead.)
- POST `/orders`: Submits a new order.


### 3. routing-backend: Routing

The routing backend is located in `shopping/routing/backend/src/main.py`.
