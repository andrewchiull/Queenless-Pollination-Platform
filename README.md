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


## Build a new MySQL image by Dockerfile

**Cautions:**
- In `init.sql`, **USE YOUR OWN PASSWORD** instead of `tmp-password`.
- In `Dockerfile`, if you don't need to expose port 3306 to host, remove `EXPOSE 3306`.


```bash
# Go to the db directory
cd db

# Create a network
docker network create queenless-pollination-platform

# Build the image from Dockerfile
docker build -t queenless-pollination-mysql .

# Run the container
docker run -d \
  --name mysql-queenless \
  --network queenless-pollination-platform \
  --network-alias mysql \
  -v mysql-queenless-data:/var/lib/mysql \
  -p 3306:3306 \
  queenless-pollination-mysql
```

### Test connection to MySQL

To check if the connection is successful:

```bash
# Connect to the MySQL container and use mysql CLI.
docker exec -it mysql-queenless mysql -u root -p
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
