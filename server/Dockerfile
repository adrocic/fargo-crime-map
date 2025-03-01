# Use the official CouchDB image as the base image
FROM couchdb:3.4

# Set CouchDB admin credentials
ENV COUCHDB_USER=admin
ENV COUCHDB_PASSWORD=password

# Expose CouchDB's default port
EXPOSE 5984

# Define where CouchDB stores its data
VOLUME ["/opt/couchdb/data"]

# Copy any custom configuration if needed
# COPY local.ini /opt/couchdb/etc/local.d/

# Container is setup by the official image

# Default entrypoint
CMD ["couchdb"]
