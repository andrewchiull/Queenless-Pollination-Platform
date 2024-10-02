# Use the official MySQL 8.4.2 image as the base
FROM mysql:8.4.2

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=tmp-password
ENV MYSQL_DATABASE=queenless-pollination-platform

# Copy a SQL script to initialize the database
COPY init.sql /docker-entrypoint-initdb.d/

# Expose port 3306
EXPOSE 3306

# Set the default command to run MySQL
CMD ["mysqld"]