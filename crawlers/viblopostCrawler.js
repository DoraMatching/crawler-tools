const chalk = require('chalk');
const showdown = require('showdown');

const converter = new showdown.Converter();

const { articleModel } = require('../models');

const { getCurrentTime } = require('../shared');

const viblopostHomePage = 'https://viblo.asia';

const type = 'viblopost';

const viblopostPaginateUrl = (page = 0) => {
    return `${viblopostHomePage}/api/posts/newest?page=${page}&limit=20`;
}

const viblopostCrawler = async (browser, article) => {
    let { title, url, tags, contents } = article;

    console.log(getCurrentTime() + chalk.yellow('Crawling...\t') + chalk.green(url));

    tags = tags.data;

    if (tags.length !== 0)
        tags = tags.map(tag => String(tag.name).toLocaleLowerCase().trim().replace(' ', '-')).join(';');
    else
        tags = 'none';

    let path = url.replace(viblopostHomePage, '');
    let textContent = contents;
    let htmlContent = converter.makeHtml(contents);

    const articleData = { title, path, tags, htmlContent, textContent, from: `${type}` };
    await articleModel.create(articleData);
    console.log(getCurrentTime() + chalk.yellow('Done:\t\t') + chalk.green(url));
    return articleData;
}

module.exports = {
    viblopostPaginateUrl,
    viblopostCrawler,
    viblopostHomePage,
    type
}

// max = 1350
// https://viblo.asia/api/posts/newest?page=4&limit=20