const fs = require('fs')
const path = require('path')

// 要生成的图片文件夹路径
const dirList = [
  {
    title: '静态图片资源 img',
    dirParh: '../../public/img'
  },
  {
    title: '团委打卡 daka_img',
    dirParh: '../../public/daka_img'
  }
]

// 读取文件大小是一个耗时的异步操作!
const createImgList = async ({ title, dirParh }) => {
  // 绝对路径
  const dirAbsPath = path.resolve(__dirname, dirParh)
  // 图片名数组
  const imgNameList = fs.readdirSync(dirAbsPath)
  // 图片路径数组
  const imgPathList = imgNameList.map(name => `${dirParh}/${name}`)
  //
  const imgList = await Promise.all(
    imgNameList.map(async imgName => {
      // 图片路径
      const imgPath = `${dirParh}/${imgName}`
      const imgAbsPath = path.resolve(__dirname, imgPath)
      return {
        url: imgPath,
        size: await getFileSize(imgAbsPath)
      }
    })
  )
  return { title, imgList }
}

Promise.all(dirList.map(createImgList)).then(res => {
  const imgListJSON = JSON.stringify(res)
  // 生成json文件
  fs.writeFile(
    path.resolve(__dirname, './imgCollection.json'),
    imgListJSON,
    err => {
      if (err) throw err
      console.log('文件创建成功')
    }
  )
})

return

// 读取文件大小 并格式化单位
function getFileSize(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err)
      } else {
        resolve(formatBytes(stats.size))
      }
    })
  })
}

// 将字节数 转化为KB、MB、GB 等形式的字符串
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(dm) + ' ' + sizes[i]
}
