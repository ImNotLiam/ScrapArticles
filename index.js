const puppeteer = require('puppeteer');
const fs = require('fs-extra');


(async function main() {
    try {
        //Set up Page.
        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage();
        page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3571.0 Mobile Safari/537.36');

        //Go to page
        await page.goto('https://blog.freewebstore.com/');
        await page.waitForSelector('.article_item_title');

        //Get length of shown Articles
        const articles = await page.$$('.article_item');
        console.log(articles.length);
        await fs.writeFile('blogitems.csv', 'name,author,created\n');

        //Loop through shown Articles.
        for (let i = 0; i < articles.length; i++) {

            await page.goto('https://blog.freewebstore.com/');
            await page.waitForSelector('.article_item_title');
            const articles = await page.$$('.article_item');

            const article = articles[i];
            const button = await article.$('.article_item_title');
            button.click();

            await page.waitForSelector('.header_article .header_title_author');
            const author = await page.$eval('.header_article .header_title_author', author => author.innerText);
            await page.waitForSelector('.header_article .header_name');
            const name = await page.$eval('.header_article .header_name', title => title.innerText);
            await page.waitForSelector('.header_article time');
            const created = await page.$eval('time', time => time.innerText);
            await fs.appendFile(__dirname + '/blogitems.csv', `"${name}","${author}","${created}"\n`);
        }

        //Close browser instance
        console.log("Got Data");
        await browser.close();
    } catch (e) {
        console.log("our error", e);
    }
})();