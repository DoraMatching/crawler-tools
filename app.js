require('dotenv').config();

const puppeteer = require('puppeteer');
const chalk = require('chalk');

const { kipalogCrawler, kipalogPaginateUrl } = require('./crawlers/kipalogCrawler');
const { daynhauhocCrawler, daynhauhocPaginateUrl } = require('./crawlers/daynhauhocCrawler');
const { giaphiepCrawler, giaphiepPaginateUrl } = require('./crawlers/giaphiepCrawler');
const { viblopostCrawler, viblopostPaginateUrl } = require('./crawlers/viblopostCrawler');

const { kipalogLastPage, daynhauhocLastPage, giaphiepLastPage, vibloquestionLastPage, viblopostLastPage, crawlFrom } = require('./config/app.config');

const { getCurrentTime, sleep, getRandomInt } = require('./shared');

const crawlers = { kipalogCrawler, daynhauhocCrawler, giaphiepCrawler, viblopostCrawler };
const paginateUrls = { kipalogPaginateUrl, daynhauhocPaginateUrl, giaphiepPaginateUrl, viblopostPaginateUrl };
const lastPages = { kipalogLastPage, daynhauhocLastPage, giaphiepLastPage, vibloquestionLastPage, viblopostLastPage };

const paginateCrawler = async (pageUrls) => {
    const browser = await puppeteer.launch({ headless: true });

    let articleCounter = 0;

    for (let i = 0; i < pageUrls.length; i++) {
        const page = await browser.newPage();
        const { url, type } = pageUrls[i];
        await page.setDefaultNavigationTimeout(0);
        let delay = getRandomInt(500, 10_000);
        console.log(getCurrentTime() + chalk.yellow('Delay... ') + chalk.white.bgRed(`${delay / 1000}s\t`) + chalk.green(url));
        await sleep(delay);
        await page.goto(url);

        let articlesJSON = await page.evaluate(() => {
            return document.body.textContent;
        });

        let articles = JSON.parse(articlesJSON);

        if (type === 'daynhauhoc') {
            articles = articles.topic_list.topics;
        } else if (type === 'giaphiep' || type === 'viblopost') {
            articles = articles.data;
        }

        articleCounter += articles.length;
        const resPromise = articles.map(async (article) => {
            return await crawlers[`${type}Crawler`](browser, article);
        });

        await Promise.all(resPromise);

        page.close();
    }

    console.log(getCurrentTime() + chalk.yellow('Crawled successfully: ') + chalk.white.bgRed(`${articleCounter} articles`));
    browser.close();
}

const crawler = () => {
    let pageUrls = [];

    const types = crawlFrom;

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

