# Wait for CouchDB to be ready
Write-Host "Waiting for CouchDB to be ready..."
do {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5984/" -Method Get -ErrorAction SilentlyContinue
        $ready = $response -ne $null
    }
    catch {
        $ready = $false
        Start-Sleep -Seconds 1
    }
} until ($ready)

# Create the system databases
Write-Host "Creating system databases..."
Invoke-WebRequest -Uri "http://admin:password@localhost:5984/_users" -Method Put
Invoke-WebRequest -Uri "http://admin:password@localhost:5984/_replicator" -Method Put
Invoke-WebRequest -Uri "http://admin:password@localhost:5984/_global_changes" -Method Put

# Create application databases
Write-Host "Creating application databases..."
Invoke-WebRequest -Uri "http://admin:password@localhost:5984/osm_tiles" -Method Put
Invoke-WebRequest -Uri "http://admin:password@localhost:5984/dispatch_logs" -Method Put
Invoke-WebRequest -Uri "http://admin:password@localhost:5984/geocode_cache" -Method Put

# Enable CORS
Write-Host "Enabling CORS..."
Invoke-WebRequest -Uri "http://admin:password@localhost:5984/_node/nonode@nohost/_config/httpd/enable_cors" -Method Put -Body '"true"' -ContentType "application/json"
Invoke-WebRequest -Uri "http://admin:password@localhost:5984/_node/nonode@nohost/_config/cors/origins" -Method Put -Body '"*"' -ContentType "application/json"
Invoke-WebRequest -Uri "http://admin:password@localhost:5984/_node/nonode@nohost/_config/cors/credentials" -Method Put -Body '"true"' -ContentType "application/json"
Invoke-WebRequest -Uri "http://admin:password@localhost:5984/_node/nonode@nohost/_config/cors/methods" -Method Put -Body '"GET, PUT, POST, HEAD, DELETE"' -ContentType "application/json"
Invoke-WebRequest -Uri "http://admin:password@localhost:5984/_node/nonode@nohost/_config/cors/headers" -Method Put -Body '"accept, authorization, content-type, origin, referer"' -ContentType "application/json"

Write-Host "CouchDB setup completed!"
