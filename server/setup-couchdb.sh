#!/bin/bash

# Wait for CouchDB to be ready
echo "Waiting for CouchDB to be ready..."
until curl -s http://localhost:5984/ > /dev/null; do
  sleep 1
done

# Create the system databases
echo "Creating system databases..."
curl -X PUT http://admin:password@localhost:5984/_users
curl -X PUT http://admin:password@localhost:5984/_replicator
curl -X PUT http://admin:password@localhost:5984/_global_changes

# Create application databases
echo "Creating application databases..."
curl -X PUT http://admin:password@localhost:5984/osm_tiles
curl -X PUT http://admin:password@localhost:5984/dispatch_logs
curl -X PUT http://admin:password@localhost:5984/geocode_cache

# Enable CORS
echo "Enabling CORS..."
curl -X PUT http://admin:password@localhost:5984/_node/nonode@nohost/_config/httpd/enable_cors -d '"true"'
curl -X PUT http://admin:password@localhost:5984/_node/nonode@nohost/_config/cors/origins -d '"*"'
curl -X PUT http://admin:password@localhost:5984/_node/nonode@nohost/_config/cors/credentials -d '"true"'
curl -X PUT http://admin:password@localhost:5984/_node/nonode@nohost/_config/cors/methods -d '"GET, PUT, POST, HEAD, DELETE"'
curl -X PUT http://admin:password@localhost:5984/_node/nonode@nohost/_config/cors/headers -d '"accept, authorization, content-type, origin, referer"'

echo "CouchDB setup completed!"
