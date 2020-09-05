const chalk = require('chalk');

const { articleModel } = require('../models');

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
    console.log(chalk.yellow('Crawling... ') + chalk.green(pageUrl));

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(pageUrl);

    const { htmlContent, textContent } = await page.evaluate(() => {
        const raw = document.querySelectorAll('#post_1 > div > div.topic-body.clearfix > div.regular.contents')[0];
        const htmlContent = raw.outerHTML;
        const { textContent } = raw;
        return { htmlContent, textContent };
    });

    page.close();
    const articleData = { title, path, tags, htmlContent, textContent, from: `${type}` };
    await articleModel.create(articleData);
    return articleData;
}

module.exports = {
    daynhauhocPaginateUrl,
    daynhauhocCrawler,
    daynhauhocHomePage,
    type
}
// max = 1358x20
// https://daynhauhoc.com/latest.json?no_definitions=true&page=200