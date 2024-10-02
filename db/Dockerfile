# Use the official MySQL 8.4.2 image as the base
FROM mysql:8.4.2

# Copy a SQL script to initialize the database
COPY init.sql /docker-entrypoint-initdb.d/

# Set the default command to run MySQL
CMD ["mysqld"]