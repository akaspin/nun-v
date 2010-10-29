var fs = require("fs");
var path = require("path");
var crypto = require('crypto');


function filter(root, url) {
    url = "/" + (url || "") + "/";
    function baseUrl(name) {
        return path.normalize("/" + url + "/" + name);
    }
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
}
exports.filter = filter; 