const puppeteer = require('puppeteer');

const kipalogHomePage = 'https://kipalog.com';

const kipalogPaginateUrl = (page = 0) => {
    return `${kipalogHomePage}/posts/pagination?filter=top&page=${page}`;
}

const kipalogCrawler = async (browser, article) => {
    let { title, path, tags } = article;

    tags = tags.map(tag => String(tag.name).toLocaleLowerCase());
    const pageUrl = `${kipalogHomePage}${path}`;

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(pageUrl);

    const content = await page.evaluate(() => {
        const raw = document.getElementById('content');
        const htmlContent = raw.outerHTML;
        const { textContent } = raw;
        return { htmlContent, textContent };
    });

    return { title, path, tags, content, home: 'kipalog' };
}

const paginateCrawler = async (pageUrl) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(pageUrl);

    let articlesJSON = await page.evaluate(() => {
        return document.body.textContent
    });

    const articles = JSON.parse(articlesJSON);
    const resPromise = articles.map(async (article) => {
        return await kipalogCrawler(browser, article);
    });

    const res = await Promise.all(resPromise);

    console.log('DATA', res);
}

paginateCrawler(kipalogPaginateUrl(0));