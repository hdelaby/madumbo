const jsdom = require('jsdom').JSDOM
const fetch = require('node-fetch')
const cssom = require('cssom')

const extractSelectors = (cssRules) => {
    for (let rule of cssRules) {
        if (rule.selectorText) {
            // console.log(rule.__starts)
            const selectorGroup = rule.selectorText
            const selectorList = selectorGroup.split(',')
        }
    }
}

const getCssFromFiles = async (urls) => {
    for (let url of urls) {
        try {
            const httpResponse = await fetch(url)
            const rawCss = await httpResponse.text()
            const styles = cssom.parse(rawCss)
            extractSelectors(styles.cssRules)
        } catch(error) {
            console.log('error: ', error)
        }
    }
}

const main = async () => {
    try {
        const response = await fetch('http://42.fr')
        const html = await response.text()
        const dom = new jsdom(html)
        const links = dom.window.document.querySelectorAll('*')
        const linkUrls = []
        const nodeNames = {}
        const classNames = {}

        links.forEach(elt => {
            if (elt.rel === 'stylesheet') {
                linkUrls.push(elt.href)
            } else {
                // nodeNames[elt.nodeName.toLowerCase()] = false
                // elt.className.split(' ').forEach(cls => {
                //     classNames[cls] = false
                // })
            }
        })
        // console.log(nodeNames, classNames)
        getCssFromFiles(linkUrls)
    } catch (error) {
        console.log('Error occured: ', error)
        process.exit(1)
    }
}

main()
