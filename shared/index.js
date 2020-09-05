const moment = require('moment');

function getCurrentTime() {
    let time = `[${moment().format('DD/MM/YYYY, h:m:s A')}]`;
    time += time.length < 24 ? '\t\t' : '\t';
    return time;
}

function sleep(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    sleep, getRandomInt, getCurrentTime
}