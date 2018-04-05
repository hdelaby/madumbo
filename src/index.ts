import cheerio = require('cheerio')
import URL = require('url')

import * as types from './types'
import htmlHelper from './htmlHelper'
import cssHelper from './cssHelper'

const handleWebpage = async (url: string, results: types.IResults, depth: number = 0): Promise<void> => {
    const rawHtml = await htmlHelper.getRawHtml(url)
    if (rawHtml.length === 0) return
    const cssUrls: string[] = []
    let pages: string[] = []
    const selectors: types.ISelectors = {}
    const hostname: string = URL.parse(url).hostname
    let $

    $ = cheerio.load(rawHtml)
    $('link').each((i, link) => {
        if ($(link).attr('rel') === 'stylesheet') {
            cssUrls.push($(link).attr('href'))
        }
    })
    await cssHelper.findCss(cssUrls, selectors)
    htmlHelper.checkMatchingSelectors($, selectors, results)
    if (depth < 1) { // You just need to replace depth by 2 if you want to try
        $('a').each((i, aTag) => {
            pages.push($(aTag).attr('href'))
        })
        pages = pages.filter((item, pos, self) => {
            return self.indexOf(item) === pos;
        })
        for (let page of pages) {
            await handleWebpage(page, results, depth + 1)
        }
    }
}

const main = async (): Promise<void> => {
    let results: types.IResults = { ignored: [], errors: [] }

    if (process.argv.length < 3) {
        console.error('usage: node index.js URL')
        process.exit(1)
    }
    if (process.argv[2].indexOf('http://') && process.argv[2].indexOf('https://')) {
        console.error('Invalid URL format, we expect it to begin by http:// or https://')
        process.exit(1)
    }
    await handleWebpage(process.argv[2], results)
    const ignoredSelectors: string[] = results.ignored.filter((item, pos, self) => {
        return self.indexOf(item) === pos
    })
    for (let selector of ignoredSelectors) {
        console.log(selector)
    }
}

main()
