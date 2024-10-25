# Queenless-Pollination-Platform

## Services

1. shopping-frontend: `localhost:3000`
2. ~~ shopping-backend: `localhost:5000` ~~ **Deprecated:** Use routing-backend instead.
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

To reset the database:

```bash
docker-compose down -v; docker-compose up -d --build db
```

To reset the PM2 process (restart the application):

```bash
pm2 delete all; pm2 start ecosystem.config.js
```

### 1. shopping-frontend:

The most important part `PurchaseForm` is located in `shopping/frontend/src/app/purchase/components/PurchaseForm.tsx`.

### 2. routing-backend: 

The routing backend is located in `routing/backend/src/main.py`.

- GET `/product`: Fetches all products from MySQL database. (If the database is not ready, it will fetch products from `routing/backend/data/product.json` instead.)
- POST `/purchase`: Submits a new purchase.

## Slash redirect

About the two parameters related to slash redirect:
- `skipTrailingSlashRedirect` in `shopping/frontend/next.config.mjs`
- `redirect_slashes` in `routing/backend/main.py`

1. A: Default:
    - Config:
        - FE: `skipTrailingSlashRedirect: false`
        - BE: `redirect_slashes=True`
    - Result:
        - FE on docker -> BE on docker: 
            - FE: `GET http://routing-backend:5001/product/ net::ERR_CONNECTION_REFUSED`
            - BE: `"GET /product HTTP/1.1" 307 Temporary Redirect`
        - FE on local machine -> BE on docker: 
            - FE: OK
            - BE: `"GET /product/ HTTP/1.1" 200 OK`
2. B: 
    - Config:
        - FE: `skipTrailingSlashRedirect: false`
        - BE: `redirect_slashes=False`
    - Result:
        - FE on docker -> BE on docker: 
            - FE: `GET http://localhost:3000/api/product 404 (Not Found)`
            - BE: `"GET /product HTTP/1.1" 404 Not Found`
        - FE on local machine -> BE on docker: (same as above)
            - FE: `GET http://localhost:3000/api/product 404 (Not Found)`
            - BE: `"GET /product HTTP/1.1" 404 Not Found`
3. C: (same as B)
    - Config:
        - FE: `skipTrailingSlashRedirect: true`
        - BE: `redirect_slashes=False`
    - Result: 
        - FE on docker -> BE on docker: (same as above)
            - FE: `GET http://localhost:3000/api/product 404 (Not Found)`
            - BE: `"GET /product HTTP/1.1" 404 Not Found`
        - FE on local machine -> BE on docker: (same as above)
            - FE: `GET http://localhost:3000/api/product 404 (Not Found)`
            - BE: `"GET /product HTTP/1.1" 404 Not Found`
4. D:
    - Config:
        - FE: `skipTrailingSlashRedirect: true`
        - BE: `redirect_slashes=True`
    - Result: ?