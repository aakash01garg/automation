const pup = require('puppeteer');
const fs = require('fs');
const id1 = "";
const password1 = "";
let data = [];
let email;
let tasks;
let tasksCompleted = 0;
main();

async function main() {
    let args = process.argv.slice(2);
    email = args[0];
    tasks = args.length - 1;
    if (args.includes("news")) {
        news();
    }
    if (args.includes("tv")) {
        tv();
    }
    if (args.includes("movie")) {
        movie();
    }
    if (args.includes("song")) {
        song();
    }
    if (args.includes("weather")) {
        weather();
    }
}

async function news() {
    let browser = await pup.launch({ headless: false, defaultViewport: false, args: ["--start-maximized"] });
    let pages = await browser.pages();
    let tab = pages[0];
    tab.goto("https://news.google.com");
    await tab.waitForSelector(".rdp59b", { visible: true });
    let links = await tab.$$(".rdp59b");
    let link = await tab.evaluate(function (element) {
        return element.getAttribute('href');
    }, links[0]);
    await tab.goto("https://news.google.com" + link.slice(1));
    await tab.waitForSelector("h3 .DY5T1d.RZIKme", { visible: true });
    let heads = await tab.$$("h3 .DY5T1d.RZIKme");
    let topics = [];
    for (let i = 0; i < heads.length; i++) {
        let obj = {};
        let topic = await tab.evaluate(function (element) {
            return element.innerText;
        }, heads[i]);
        let url = await tab.evaluate(function (element) {
            return element.getAttribute('href');
        }, heads[i]);
        obj['Headline'] = topic;
        obj['Link'] = "https://news.google.com" + url.slice(1);
        topics.push(obj);
    }
    let obj2 = {};
    obj2['NEWS'] = topics;
    data.push(obj2);
    tasksCompleted++;
    if (tasksCompleted == tasks) {
        fs.writeFileSync("data.json", JSON.stringify(data));
    }
    await tab.goto("https://www.gmail.com");
    await tab.waitForSelector(".h-c-header__cta-list.header__nav--ltr .h-c-header__nav-li.g-mail-nav-links .h-c-header__nav-li-link", { visible: true });
    links = await tab.$$(".h-c-header__cta-list.header__nav--ltr .h-c-header__nav-li.g-mail-nav-links .h-c-header__nav-li-link");
    let url = await tab.evaluate(function (element) {
        return element.getAttribute('href');
    }, links[1]);
    await tab.goto(url);
    await tab.waitForSelector("#identifierId", { visible: true });
    await tab.type("#identifierId", id1);
    await tab.waitForSelector(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b", { visible: true });
    await tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b");
    await tab.waitForSelector("#password .aCsJod.oJeWuf .aXBtI.Wic03c .Xb9hP .whsOnd.zHQkBf", { visible: true });
    await tab.type("#password .aCsJod.oJeWuf .aXBtI.Wic03c .Xb9hP .whsOnd.zHQkBf", password1);
    await tab.waitForTimeout(1000);
    await tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b");
    await tab.waitForNavigation({ waitUntil: 'networkidle2' });
    await tab.goto(tab.url() + "?compose=new");
    await tab.waitForSelector(`textarea[name = "to"]`, { visible: true });
    await tab.type(`textarea[name = "to"]`, email);
    await tab.waitForSelector(`input[name='subjectbox']`, { visible: true });
    await tab.type(`input[name='subjectbox']`, "NEWS");
    await tab.waitForSelector(`[role='textbox']`, { visible: true });
    for (let i = 0; i < topics.length; i++) {
        await tab.type(`[role='textbox']`, "HEADLINE: " + topics[i].Headline + "\n");
        await tab.type(`[role='textbox']`, "LINK: " + topics[i].Link + "\n\n");
    }
    await tab.keyboard.down("Control");
    await tab.keyboard.press("Enter");
    await tab.keyboard.up("Control");
    await tab.waitForTimeout(2000);
    await browser.close();
}

async function tv() {
    let browser = await pup.launch({ headless: false, defaultViewport: false, args: ["--start-maximized"] });
    let pages = await browser.pages();
    let tab = pages[0];
    await tab.goto("https://www.imdb.com/");
    await tab.waitForSelector("#imdbHeader-navDrawerOpen--desktop", { visible: true });
    await tab.click("#imdbHeader-navDrawerOpen--desktop");
    await tab.waitForSelector(".ipc-list__item.nav-link.NavLink-sc-19k0khm-0.dvLykY.ipc-list__item--indent-one", { visible: true });
    let items = await tab.$$(".ipc-list__item.nav-link.NavLink-sc-19k0khm-0.dvLykY.ipc-list__item--indent-one");
    let link = await tab.evaluate(function (element) {
        return element.getAttribute('href');
    }, items[15]);
    await tab.goto("https://www.imdb.com/" + link);
    await tab.waitForSelector(".titleColumn a", { visible: true });
    let tvNamesItems = await tab.$$(".titleColumn a");
    await tab.waitForSelector(".ratingColumn.imdbRating strong", { visible: true });
    let tvRatingItems = await tab.$$(".ratingColumn.imdbRating strong");
    let shows = [];
    for (let i = 0; i < tvNamesItems.length; i++) {
        let title = await tab.evaluate(function (element) {
            return element.innerText;
        }, tvNamesItems[i]);
        let link = await tab.evaluate(function (element) {
            return element.getAttribute('href');
        }, tvNamesItems[i]);
        let rating = await tab.evaluate(function (element) {
            return element.innerText;
        }, tvRatingItems[i]);
        let obj = {};
        obj['Title'] = title;
        obj['Link'] = "https://www.imdb.com" + link;
        obj['Rating'] = rating;
        shows.push(obj);
    }
    let obj2 = {};
    obj2['TV'] = shows;
    data.push(obj2);
    tasksCompleted++;
    if (tasksCompleted == tasks) {
        fs.writeFileSync("data.json", JSON.stringify(data));
    }
    await tab.goto("https://www.gmail.com");
    await tab.waitForSelector("#identifierId", { visible: true });
    await tab.type("#identifierId", id1);
    await tab.waitForSelector(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b", { visible: true });
    await tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b");
    await tab.waitForSelector("#password .aCsJod.oJeWuf .aXBtI.Wic03c .Xb9hP .whsOnd.zHQkBf", { visible: true });
    await tab.type("#password .aCsJod.oJeWuf .aXBtI.Wic03c .Xb9hP .whsOnd.zHQkBf", password1);
    await tab.waitForTimeout(1000);
    await tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b");
    await tab.waitForNavigation({ waitUntil: 'networkidle2' });
    await tab.goto(tab.url() + "?compose=new");
    await tab.waitForSelector(`textarea[name = "to"]`, { visible: true });
    await tab.type(`textarea[name = "to"]`, email);
    await tab.waitForSelector(`input[name='subjectbox']`, { visible: true });
    await tab.type(`input[name='subjectbox']`, "TOP 100 SHOWS ON IMDB");
    await tab.waitForSelector(`[role='textbox']`, { visible: true });
    for (let i = 0; i < 100; i++) {
        await tab.type(`[role='textbox']`, "TITLE: " + shows[i].Title + "\n");
        await tab.type(`[role='textbox']`, "RATING: " + shows[i].Rating + "\n");
        await tab.type(`[role='textbox']`, "LINK: " + shows[i].Link + "\n\n");
    }
    await tab.keyboard.down("Control");
    await tab.keyboard.press("Enter");
    await tab.keyboard.up("Control");
    await tab.waitForTimeout(2000);
    await browser.close();
}

async function movie() {
    let browser = await pup.launch({ headless: false, defaultViewport: false, args: ["--start-maximized"] });
    let pages = await browser.pages();
    let tab = pages[0];
    await tab.goto("https://www.imdb.com/");
    await tab.waitForSelector("#imdbHeader-navDrawerOpen--desktop", { visible: true });
    await tab.click("#imdbHeader-navDrawerOpen--desktop");
    await tab.waitForSelector(".ipc-list__item.nav-link.NavLink-sc-19k0khm-0.dvLykY.ipc-list__item--indent-one", { visible: true });
    let items = await tab.$$(".ipc-list__item.nav-link.NavLink-sc-19k0khm-0.dvLykY.ipc-list__item--indent-one");
    let link = await tab.evaluate(function (element) {
        return element.getAttribute('href');
    }, items[2]);
    await tab.goto("https://www.imdb.com/" + link);
    await tab.waitForSelector(".titleColumn a", { visible: true });
    let tvNamesItems = await tab.$$(".titleColumn a");
    await tab.waitForSelector(".ratingColumn.imdbRating strong", { visible: true });
    let tvRatingItems = await tab.$$(".ratingColumn.imdbRating strong");
    let shows = [];
    for (let i = 0; i < tvNamesItems.length; i++) {
        let title = await tab.evaluate(function (element) {
            return element.innerText;
        }, tvNamesItems[i]);
        let link = await tab.evaluate(function (element) {
            return element.getAttribute('href');
        }, tvNamesItems[i]);
        let rating = await tab.evaluate(function (element) {
            return element.innerText;
        }, tvRatingItems[i]);
        let obj = {};
        obj['Title'] = title;
        obj['Link'] = "https://www.imdb.com" + link;
        obj['Rating'] = rating;
        shows.push(obj);
    }
    let obj2 = {};
    obj2['MOVIES'] = shows;
    data.push(obj2);
    tasksCompleted++;
    if (tasksCompleted == tasks) {
        fs.writeFileSync("data.json", JSON.stringify(data));
    }
    await tab.goto("https://www.gmail.com");
    await tab.waitForSelector("#identifierId", { visible: true });
    await tab.type("#identifierId", id1);
    await tab.waitForSelector(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b", { visible: true });
    await tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b");
    await tab.waitForSelector("#password .aCsJod.oJeWuf .aXBtI.Wic03c .Xb9hP .whsOnd.zHQkBf", { visible: true });
    await tab.type("#password .aCsJod.oJeWuf .aXBtI.Wic03c .Xb9hP .whsOnd.zHQkBf", password1);
    await tab.waitForTimeout(1000);
    await tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b");
    await tab.waitForNavigation({ waitUntil: 'networkidle2' });
    await tab.goto(tab.url() + "?compose=new");
    await tab.waitForSelector(`textarea[name = "to"]`, { visible: true });
    await tab.type(`textarea[name = "to"]`, email);
    await tab.waitForSelector(`input[name='subjectbox']`, { visible: true });
    await tab.type(`input[name='subjectbox']`, "TOP 100 MOVIES ON IMDB");
    await tab.waitForSelector(`[role='textbox']`, { visible: true });
    for (let i = 0; i < 100; i++) {
        await tab.type(`[role='textbox']`, "TITLE: " + shows[i].Title + "\n");
        await tab.type(`[role='textbox']`, "RATING: " + shows[i].Rating + "\n");
        await tab.type(`[role='textbox']`, "LINK: " + shows[i].Link + "\n\n");
    }
    await tab.keyboard.down("Control");
    await tab.keyboard.press("Enter");
    await tab.keyboard.up("Control");
    await tab.waitForTimeout(2000);
    await browser.close();
}

async function song() {
    let browser = await pup.launch({ headless: false, defaultViewport: false, args: ["--start-maximized"] });
    let pages = await browser.pages();
    let tab = pages[0];
    await tab.goto("https://www.billboard.com/charts");
    await tab.waitForSelector(".charts-landing__block .charts-landing__link.charts-landing__video--background", { visible: true });
    let temp = await tab.$(".charts-landing__block .charts-landing__link.charts-landing__video--background");
    let link = await tab.evaluate(function (element) {
        return element.getAttribute('href');
    }, temp);
    await tab.goto("https://www.billboard.com" + link);
    await tab.waitForSelector(".chart-element__information__song.text--truncate.color--primary", { visible: true });
    let songItems = await tab.$$(".chart-element__information__song.text--truncate.color--primary");
    await tab.waitForSelector(".chart-element__information__artist.text--truncate.color--secondary", { visible: true });
    let artistItems = await tab.$$(".chart-element__information__artist.text--truncate.color--secondary");
    let songs = [];
    for (let i = 0; i < 50; i++) {
        let song = await tab.evaluate(function (element) {
            return element.innerText;
        }, songItems[i]);
        let artist = await tab.evaluate(function (element) {
            return element.innerText;
        }, artistItems[i]);
        let obj = {};
        obj['SONG'] = song;
        obj['ARTIST'] = artist;
        songs.push(obj);
    }
    let obj = {};
    obj['SONGS'] = songs;
    data.push(obj);
    tasksCompleted++;
    if (tasksCompleted == tasks) {
        fs.writeFileSync("data.json", JSON.stringify(data));
    }
    await tab.goto("https://www.gmail.com");
    await tab.waitForSelector("#identifierId", { visible: true });
    await tab.type("#identifierId", id1);
    await tab.waitForSelector(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b", { visible: true });
    await tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b");
    await tab.waitForSelector("#password .aCsJod.oJeWuf .aXBtI.Wic03c .Xb9hP .whsOnd.zHQkBf", { visible: true });
    await tab.type("#password .aCsJod.oJeWuf .aXBtI.Wic03c .Xb9hP .whsOnd.zHQkBf", password1);
    await tab.waitForTimeout(1000);
    await tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b");
    await tab.waitForNavigation({ waitUntil: 'networkidle2' });
    await tab.goto(tab.url() + "?compose=new");
    await tab.waitForSelector(`textarea[name = "to"]`, { visible: true });
    await tab.type(`textarea[name = "to"]`, email);
    await tab.waitForSelector(`input[name='subjectbox']`, { visible: true });
    await tab.type(`input[name='subjectbox']`, "BILLBOARD HOT 50 SONGS");
    await tab.waitForSelector(`[role='textbox']`, { visible: true });
    for (let i = 0; i < 50; i++) {
        await tab.type(`[role='textbox']`, "SONG: " + songs[i].SONG + "\n");
        await tab.type(`[role='textbox']`, "ARTIST: " + songs[i].ARTIST + "\n\n");
    }
    await tab.keyboard.down("Control");
    await tab.keyboard.press("Enter");
    await tab.keyboard.up("Control");
    await tab.waitForTimeout(2000);
    await browser.close();
}

async function weather() {
    let browser = await pup.launch({ headless: false, defaultViewport: false, args: ["--start-maximized"] });
    let pages = await browser.pages();
    let tab = pages[0];
    await tab.goto("https://www.weather.com");
    await tab.waitForTimeout(3000);
    await tab.waitForSelector("#LocationSearch_input", { visible: true });
    await tab.type("#LocationSearch_input", "Delhi");
    await tab.waitForTimeout(3000);
    await tab.keyboard.press("Enter");
    await tab.waitForSelector(".styles--OverflowNav--3K26b.styles--overflowNav--1CF6b a", { visible: true });
    let items = await tab.$$(".styles--OverflowNav--3K26b.styles--overflowNav--1CF6b a");
    let link = await tab.evaluate(function (element) {
        return element.getAttribute('href');
    }, items[2]);
    await tab.goto("https://www.weather.com" + link);
    await tab.waitForSelector(".DetailsSummary--extendedData--aaFeV", { visible: true });
    let detailItems = await tab.$$(".DetailsSummary--extendedData--aaFeV");
    let details = [];
    for (let i = 2; i < detailItems.length; i++) {
        let data = await tab.evaluate(function (element) {
            return element.innerText;
        }, detailItems[i]);
        details.push(data);
    }
    await tab.waitForSelector(".DetailsSummary--daypartName--1Mebr", { visible: true });
    let dateItems = await tab.$$(".DetailsSummary--daypartName--1Mebr");
    let dates = [];
    for (let i = 1; i < dateItems.length; i++) {
        let date = await tab.evaluate(function (element) {
            return element.innerText;
        }, dateItems[i]);
        dates.push(date);
    }
    await tab.waitForSelector(".DetailsSummary--highTempValue--3x6cL", { visible: true });
    let maxItems = await tab.$$(".DetailsSummary--highTempValue--3x6cL");
    let maxs = [];
    for (let i = 1; i < maxItems.length; i++) {
        let max = await tab.evaluate(function (element) {
            return element.innerText;
        }, maxItems[i]);
        maxs.push(max);
    }
    await tab.waitForSelector(".DetailsSummary--lowTempValue--1DlJK", { visible: true });
    let minItems = await tab.$$(".DetailsSummary--lowTempValue--1DlJK");
    let mins = [];
    for (let i = 1; i < minItems.length; i++) {
        let min = await tab.evaluate(function (element) {
            return element.innerText;
        }, minItems[i]);
        mins.push(min);
    }
    let weather = [];
    let j = 0;
    for (let i = 0; i < mins.length; i++) {
        let obj = {};
        obj['Date'] = dates[i];
        obj['Max'] = maxs[i];
        obj['Min'] = mins[i];
        obj['Summary'] = details[j];
        j++;
        obj['Wind'] = details[j];
        j++;
        weather.push(obj);
    }
    let obj = {};
    obj['WEATHER'] = weather;
    data.push(obj);
    tasksCompleted++;
    if (tasksCompleted == tasks) {
        fs.writeFileSync("data.json", JSON.stringify(data));
    }
    await tab.goto("https://www.gmail.com");
    await tab.waitForSelector("#identifierId", { visible: true });
    await tab.type("#identifierId", id1);
    await tab.waitForSelector(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b", { visible: true });
    await tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b");
    await tab.waitForSelector("#password .aCsJod.oJeWuf .aXBtI.Wic03c .Xb9hP .whsOnd.zHQkBf", { visible: true });
    await tab.type("#password .aCsJod.oJeWuf .aXBtI.Wic03c .Xb9hP .whsOnd.zHQkBf", password1);
    await tab.waitForTimeout(1000);
    await tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b");
    await tab.waitForNavigation({ waitUntil: 'networkidle2' });
    await tab.goto(tab.url() + "?compose=new");
    await tab.waitForSelector(`textarea[name = "to"]`, { visible: true });
    await tab.type(`textarea[name = "to"]`, email);
    await tab.waitForSelector(`input[name='subjectbox']`, { visible: true });
    await tab.type(`input[name='subjectbox']`, "WEATHER FORECAST");
    await tab.waitForSelector(`[role='textbox']`, { visible: true });
    for (let i = 0; i < weather.length; i++) {
        await tab.type(`[role='textbox']`, "DATE: " + weather[i].Date + "\n");
        await tab.type(`[role='textbox']`, "MAX TEMP: " + weather[i].Max + "\n");
        await tab.type(`[role='textbox']`, "MIN TEMP: " + weather[i].Min + "\n");
        await tab.type(`[role='textbox']`, "SUMMARY: " + weather[i].Summary + "\n");
        await tab.type(`[role='textbox']`, "WIND:  " + weather[i].Wind + "\n\n");
    }
    await tab.keyboard.down("Control");
    await tab.keyboard.press("Enter");
    await tab.keyboard.up("Control");
    await tab.waitForTimeout(2000);
    await browser.close();
}