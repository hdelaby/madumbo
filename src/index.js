const jsdom = require('jsdom').JSDOM
const fetch = require('node-fetch')
const cssom = require('cssom')
const cheerio = require('cheerio')

const selectors = {}

const extractSelectors = (cssRules) => {
    for (let rule of cssRules) {
        if (rule.selectorText) {
            const selectorGroup = rule.selectorText
            const selectorList = selectorGroup.split(',')

            for (let selector of selectorList) {
                selector = selector.trim()
                if (selector.indexOf('@') !== 0) {
                    selectors[selector] = false
                }
            }
        }
    }
}

const getCssFromUrl = async (urls) => {
    for (let url of urls) {
        if (url.indexOf('//') === 0) continue
        try {
            const httpResponse = await fetch(url)
            let rawCss = await httpResponse.text()
            rawCss = rawCss.replace('mailto:', 'mailto')
            const styles = cssom.parse(rawCss)
            extractSelectors(styles.cssRules)
        } catch(error) {
            console.log('error', error)
        }
    }
}

const main = async () => {
    try {
        const response = await fetch('http://twitter.com')
        const html = await response.text()
        // const dom = new jsdom(html)
        // const links = dom.window.$.querySelectorAll('*')
        const $ = cheerio.load(html)
        const linkUrls = []
        const nodeNames = {}
        const classNames = {}

        const links = $('link').each((i, link) => {
            link = $(link)
            if (link.attr('rel') === 'stylesheet') {
                linkUrls.push(link.attr('href'))
            }
        })
        // links.forEach(elt => {
        //     console.log(elt)
        //     if (elt.rel === 'stylesheet') {
        //         linkUrls.push(elt.href)
        //     } else {
        //         // nodeNames[elt.nodeName.toLowerCase()] = false
        //         // elt.className.split(' ').forEach(cls => {
        //         //     classNames[cls] = false
        //         // })
        //     }
        // })
        // console.log(nodeNames, classNames)
        // console.log(linkUrls)
        await getCssFromUrl(linkUrls)
        // console.log(selectors)
        for (let selector in selectors) {
            const rawSelector = selector
            
            selector = selector.split(':')[0]
            if ($(selector).length === 0) {
                console.log(selector)
            }
        }
    } catch (error) {
        console.log('Error occured: ', error)
        process.exit(1)
    }
}

main()
