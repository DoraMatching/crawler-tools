const chalk = require('chalk');

const { articleModel } = require('../models');

const { getCurrentTime, sleep, getRandomInt } = require('../shared');
const { errors } = require('puppeteer');

const daynhauhocHomePage = 'https://daynhauhoc.com';

const type = 'daynhauhoc';

const daynhauhocPaginateUrl = (page = 0) => {
    return `${daynhauhocHomePage}/latest.json?no_definitions=true&page=${page}`;
}

const daynhauhocCrawler = async (browser, article) => {
    let { id, title, slug, tags } = article;

    if (tags.length !== 0)
        tags = tags.map(tag => String(tag).toLocaleLowerCase().trim().replace(' ', '-')).join(';');
    else
        tags = 'none';

    let path = `/t/${slug}/${id}`;
    const pageUrl = `${daynhauhocHomePage}${path}`;

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    let delay = getRandomInt(500, 3_000);
    console.log(getCurrentTime() + chalk.yellow('Delay... ') + chalk.white.bgRed(`${delay / 1000}s\t`) + chalk.green(pageUrl));
    await sleep(delay);
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    try {
    console.log(getCurrentTime() + chalk.yellow('Crawling...\t') + chalk.green(pageUrl));

        const { htmlContent, textContent } = await page.evaluate(() => {
            const raw = document.querySelectorAll('#post_1 > div > div.topic-body.clearfix > div.regular.contents')[0];
            const htmlContent = raw.outerHTML;
            const { textContent } = raw;
            return { htmlContent, textContent };
        });

        page.close();
        const articleData = { title, path, tags, htmlContent, textContent, from: `${type}` };
        await articleModel.create(articleData);
        console.log(getCurrentTime() + chalk.yellow('Done:\t\t') + chalk.green(pageUrl));
        return articleData;
    } catch (e) {
        global.errors.push(pageUrl);
        console.log(getCurrentTime() + chalk.yellow('Error:\t\t') + chalk.white.bgRed(pageUrl));
        page.close();
    }
}

module.exports = {
    daynhauhocPaginateUrl,
    daynhauhocCrawler,
    daynhauhocHomePage,
    type
}
// max = 1358x20
// https://daynhauhoc.com/latest.json?no_definitions=true&page=200