# Queenless-Pollination-Platform

## Services

1. shopping-frontend: `localhost:3000`
2. shopping-backend: `localhost:5000`
3. routing-backend: `localhost:5001`

## Setup

### 1. Setup `.env` file.

You can copy `.env.example` to `.env` and modify it, but **USE YOUR OWN PASSWORD** instead of `tmp-password`.

```bash
# In .env
# Password for MySQL root user
MYSQL_ROOT_PASSWORD=your_own_password
```

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
