const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('koukyou-note:v1',JSON.stringify({version:1,cards:{'1':{reps:2,lapses:0,due:1800000000000,last:1700000000000,bookmark:true,slow:false,lastMs:0,note:'旧記録'}},days:{},history:[],examDate:''})));
 await page.goto(process.env.BASE_URL||'http://localhost:8000');
 const cards=await page.evaluate(()=>window.CARDS);assert.equal(cards.length,335);const health=cards.filter(c=>c.subject==='保健');assert.equal(health.length,240);assert.equal(new Set(health.map(c=>c.category)).size,8);
 for(const p of [94,95,96,97,100,101,102,103,104,105,110,111,112,113,114,115]) assert.equal(health.filter(c=>c.question.endsWith(`（教科書p.${p}）`)).length,15,`p.${p}`);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('koukyou-note:v1')).cards['1'].note),'旧記録');
 assert.match(await page.locator('main').innerText(),/2教科・335問/);
 await page.evaluate(()=>location.hash='#library');await page.waitForSelector('#lib-subject');await page.selectOption('#lib-subject','保健');assert.equal(await page.locator('.word-row').count(),240);await page.selectOption('#lib-category','加齢と健康');assert.equal(await page.locator('.word-row').count(),30);
 await page.evaluate(()=>location.hash='#study');await page.waitForSelector('#setup-form');await page.selectOption('#subject','保健');await page.selectOption('#category','加齢と健康');await page.selectOption('#filter','all');await page.uncheck('[name=shuffle]');await page.locator('#setup-form [type=submit]').click();assert.match(await page.locator('.question').innerText(),/年齢を重ねる/);await page.click('[data-action=reveal]');await page.click('[data-action=grade-good]');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('koukyou-note:v1')).cards['96'].reps),1);
 await page.click('[data-action=exit]');await page.click('button[value=ok]');await page.evaluate(()=>location.hash='#test');await page.waitForSelector('#setup-form');await page.selectOption('#subject','保健');await page.selectOption('#category','加齢と健康');await page.uncheck('[name=shuffle]');await page.locator('#setup-form [type=submit]').click();await page.fill('#answer','加齢');await page.locator('#answer-form [type=submit]').click();assert.match(await page.locator('.result-box').innerText(),/正解/);
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: 保健240問・16ページ、絞り込み、学習、採点、旧記録の保持');process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
