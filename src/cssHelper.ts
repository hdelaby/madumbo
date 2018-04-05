import * as cssom from 'cssom'
import fetch, { Response } from 'node-fetch'

import * as types from './types'

const extractSelectors =  (cssRules: any, selectors: types.ISelectors): void => {
    for (let rule of cssRules) {
        if (rule.selectorText) {
            const selectorGroup: string = rule.selectorText
            const selectorList: string[] = selectorGroup.split(',')

            for (let selector of selectorList) {
                selector = selector.trim()
                if (selector.indexOf('@') !== 0) {
                    selectors[selector] = false
                }
            }
        }
    }
}

export default {
    findCss: async (cssUrls, selectors): Promise<void> => {
        for (let url of cssUrls) {
            if (url.indexOf('//') === 0) continue
            try {
                const httpResponse: Response = await fetch(url)
                let rawCss: string = await httpResponse.text()
                const styles: any = cssom.parse(rawCss)
                const { cssRules } = styles
                extractSelectors(cssRules, selectors)
            } catch(error) {
                continue
            }
        }
    }
}
