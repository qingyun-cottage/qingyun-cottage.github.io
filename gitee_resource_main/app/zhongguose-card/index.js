// 获取json数据
getJSONByFetch('./data/colors.json')
    .then(data => {
        handleColors(data)
    })
    .catch(err => {
        console.log(err)
    })

function handleColors(colorsArray) {
    const sortColors = sortColorsByHSV(colorsArray).map(color => {
        const { CMYK, RGB } = color
        // return fontColorContrast(RGB)
        return {
            ...color,
            cmyk: `CMYK (${CMYK.join(', ')})`,
            rgb: `RGB (${RGB.join(', ')})`,
            contrast: fontColorContrast(RGB),
        }
    })
    render(sortColors)
}

// 组装页面
function render(sortColors) {
    const cardListDOM = document.getElementById('card_list')
    const cardItems = sortColors.map(item => {
        const itemDOM = document.createElement('div')
        itemDOM.className = 'card'
        itemDOM.style.backgroundColor = item.hex
        itemDOM.style.color = item.contrast
        itemDOM.innerHTML =
            '<img class="card_bg" src="https://gitee.com/qingyun-cottage/resource/raw/main/app/zhongguose-card/card_bg.png" />' +
            '<span class="name">' +
            item.name +
            '</span>' +
            '<span class="pinyin">' +
            item.pinyin +
            '</span>' +
            '<span class="rgb">' +
            item.rgb +
            '</span>' +
            '<span class="hex">' +
            item.hex +
            '</span>' +
            '<span class="cmyk">' +
            item.cmyk +
            '</span>'
        return itemDOM
    })
    // cardItems组成 文档片段
    var fragment = document.createDocumentFragment()
    for (var i = 0; i < cardItems.length; i++) {
        fragment.appendChild(cardItems[i])
    }
    cardListDOM.appendChild(fragment)
}
