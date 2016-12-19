# url-shrt

## About
It's a URL shortener

## How to run
1. Bare metal
	1. Run `npm install`
	2. Change config.js to point to a MongoDB instance
	3. Run `node index.js`

2. Docker
	1. Build the url-shrt image:
	`docker build -t url-shrt .`
	2. Run:
	`docker-compose up -d`

3. Navigate to port 3020

## Features
1. Shortens URLs
2. Cleans up expired URLs every `n` time unit
