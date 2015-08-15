module.exports = function (file, callback) {
    var content = file.content;

    content = content.replace(/"/g, '\\"')
                     .replace(/[\r\n]/g, '\\n');

    file.content = 'var _ = require("underscore"); return _.template("' + content + '")';

    callback(null);
};