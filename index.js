const puppeteer = require('puppeteer');
let vdc='5278';
let ward='4';
let regcenter='9763';

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://voterlist.election.gov.np/bbvrs/index_2.php');
  await page.waitForTimeout(2000);
  await page.select('#state', '3')
    await page.waitForTimeout(2000);
    await page.select('#district', '26')
    await page.waitForTimeout(2000);
    await page.select('#vdc_mun', vdc)
    await page.waitForTimeout(2000);
    await page.select('#ward', ward)
    await page.waitForTimeout(2000);
    await page.select('#reg_centre', regcenter)
  await page.click('#btnSubmit');
  await page.waitForTimeout(5000);
  await page.select('select[name="tbl_data_length"]', '100');
 
    let nextButton = await page.$('#tbl_data_next');
    while(nextButton){
        const result = await page.evaluate(() => {
            //get all rows
            const rows = Array.from(document.querySelectorAll('#tbl_data > tbody > tr'));
            //get all columns
            const columns = Array.from(document.querySelectorAll('#tbl_data > thead > tr > th'));
            //create an array of objects
            const data = rows.map(row => {
                const rowData = Array.from(row.querySelectorAll('td'));
                const obj = {};
                rowData.forEach((cell, index) => {
                    obj[columns[index].innerText] = cell.innerText;
                });
                return obj;
            });
            return data;
        });
        const csv = result.map(row => Object.values(row).join(',')).join('\n');
        //line break

        require('fs').appendFileSync('kathmandu.csv', csv);
        await page.waitForTimeout(5000);
        await page.click('#tbl_data_next');
    }
    //break while loop

  await browser.close();
})();