import fetch, { Response } from 'node-fetch'

import * as types from './types'

export default {
    getRawHtml: async (url: string): Promise<string> => {
        try {
            const htmlResponse: Response = await fetch(url)
            const rawHtml = await htmlResponse.text()
            return rawHtml
        } catch (error) {
            return ''
        }
    },

    checkMatchingSelectors: ($: any, selectors: any, results: types.IResults) => {
        for (let selector in selectors) {
            const rawSelector: string = selector

            selector = selector.split(':')[0]
            try {
                if ($(selector).length === 0) {
                   results.ignored.push(selector)
                }
            } catch (error) {
                results.errors.push(selector)
                continue
            }
        }
    }
}
