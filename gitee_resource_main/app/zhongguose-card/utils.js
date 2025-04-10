// 获取JSON数据 通过XMLHttpRequest
function getJSONByXMLHttpRequest(path) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', path, true)
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4 || xhr.status != 200) {
                return
            }
            const res = xhr.responseText

            try {
                resolve(JSON.parse(res))
            } catch (e) {
                reject(e)
            }
        }
        xhr.send()
    })
}

// 获取json数据 通过fetch
function getJSONByFetch(path) {
    return new Promise((resolve, reject) => {
        fetch(path)
            .then(res => {
                if (!res.ok) {
                    throw new Error(
                        'Network response was not ok ' + res.statusText
                    )
                }
                resolve(res.json())
            })
            .catch(err => {
                reject(err)
            })
    })
}

// 排序
function sortColorsByHSV(list) {
    return list.sort(function (a, b) {
        if (rgb2hsv(a.RGB)[0] === rgb2hsv(b.RGB)[0])
            return rgb2hsv(b.RGB)[1] - rgb2hsv(a.RGB)[1]
        else return rgb2hsv(b.RGB)[0] - rgb2hsv(a.RGB)[0]
    })
}

// RGB转HSV
function rgb2hsv(rgb) {
    var r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b)
    var h,
        s,
        v = max

    var d = max - min
    s = max == 0 ? 0 : d / max

    if (max == min) {
        h = 0
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }
        h /= 6
    }

    return [h, s, v]
}

// Hex转RGB
function hexColorToRGB(hexColor) {
    const hashRegEx = /#/
    const hexRegEx = /0x/i
    let red, green, blue
    const hasHash = hashRegEx.test(hexColor)
    const hasHex = hexRegEx.test(hexColor)
    const color = hasHash
        ? hexColor.replace(hashRegEx, '')
        : hasHex
        ? hexColor.replace(hexRegEx, '')
        : hexColor
    // Color has only a single char in the last digit, so the last digit must be repeated, and red and green are 0
    if (color.length === 1) {
        red = 0
        green = 0
        blue = hexToDec(color.repeat(2))
        // Color has two chars in the last digit, so red and green are 0
    } else if (color.length === 2) {
        red = 0
        green = 0
        blue = hexToDec(color)
        // Color has one chars for each color, so they must be repeated
    } else if (color.length === 3) {
        red = hexToDec(color[0].repeat(2))
        green = hexToDec(color[1].repeat(2))
        blue = hexToDec(color[2].repeat(2))
        // Color has only for chars, so red is 0
    } else if (color.length === 4) {
        red = 0
        green = hexToDec(color.substr(0, 2))
        blue = hexToDec(color.substr(2, 2))
        // All chars are filled, so no transformation is needed
    } else {
        red = hexToDec(color.substr(0, 2))
        green = hexToDec(color.substr(2, 2))
        blue = hexToDec(color.substr(4, 2))
    }
    return [red, green, blue]
}

// 这是一个更通用的函数，旨在接受不同格式的颜色输入（十六进制字符串、RGB数组、单独的RGB值等），并调用 contrastFromHSP 来确定最佳的字体颜色。
function fontColorContrast(
    hexColorOrRedOrArray,
    greenOrThreshold,
    blue,
    threshold
) {
    let red = 0
    let green = 0
    const isRGB = !!(blue !== undefined)
    const isArray = Array.isArray(hexColorOrRedOrArray)
    const isHexString = typeof hexColorOrRedOrArray === 'string' && !isRGB
    const isHexNumber = typeof hexColorOrRedOrArray === 'number' && !isRGB
    if (isHexString || isHexNumber) {
        ;[red, green, blue] = hexColorToRGB(hexColorOrRedOrArray)
        threshold = greenOrThreshold
    } else if (isRGB || isArray) {
        ;[red, green, blue, threshold] = arrayOrRgbToRGB(
            hexColorOrRedOrArray,
            greenOrThreshold,
            blue,
            threshold
        )
    } else {
        // Not a color, respond with white color
        return '#ffffff'
    }
    return contrastFromHSP(red, green, blue, threshold)
}

// 这个函数基于HSP（和谐感知亮度）公式计算一个颜色的“亮度”值，并据此返回黑色（#000000）或白色（#ffffff）作为文本颜色。
function contrastFromHSP(red, green, blue, threshold = 0.5) {
    const pRed = 0.299
    const pGreen = 0.587
    const pBlue = 0.114
    const contrast = Math.sqrt(
        pRed * Math.pow(red / 255, 2) +
            pGreen * Math.pow(green / 255, 2) +
            pBlue * Math.pow(blue / 255, 2)
    )
    return contrast > threshold ? '#000000' : '#ffffff'
}

// 处理不同格式的颜色输入（可以是 RGB 值的数组或单独的 R、G、B 参数），并从中提取出红色（R）、绿色（G）、蓝色（B）值以及一个阈值（t）。
function arrayOrRgbToRGB(redOrArray, greenOrThreshold, blue, threshold) {
    let r = 0
    let g = 0
    let b = 0
    let t = 0
    const isArray = Array.isArray(redOrArray)
    const isRGB = !!(blue !== undefined)
    if (isArray) {
        r = redOrArray[0]
        g = redOrArray[1]
        b = redOrArray[2]
        t = greenOrThreshold
    } else if (isRGB) {
        r = redOrArray
        g = greenOrThreshold
        b = blue
        t = threshold
    }
    return [r, g, b, t]
}
