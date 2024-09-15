# Use the official CouchDB image as the base image
FROM couchdb:latest

# Set CouchDB admin credentials
ENV COUCHDB_USER=admin
ENV COUCHDB_PASSWORD=password

# Expose CouchDB's default port
EXPOSE 5984

# Define where CouchDB stores its data
VOLUME ["/opt/couchdb/data"]

# Default entrypoint
CMD ["couchdb"]
