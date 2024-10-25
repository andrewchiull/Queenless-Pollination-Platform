# Queenless-Pollination-Platform

## Services

1. shopping-frontend: `localhost:3000`
2. ~~ shopping-backend: `localhost:5001` ~~ **Deprecated:** Use routing-backend instead.
3. routing-backend: `localhost:5001`
4. map-demo: `localhost:3000/map`
5. db: `localhost:3306`: **Table names are SINGULAR!**

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

### 1. shopping-frontend:

The most important part `PurchaseForm` is located in `shopping/frontend/src/app/purchase/components/PurchaseForm.tsx`.

### 2. routing-backend: 

The routing backend is located in `routing/backend/src/main.py`.

- GET `/product`: Fetches all products from MySQL database. (If the database is not ready, it will fetch products from `routing/backend/data/product.json` instead.)
- POST `/purchase`: Submits a new purchase.
