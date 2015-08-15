var async = require('async');
var minimatch = require('minimatch');

module.exports = function (file, callback) {
    var manifest = JSON.parse(file.content);
    var content = 'CACHE MANIFEST\n';
    var baseUrl = manifest.baseUrl || '';
    var db = this.db;
    content += '# ' + (new Date()).toString() + '\n';

    file.addDependences(manifest.cache);

    var fallback = '';
    var network = '';
    if (manifest.fallback) {
        fallback += '\n\n';
        fallback += 'FALLBACK:\n';
        fallback += manifest.fallback.join('\n');
    }

    if (manifest.network) {
        network += '\n\n';
        network += 'NETWORK:\n';
        network += manifest.network.join('\n');
    }

    if (manifest.cache) {
        async.reduce(
            manifest.cache,
            'CACHE:\n',
            function (cache, pattern, next) {
                file.builder.db.find({}, function (err, docs) {
                    docs
                        .forEach(function (doc) {
                            if (doc.filename === file.id) {
                                return;
                            }

                            if (minimatch(doc.filename, pattern)) {
                                cache += baseUrl + doc.filename + '\n';
                            }
                        });

                    next(err, cache);
                });
            },
            function (err, cache) {
                file.content = content + cache + network + fallback;
                callback(null);
            }
        );
    } else {
        file.content = content + network + fallback;
        callback(null);
    }
};