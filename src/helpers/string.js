export function toCamelCase(str) {
    return str.split(' ').map(function (item, index) {
        return index !== 0
            ? item.charAt(0).toUpperCase() + item.substr(1)
            : item.charAt(0).toLowerCase() + item.substr(1);
    }).join('');
}