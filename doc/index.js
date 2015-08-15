var mkdirp = require('mkdirp');
var path = require('path');
var markdox = require('./markdox');

module.exports = function (callback) {
    var fileInfo = this.file;
    var config = this.config;
    var docPath = config.docs + fileInfo.id;

    mkdirp(path.dirname(docPath), function (err) {
        if (err) {
            return callback(new Error('Fail to mkdir: ' + path.dirname(docPath)));
        }

        var options = {
            output: docPath + '.md',
            id: fileInfo.id
        };

        markdox.process(config.src + fileInfo.id, options, function(err) {
            if (err) {
                throw err;
            }
        });
    });

    callback(null);
};