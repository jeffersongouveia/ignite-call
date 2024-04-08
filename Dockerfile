# Use the official image as a parent image
FROM mysql:latest

# Set the MYSQL_ROOT_PASSWORD environment variable
ENV MYSQL_ROOT_PASSWORD=passwd

# Expose port 3306 to the outside world
EXPOSE 3306

# Run the command on container startup
CMD ["mysqld"]