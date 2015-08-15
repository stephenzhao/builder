var Parser = require('./parser');

module.exports = function (file, callback) {
    var source = 'var VNode = require("virtual-dom").VNode;\n';
    source += 'var VText = require("virtual-dom").VText;\n';
    source += 'var VWidget = require("virtual-dom").VWidget;';
    source += 'var __C = [];with(data){\n';

    var parser = new Parser({
        ontext: function (text) {
            if (text) {
                source += '__C.push(new VText("'+text.replace(/\n/, '\\n')+'"));';
            }
        },
        onopentagname: function () {
            source += '__C.push((function () {\nvar __P = {}, __C = [];\n';
        },
        onattribute: function (attr, value) {
            var handler = '__P["' +attr+ '"]';
            var codes = {};
            var hasLogic = false;
            var ret = value.replace(/<%(.*?)%>/g, function (match, exp, i) {
                hasLogic = true;
                if (exp[0] === '=') {
                    codes['___' + i + '___'] = (handler + '+=(' + exp.replace(/^=/, '') + ');\n');
                } else {
                    codes['___' + i + '___'] = exp;
                }
                return '|||___' + i + '___|||';
            });
            var spc = ret.split('|||');
            var code = spc.reduce(function (ret, code) {
                if (/___\d+___/.test(code)) {
                    ret += codes[code];
                } else if (code) {
                    ret += (handler + '+="' +code+ '";\n');
                }
                return ret;
            }, handler + '="";');

            if (spc.length === 1 && !hasLogic) {
                source += handler + '="'+value+'";\n';
            } else {
                source += code;
            }
        },
        onclosetag: function (name) {
            source += 'return new VNode("'+name+'", { attributes : __P }, __C);\n}.bind(this))());';
        },
        onend: function () {
            source += '}\nreturn __C;';
        },
        onattrlogic: function (logic) {
            source += logic.replace(/^%(.*)%$/, '$1\n');
        },
        ontaglogic: function (logic) {
            logic = logic.replace(/^%([\s\S]*)%$/, '$1\n');
            if (logic[0] === '=') {
                source += ('__C.push(new VText(' + logic.replace(/^=/, '') + '));\n');
            } else if (/^!include/.test(logic)) {
                source += ('__C = __C.concat('+ logic.replace(/^!include/, '') +');\n');
            } else if (/^!widget/.test(logic)) {
                source += '__C.push(new VWidget(' + logic.replace(/^!widget/, '')+ '));';
            } else {
                source += logic + '\n';
            }
        }
    }, {
        decodeEntities: true
    });
    parser.write(file.content);
    parser.end();

    file.content = 'return function (data) {\n' + source + '\n}';

    callback();
};