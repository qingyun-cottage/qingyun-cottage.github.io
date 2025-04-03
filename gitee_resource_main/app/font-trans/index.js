// 打开文件
function openFile(callback) {
    // 打开浏览器选择文件
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.ttf,.otf'
    input.onchange = () => {
        const file = input.files?.[0]
        if (file) callback(file)
    }
    input.click()
}

// 将文件转换为Base64编码
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file) // 将文件读取为Data URL
        reader.onload = () => {
            // 读取完成后返回Base64编码的字符串
            resolve(reader.result)
        }
        reader.onerror = error => {
            reject(error) // 处理错误
        }
    })
}

// 生成精简字体文件
async function generateSubsetFont(fileObj, textarea) {
    if (!fileObj || textarea === '') return
    console.log('generateSubsetFont')
    const { fileName, font } = fileObj
    // 获取 .notdef 字形
    const notdefGlyph = font.charToGlyph('.notdef')
    const glyphs = [notdefGlyph]
    // textarea去重
    const text = textarea.split('')
    const uniqueText = [...new Set(text)]
    // 遍历 textarea 中的字符，获取对应的字形并添加到 glyphs 数组中
    uniqueText.forEach(char => {
        const glyph = font.charToGlyph(char)
        if (glyph) {
            glyphs.push(glyph)
        } else {
            console.error(`Failed to get glyph for character: ${char}`)
        }
    })
    // 检查 familyName 是否有效，若无效则提供默认值
    const familyName = font.names.fontFamily.en || 'fontFamily'
    // 检查 styleName 是否有效，若无效则提供默认值
    const styleName = font.names.fontSubfamily.en || 'fontSubfamily'

    const subsetFont = new opentype.Font({
        familyName: familyName,
        styleName: styleName,
        unitsPerEm: font.unitsPerEm,
        ascender: font.ascender,
        descender: font.descender,
        glyphs: glyphs,
    })

    const subsetFontBuffer = subsetFont.toArrayBuffer()
    const subsetFontBlob = new Blob([subsetFontBuffer], {
        type: 'application/font-sfnt',
    })

    // 创建临时的 <a> 元素并触发下载
    const link = document.createElement('a')
    link.href = URL.createObjectURL(subsetFontBlob)
    // 修改部分：获取上传文件的文件名并添加压缩后缀
    const originalFileName = fileName.replace(/\.[^/.]+$/, '')
    link.download = `${originalFileName}_subset.ttf`
    link.click()
    // 释放 URL 对象
    URL.revokeObjectURL(link.href)
}

// 生成css样式文件
function generateCss(fileName, font_base64) {
    // 文件名
    const originalFileName = fileName.replace(/\.[^/.]+$/, '')
    // 文件后缀
    const fileSuffix = fileName.match(/\.[^/.]+$/)[0]
    const formatType = { '.ttf': 'truetype', '.otf': 'opentype' }[fileSuffix]

    const css =
        "@font-face { font-family: '" +
        originalFileName +
        "'; src: url('" +
        font_base64 +
        "') format('" +
        formatType +
        "'); }"

    // 下载css文件
    const link = document.createElement('a')
    link.href = 'data:text/css;charset=utf-8,' + encodeURIComponent(css)
    link.download = originalFileName + '.css'
    link.click()
    URL.revokeObjectURL(link.href)
}
