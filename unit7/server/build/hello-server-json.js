"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var server = http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end('{"message": "Hello Json!"}\n');
});
var port = 8000;
server.listen(port);
console.log('Listening on http://localhost:' + port);
//# sourceMappingURL=hello-server-json.js.map