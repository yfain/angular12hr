"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var compression = require("compression");
var path = require("path");
var ws_1 = require("ws");
var model_1 = require("./model");
// HTTP API
var app = express();
app.use(compression());
app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/api/products', function (req, res) {
    res.json(model_1.getProducts(req.query));
});
app.get('/api/products/:id', function (req, res) {
    res.json(model_1.getProductById(parseInt(req.params.id)));
});
app.get('/api/products/:id/reviews', function (req, res) {
    res.json(model_1.getReviewsByProductId(parseInt(req.params.id)));
});
var httpServer = app.listen(8000, 'localhost', function () {
    var _a = httpServer.address(), address = _a.address, port = _a.port;
    console.log('Listening on %s:%s', address, port);
});
// Using WS API
// Create the WebSocket server listening to the same port as HTTP server
var wsServer = new ws_1.Server({ server: httpServer });
wsServer.on('connection', function (ws) {
    ws.on('message', function (message) {
        var subscriptionRequest = JSON.parse(message);
        subscribeToProductBids(ws, subscriptionRequest.productId);
    });
});
setInterval(function () {
    generateNewBids();
    broadcastNewBidsToSubscribers();
}, 2000);
// Helper functions
// The map key is a reference to WebSocket connection that represents a user.
var subscriptions = new Map();
function subscribeToProductBids(client, productId) {
    var products = subscriptions.get(client) || [];
    subscriptions.set(client, products.concat([productId]));
}
// Bid generator
var currentBids = new Map();
function generateNewBids() {
    model_1.getProducts().forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = random(currentBid, currentBid + 5); // Max bid increase is $5
        currentBids.set(p.id, newBid);
    });
}
function broadcastNewBidsToSubscribers() {
    subscriptions.forEach(function (products, ws) {
        if (ws.readyState === 1) {
            var newBids = products.map(function (pid) { return ({
                productId: pid,
                bid: currentBids.get(pid)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}
function random(low, high) {
    return Math.random() * (high - low) + low;
}
//# sourceMappingURL=auction.js.map