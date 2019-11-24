const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const util = require('./util');
const puputil = require('./puputil');
var path = require('path');
var config = require('config');

const homeurl = 'https://ai.aliyun.com/nls/tts';
util.log.info('Begin run alitts app..');
// var configFile = path.resolve('./config', process.env.NODE_ENV + '.js');
// var config = require(configFile);

console.log(config.util.toObject());

let rect = {};

async function run(textlist){
    let pupOptions = config.get('pupOptions') || {};
    let options = {
        defaultViewport: { width: 1920, height: 1024 },
        slowMo: 300,
        "args": [
            // "--disable-gpu",
            "--disable-web-security",
            "--disable-xss-auditor", // 关闭 XSS Auditor
            // "--no-sandbox",
            "--no-first-run",
            "--disable-setuid-sandbox",
            "--allow-running-insecure-content", //允许不安全内容
            // "--disable-webgl",
            // "--disable-popup-blocking",
            '--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3803.0 Safari/537.36',
            // THIS IS THE KEY BIT!
            '--lang=en-US,en;q=0.9',
            '--window-size=1280,960'
        ],
    }
    options = Object.assign(options, pupOptions);
    util.log.info(options);
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    page.on('console', msg => {
        for (let i = 0; i < msg.args().length; ++i)
            console.log(`${i}: ${msg.args()[i]}`); // 打印到代码的控制台
    });
    
    page.on('response', (res)=>{
        let url = res.url();
        if (url.indexOf('testTtsCustomConfig') != -1){
            console.log(url);
            console.log(res.buffer());
        }
    })
    page.on('pageerror', err =>{
        console.error(err);
    })
    await page.goto(homeurl);
    await page.waitFor(1000);
    
    for(var i =0;i<textlist.length;i++){
        await tts(page, textlist[i]);
        await page.waitFor(2000);
    }


    await browser.close();
    util.log.info('run ended.')
}

async function tts(page, text){
    console.log(text);
    let ok = await puputil.isDisplay(page, '.nls-tts-demo-modal');
    if(ok){
        await page.click('.modal-cancel');
    }
    //输入文字。注：page.#eval(),page.evalute() 已经失效，不起作用
    await page.focus('.nls-tts-demo-left');
    await page.click('.nls-tts-demo-left');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.keyboard.sendCharacter(text);
    // await page.type('.nls-tts-demo-left', text);
    
    await page.waitFor(200);
    await page.click('.nls-tts-demo-submit');
    await page.waitFor(1000);
    await slide(page)
}

async function slide(page){
    let rect = await puputil.getDomRect(page, '#nls-tts-demo-nc');
    console.log(rect);
    let from = {x: rect.x + 20, y: rect.y + rect.height/2};
    let to = { x: rect.x + rect.width - 10, y:  from.y};
    //todo 即便手工干预，也是报同样的错误
    let ok = await puputil.drag(page, from, to);  //哎呀，出错了，点击刷新再来一次(error:wHWXn)
    return ok;
}


if (require.main === module) {
    console.log('index.js run.')
    let textlist = [
        '春天在哪里，春天在哪山林里。',
        '今天我们来讲一下如何用vsCode进行项目开发。'
    ]
    run(textlist)
}else{
    console.log('index.js called.')
}