var http = require('http');
var url = require('url');
var fs = require('fs');


//start the server
var server = http.createServer().listen(2000);//server listens on port 2000
var read = fs.readFileSync('sightings.json', 'utf8');
var parsed = JSON.parse(read)

server.on('request', function(request, response){
	var urlObj = url.parse(request.url);
	var path = urlObj.pathname;

	if(path === '/sightings' && urlObj.query){


		var queryPortion = urlObj.query.split('=');
		
		// the client should be able to get info by location
		// 	looping and the when finding, printing out it to the browser
		if (queryPortion[0] === 'location') {
			var foundIt = false;
			var arr = [];

			var real = queryPortion[1].replace('%20', ' ').replace('%2C',',').toLowerCase();
			parsed.forEach(function(val){
				if(val.location.toLowerCase() === real){
				arr.push(val)	
				foundIt = true;
				}
			}); // look through each location

			// give the response to the client 
			response.writeHead(200, {'Content-Type': 'application/json'})
			response.write(JSON.stringify(arr))
			response.end();

			if(foundIt === false){
				var location = {error: "the location is not found"};
				response.writeHead(200, {'Content-Type': 'application/json'});
				response.write(JSON.stringify(location));
				response.end();
			}
		}// look for a location
		//the client should be able to get info by date
		else if (queryPortion[0] === 'date') {
			var foundIt = false;
			var arr = [];

			parsed.forEach(function(val){
				if (val.occurred.match(/\d+\/\d+\/\d+/ig).join() === queryPortion[1]) {
					arr.push(val);
					foundIt = true;
				}
			}); // look through each date

			// give the response to the client 
			response.writeHead(200, {'Content-Type': 'application/json'});
			response.write(JSON.stringify(arr));
			response.end();

			//throw an error case	
			if (foundIt = false) {
				var date = {error: "the date is not found"};
				response.writeHead(200, {'Content-Type': 'application/json'});
				response.write(JSON.stringify(date));
				response.end();
			}
		}// look for a date

		//the client should be able to get info by shape
		else if (queryPortion[0] === 'shape') {
			var foundIt = false;
			var arr = [];

			parsed.forEach(function(val){
				if(val.shape.toLowerCase() === queryPortion[1].toLowerCase()){
					arr.push(val)
					foundIt = true;
				}
			}); //look through each shape;
			// give the response to the client
			response.writeHead(200, {'Content-Type': 'application/json'});
			response.write(JSON.stringify(arr));
			response.end();

			//throw an error case
			if (foundIt = false) {
				var date = {error: "the shape is not found"};
				response.writeHead(200, {'Content-Type': 'application/json'});
				response.write(JSON.stringify(date));
				response.end();
			}
		}// look for a shape

		// //the client should be able to get info by ID
		else if (queryPortion[0] === 'id') {
			var foundIt = false;

			parsed.forEach(function(val){
				if (val.id === parseInt(queryPortion[1])) {
					response.writeHead(200, {'Content-Type': 'application/json'});
					response.write(JSON.stringify(val));
					response.end();
					foundIt = true;
				}
			});
			//throw an error case
			if(foundIt === false){
				var date = {error: "the id is not found"};
				response.writeHead(200, {'Content-Type': 'application/json'});
				response.write(JSON.stringify(date));
				response.end();	
			}
		}
		
	} // end of if
	else if (path === "/") {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write('<!DOCTYPE html><html lang="en"><head></head>');
		response.write('<body><h1>Welcme to the First Contact Database!!!</h1></body>')
		response.write('</html>');
		response.end(); 
	} 
	

}); // server end






		
