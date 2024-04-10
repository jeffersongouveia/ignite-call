# Use the official image as a parent image
FROM postgres:latest

# Set the MYSQL_ROOT_PASSWORD environment variable
ENV POSTGRES_PASSWORD=passwd

# Expose port 5432 to the outside world
EXPOSE 5432

# Run the command on container startup
CMD ["postgres"]