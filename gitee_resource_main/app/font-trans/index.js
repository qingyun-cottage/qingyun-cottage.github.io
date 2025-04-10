// 上传文件与文件名称
const btn1 = document.getElementById('btn1')
const fileName1 = document.getElementById('fileName1')
const btn1_1 = document.getElementById('btn1_1')
const btn1_2 = document.getElementById('btn1_2')

let file1 = null
btn1.addEventListener('click', () => {
    openFile(file => {
        const fileName = file.name
        fileName1.textContent = fileName
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = async event => {
            const fontBuffer = event.target.result
            const font = await opentype.parse(fontBuffer)
            // 检查字体是否加载成功
            if (!font) {
                console.error('Failed to load font')
                return
            }
            file1 = { fileName, font }
        }
    })
})

btn1_1.addEventListener('click', () => {
    generateSubsetFont(file1, textarea.value)
})
btn1_2.addEventListener('click', () => {
    textarea.value = ''
})

const btn2 = document.getElementById('btn2')
const fileName2 = document.getElementById('fileName2')
const btn_css = document.getElementById('btn_css')

let font_base64 = null
btn2.addEventListener('click', () => {
    openFile(async file => {
        btn_css.style.display = 'none'
        const fileName = file.name
        fileName2.textContent = fileName
        try {
            const base64 = await fileToBase64(file)
            font_base64 = base64
            // btn_css display
            btn_css.style.display = 'inline'
        } catch (error) {
            console.error('文件读取失败:', error)
        }
    })
})

btn_css.addEventListener('click', () => {
    if (!font_base64) return
    generateCss(fileName2.textContent, font_base64)
})
