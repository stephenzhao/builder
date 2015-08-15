module.exports = function (file, callback) {
    file.content = 'G.config(' + file.content + ');';
    callback(null);
};