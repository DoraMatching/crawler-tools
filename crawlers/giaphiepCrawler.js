const chalk = require('chalk');

const { articleModel } = require('../models');
const { sleep, getRandomInt, getCurrentTime } = require('../shared');

const giaphiepHomePage = 'https://giaphiep.com';

const type = 'giaphiep';

const giaphiepPaginateUrl = (page = 0) => {
    return `https://api.giaphiep.com/posts?page=${page}`;
}

const giaphiepCrawler = async (browser, article) => {
    let { title, link, tags } = article;

    if (tags.length !== 0)
        tags = tags.map(tag => String(tag.name).toLocaleLowerCase().trim().replace(' ', '-')).join(';');
    else
        tags = 'none';

    let path = `/blog/${link}`;
    const pageUrl = `${giaphiepHomePage}${path}`;

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await sleep(getRandomInt(5000, 30_000));

    await page.goto(pageUrl);

    // retry: while (true) {
    //     try {
    //         console.log(getCurrentTime() + chalk.yellow(' Crawling... ') + chalk.green(pageUrl));
    //         const { htmlContent, textContent, realPath } = await page.evaluate(() => {
    //             const raw = document.querySelectorAll('#__layout > div > div.el-col.el-col-20 > div:nth-child(1) > div.el-col.el-col-24.el-col-md-18 > div:nth-child(2) > div > div > div.content')[0];
    //             const realPathRaw = document.querySelectorAll('#__layout > div > div.el-col.el-col-20 > div:nth-child(1) > div.el-col.el-col-24.el-col-md-18 > div:nth-child(2) > div > div > div:nth-child(6) > h3 > a')[0];
    //             const htmlContent = raw.outerHTML;
    //             const { textContent } = raw;
    //             const realPath = realPathRaw.textContent.replace('https://viblo.asia', '');;
    //             return { htmlContent, textContent, realPath };
    //         });

    //         page.close();
    //         const articleData = { title, path: realPath, tags, htmlContent, textContent, from: `viblo` };
    //         await articleModel.create(articleData);
    //         return articleData;
    //     } catch (e) {
    //         const delay = getRandomInt(5000, 100_000);
    //         console.log(getCurrentTime() + chalk.yellow('Re-try crawling... ' + chalk.green(pageUrl)) + chalk.white.bgRed(` after ${delay / 1000}s`));
    //         await sleep(delay);
    //         await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    //         console.log(getCurrentTime() + chalk.yellow('Crawling... ' + chalk.green(pageUrl)));
    //         continue retry;
    //     }
    // }

    console.log(getCurrentTime() + chalk.yellow(' Crawling... ') + chalk.green(pageUrl));
    const { htmlContent, textContent, realPath } = await page.evaluate(async () => {
        const sleep = (ms = 1000) => {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        const getRandomInt = (min, max) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let raw = null;
        retry: while (true) {
            try {
                raw = document.querySelectorAll('#__layout > div > div.el-col.el-col-20 > div:nth-child(1) > div.el-col.el-col-24.el-col-md-18 > div:nth-child(2) > div > div > div.content')[0];
                const realPathRaw = document.querySelectorAll('#__layout > div > div.el-col.el-col-20 > div:nth-child(1) > div.el-col.el-col-24.el-col-md-18 > div:nth-child(2) > div > div > div:nth-child(6) > h3 > a')[0];
                const htmlContent = raw.outerHTML;
                const { textContent } = raw;
                const realPath = realPathRaw.textContent.replace('https://viblo.asia', '');
                return { htmlContent, textContent, realPath };
            } catch (e) {
                await sleep(getRandomInt(5000, 30_000));
                await location.reload();
                continue retry;
            }
        }
    });

    page.close();
    const articleData = { title, path: realPath, tags, htmlContent, textContent, from: `viblo` };
    await articleModel.create(articleData);
    return articleData;
}

module.exports = {
    giaphiepPaginateUrl,
    giaphiepCrawler,
    giaphiepHomePage,
    type
}

// max=1375x20
// https://api.giaphiep.com/posts?page=1375