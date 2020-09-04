const chalk = require('chalk');

const articleModel = require('../models').articleModel;

const kipalogHomePage = 'https://kipalog.com';

const kipalogPaginateUrl = (page = 0) => {
    return `${kipalogHomePage}/posts/pagination?filter=top&page=${page}`;
}

const kipalogCrawler = async (browser, article) => {
    let { title, path, tags } = article;

    if (tags.length !== 0)
        tags = tags.map(tag => String(tag.name).toLocaleLowerCase().trim()).join(';');
    else
        tags = 'none';

    const pageUrl = `${kipalogHomePage}${path}`;
    console.log(chalk.yellow('Crawling... ') + chalk.green(pageUrl));

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(pageUrl);

    const { htmlContent, textContent } = await page.evaluate(() => {
        const raw = document.getElementById('content');
        const htmlContent = raw.outerHTML;
        const { textContent } = raw;
        return { htmlContent, textContent };
    });

    page.close();
    const articleData = { title, path, tags, htmlContent, textContent, from: 'kipalog' };
    await articleModel.create(articleData);
    return articleData;
}

module.exports = {
    kipalogPaginateUrl,
    kipalogCrawler,
    kipalogHomePage
}