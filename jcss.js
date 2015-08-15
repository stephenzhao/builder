module.exports = function (file, callback) {
    var content = 'var style = document.createElement("style");';
    content += 'var baseUrl = module.url.replace(/\\/[^\\/]*?$/, "\/");';
    content += 'var head = document.getElementsByTagName("head")[0];';
    content += 'style.setAttribute("type", "text/css");';

    content += 'style.textContent="' +
        file.content
            .replace(/"/g, '\\"')
            .replace(/[\r\n]/g, '\\n')
            .replace(/url\((['"]?)((?!(https?:)?\/\/|\/).*?)\1\)/g, 'url(" + baseUrl + "$2" + ")') +
        '";';

    content += 'head.appendChild(style);';

    file.content = content;

    callback(null);
};