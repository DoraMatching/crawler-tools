const puppeteer = require('puppeteer');
const chalk = require('chalk');

const { kipalogCrawler, kipalogPaginateUrl } = require('./crawlers/kipalogCrawler');

const paginateCrawler = async (pageUrls) => {
    const browser = await puppeteer.launch({ headless: true });

    let articleCounter = 0;

    for (let i = 0; i < pageUrls.length; i++) {
        const page = await browser.newPage();
        await page.goto(pageUrls[i]);

        let articlesJSON = await page.evaluate(() => {
            return document.body.textContent
        });

        const articles = JSON.parse(articlesJSON);
        articleCounter += articles.length;
        const resPromise = articles.map(async (article) => {
            return await kipalogCrawler(browser, article);
        });

        const res = await Promise.all(resPromise);

        page.close();
    }

    console.log(chalk.yellow('Crawled successfully: ') + chalk.white.bgRed(`${articleCounter} articles`));
    browser.close();
}

const crawler = (start = 0, end = 0) => {
    let pageUrls = [];
    for (let i = start; i <= end; i++) {
        pageUrls.push(kipalogPaginateUrl(i));
    }
    paginateCrawler(pageUrls);
}

crawler(0, 76);

