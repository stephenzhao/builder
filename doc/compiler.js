var compiler = {}

var getCommentName = function(id) {
    var result = '' +
        '/**\n' +
        ' * @name ' + id + '\n' +
        ' */\n';

    return result;
};

var getCommentEvents = function(codeStr) {
    var result;
    var eventsMatch = codeStr.match(/.*events:[\s\S]*?}/);

    // 存在 events 列表
    if (Array.isArray(eventsMatch)) {

        // events 列表中没有 'click': function(e) { } 这种形式
        if (!eventsMatch[0].match(/:\s*function/)) {
            eventsMatch = eventsMatch[0].split(/\n/).map(function(str) {
                return ' * ' + str + '\n';
            });

            result =
                '/**\n' +
                ' * Events list: \n' +
                eventsMatch.join('') +
                ' */\n';
        } else {
            result = '';
        }
    } else {
        result = '';
    }

    return result;
};

compiler.compile = function (filepath, data, options) {
    var commentEvents = getCommentEvents(data);

    return commentEvents + data;
};

module.exports = compiler;