module.exports = function (file, callback) {
    file.content = 'return ' + file.content;

    callback(null);
};