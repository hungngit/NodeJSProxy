/**
 * Module dependencies.
 */
var express = require('express'),
	httpProxy = require('http-proxy'),
	bodyParser = require('body-parser'),
	urldecode = require('urldecode'),
	validUrl = require('valid-url'),
	parse_url = require('url').parse;

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

server.all('/proxy', function(req, res) {
	if (!req.url || !req.url.replace('/proxy?url=', '')){
		res.send('Please, put parameter url with encode!');
		return;
	}
	
	var url = urldecode(req.url.replace('/proxy?url=', ''));
	
	if (!validUrl.isUri(url)){
		res.send('Please, parameter url must be uri!');
		return;
	}
	if (parse_url(req.query.url).path.indexOf('?') < 0){
		url += '?';
	}
	apiProxy.web(req, res, { target: url }, function (req, res) {
		console.log(res);
	});
});

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
	extended: true
}));

module.exports = server;