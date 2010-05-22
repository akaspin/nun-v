var sys = require("sys");
var fs = require("fs");
var path = require("path");

//openssl support
var have_openssl;
try {
  var crypto = require('crypto');
  have_openssl=true;
} catch (e) {
  have_openssl=false;
}

function filter(root, url) {
	url = "/" + (url || "") + "/";
	function baseUrl(name) {
		return path.normalize("/" + url + "/" + name);
	}
	
	if (have_openssl) {
		return function(data, callback) {
			var file = path.normalize(root + "/" + data);
			fs.readFile(file, 'binary', function(err, readed) {
				var hash = baseUrl(data);
				if (!err) {
					hash += "?v=" + crypto.createHash("sha1").
							update(readed).digest("hex");
				}
				callback(undefined, hash);
			});
		};
	} else {
		return function(data, callback) {
			callback(undefined,	baseUrl(data));
		};
	}
}
exports.filter = filter; 