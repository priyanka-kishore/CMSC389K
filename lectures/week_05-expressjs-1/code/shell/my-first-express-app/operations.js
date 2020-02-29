// we'll show how to export these functions into other files (index.js) using modules

function factorial(num) {
    if (num == 0 || num == 1) return 1;
    return num * factorial(num - 1);
}

function square(num) {
    return num*num;
}

function sqroot(num) {
    return Math.sqrt(num);
}

module.exports = { // js key (name) -value (func) object
    factorial: factorial,
    square: square,
    sqroot: sqroot
}