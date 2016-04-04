/**
 * Module dependencies.
 */
var express = require('express');
var httpProxy = require('http-proxy');
var bodyParser = require('body-parser');

// Solution for forwarding from http to https taken from:
// http://stackoverflow.com/questions/15801014/how-to-use-node-http-proxy-for-http-to-https-routing
var proxyOptions = {
	changeOrigin: true
};

httpProxy.prototype.onError = function (err) {
	console.log(err);
};

var apiProxy = httpProxy.createProxyServer(proxyOptions);

// Node express server setup.
var server = express();
server.use(express.static(__dirname + '/public'));

server.all("/proxy*", function(req, res) {
	console.log('------------------------------------');
	console.log(req.headers);
	apiProxy.web(req, res, { target: req.query.url});
});

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
	extended: true
}));

module.exports = server;