import { E as c, G as u, H as f } from './vendor-p7iB914l.js'
import { A as a } from './vue-wr1eCI4T.js'
;(function () {
    const t = document.createElement('link').relList
    if (t && t.supports && t.supports('modulepreload')) return
    for (const e of document.querySelectorAll('link[rel="modulepreload"]')) s(e)
    new MutationObserver(e => {
        for (const r of e)
            if (r.type === 'childList')
                for (const o of r.addedNodes)
                    o.tagName === 'LINK' && o.rel === 'modulepreload' && s(o)
    }).observe(document, { childList: !0, subtree: !0 })
    function n(e) {
        const r = {}
        return (
            e.integrity && (r.integrity = e.integrity),
            e.referrerPolicy && (r.referrerPolicy = e.referrerPolicy),
            e.crossOrigin === 'use-credentials'
                ? (r.credentials = 'include')
                : e.crossOrigin === 'anonymous'
                ? (r.credentials = 'omit')
                : (r.credentials = 'same-origin'),
            r
        )
    }
    function s(e) {
        if (e.ep) return
        e.ep = !0
        const r = n(e)
        fetch(e.href, r)
    }
})()
const p = c(),
    i = u(a)
i.use(f)
i.use(p)
i.mount('#app')
