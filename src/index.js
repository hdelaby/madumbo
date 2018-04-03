const jsdom = require('jsdom').JSDOM
const fetch = require('node-fetch')

const main = async () => {
	try {
		const response = await fetch('http://42.fr')
		const html = await response.text()
		const dom = new jsdom(html)
		const links = dom.window.document.querySelectorAll('link')
		links.forEach(elt => {
			if (elt.rel === 'stylesheet') {
				console.log(elt.href)
			}
		})
	} catch (error) {
		console.log('Error occured: ', error)
		process.exit(1)
	}
}

main()
