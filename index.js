const pup = require('puppeteer');

const url = 'https://books.toscrape.com/';
const headlessDev = true;
let c = 1;

(async () => {
    const browser = await pup.launch({ headless: headlessDev });
    const page = await browser.newPage();
    console.log('iniciando scraping');

    await page.goto(url);
    console.log('url acessada')

    const links = await page.$$eval('.product_pod > h3 > a', el => el.map(link => link.href));


    for (const link of links) {
        console.log('\npagina', c);
        await page.goto(link);

        const title = await page.$eval(".product_main > h1", element => element.innerText);
        const data = await page.$eval('.table.table-striped', element => element.innerText);
        const parsedData = data.split('\n').reduce((acc, line) => {
            const [key, value] = line.split('\t').map(item => item.trim());
            if (key && value) {
                acc[key] = value;
            }
            return acc;
        }, {});

        const obj = ({
            title: title,
            price: parsedData["Price (excl. tax)"],
            tax: parsedData['Tax'],
            link: link
        });
        console.log(obj);
        c++;
    }

    await browser.close();
})();

