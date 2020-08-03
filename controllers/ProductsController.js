const Product = require('../models/product');

const puppeteer = require('puppeteer');

const sleep = async time =>  new Promise(resolve => setTimeout(resolve, time * 1000));

exports.index = async (req, res) => {
    const products = await Product.find();

    res.render('products/index', {
        pageTitle: 'Stolen STAPLES products',
        products
    });

};

exports.update = async (req, res) => {
    const url = 'https://www.staples.ca/collections/macbooks-92';
    const products = await scrapeIt(url);
    for (let product of products) {
        if (product.title === "") continue;
        await Product.updateOne({sku: product.sku}, product, {upsert: true});
    }
};

async function scrapeIt (url) {
    // Create a new browser instance
    const browser = await puppeteer.launch({headless: false});
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(url, ['geolocation']);

    const page = await browser.newPage();
    await page.setViewport({
        width:1920,
        height: 1080
    })
    await page.exposeFunction('sleep', sleep);
    await page.goto(url);

    page.on('dialog', async dialog => {
        await dialog.dismiss();
    });
    page.on('console', msg => console.log(msg._text));


    await sleep(2);
    // await page.screenshot({path: 'screenshots/example.png'});
    await page.evaluate(async () => {
        window.scrollBy(0, document.body.scrollHeight);
        await sleep(2);
    })

    await page.waitForSelector(`[class="ais-results-as-block"]`,{visible:true, timeout: 120000})

    const content = await page.evaluate(async () => {
        const productScrape = document.querySelectorAll('.product-thumbnail');
        const products = [];


        for (let product of productScrape) {
            if (!product.querySelector('img')) {
                product.scrollIntoView();
                await sleep(2);
            }
            const link = product.querySelector('a').href;
            const parts = link.split('/');
            const test = parts[parts.length - 1].split('-')
            const sku = test[0]
            const title = product.querySelector(`[class^="product-thumbnail__title"]`).textContent;

            const image = product.querySelector('img');
            let src = null;
            if (image) src = image.src;
            products.push({ title, sku, image: image.src});
        }
        return products;
    })
    await browser.close();
    return content;
}
