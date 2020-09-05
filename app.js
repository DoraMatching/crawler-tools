require('dotenv').config();

const puppeteer = require('puppeteer');
const chalk = require('chalk');

const { kipalogCrawler, kipalogPaginateUrl } = require('./crawlers/kipalogCrawler');
const { daynhauhocCrawler, daynhauhocPaginateUrl } = require('./crawlers/daynhauhocCrawler');

const { kipalogLastPage, daynhauhocLastPage, giaphiepLastPage, vibloquestionLastPage } = require('./config/app.config');

const crawlers = { kipalogCrawler, daynhauhocCrawler };
const paginateUrls = { kipalogPaginateUrl, daynhauhocPaginateUrl };
const lastPages = { kipalogLastPage, daynhauhocLastPage, giaphiepLastPage, vibloquestionLastPage };

const paginateCrawler = async (pageUrls) => {
    const browser = await puppeteer.launch({ headless: true });

    let articleCounter = 0;

    for (let i = 0; i < pageUrls.length; i++) {
        const page = await browser.newPage();
        const { url, type } = pageUrls[i];
        await page.goto(url);

        let articlesJSON = await page.evaluate(() => {
            return document.body.textContent;
        });

        let articles = JSON.parse(articlesJSON);

        if (type === 'daynhauhoc') {
            articles = articles.topic_list.topics;
        }

        articleCounter += articles.length;
        const resPromise = articles.map(async (article) => {
            return await crawlers[`${type}Crawler`](browser, article);
        });

        const res = await Promise.all(resPromise);

        page.close();
    }

    console.log(chalk.yellow('Crawled successfully: ') + chalk.white.bgRed(`${articleCounter} articles`));
    browser.close();
}

const crawler = () => {
    let pageUrls = [];

    const types = ['kipalog', 'daynhauhoc'];

    types.map(type => {
        const end = lastPages[`${type}LastPage`];
        for (let i = 0; i <= end; i++) {
            const url = paginateUrls[`${type}PaginateUrl`](i);
            pageUrls.push({ url, type });
        }
    })

    paginateCrawler(pageUrls);
}

crawler();

