const chalk = require('chalk');

const { articleModel } = require('../models');

const { getCurrentTime, sleep, getRandomInt } = require('../shared');

const kipalogHomePage = 'https://kipalog.com';

const type = 'kipalog';

const kipalogPaginateUrl = (page = 0) => {
    return `${kipalogHomePage}/posts/pagination?filter=top&page=${page}`;
}

const kipalogCrawler = async (browser, article) => {
    let { title, path, tags } = article;

    if (tags.length !== 0)
        tags = tags.map(tag => String(tag.name).toLocaleLowerCase().trim().replace(' ', '-')).join(';');
    else
        tags = 'none';

    const pageUrl = `${kipalogHomePage}${path}`;

    try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    let delay = getRandomInt(500, 10_000);
    console.log(getCurrentTime() + chalk.yellow('Delay... ') + chalk.white.bgRed(`${delay / 1000}s\t`) + chalk.green(pageUrl));
    await sleep(delay);
    await page.goto(pageUrl);

    console.log(getCurrentTime() + chalk.yellow('Crawling...\t') + chalk.green(pageUrl));

        const { htmlContent, textContent } = await page.evaluate(() => {
            const raw = document.getElementById('content');
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
        errors.push(pageUrl);
        console.log(getCurrentTime() + chalk.yellow('Error:\t\t') + chalk.white.bgRed(pageUrl));
    }
}

module.exports = {
    kipalogPaginateUrl,
    kipalogCrawler,
    kipalogHomePage,
    type
}