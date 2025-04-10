//   排序方法
let compareOfKey = (property) => {
  return (a, b) => {
    let value1 = a[property]
    let value2 = b[property]
    if (value1 < value2) {
      return -1
    } else if (value1 > value2) {
      return 1
    }
    return 0
  }
}
// 封装一个排序函数
let sortByKey = (list, listKey) => {
  list.sort(compareOfKey(listKey))
}

// 逻辑
let colorList = []
let oColorUl = document.querySelectorAll('ul ~ ul')
// 遍历html元素
for (let i = 0; i < oColorUl.length; i++) {
  let temp = {}
  temp.colorNameEN = oColorUl[i].children[1].innerHTML
  temp.colorNameCN = oColorUl[i].children[2].innerHTML
  temp.colorHex = oColorUl[i].children[3].innerHTML
  temp.colorDec = oColorUl[i].children[4].innerHTML
  colorList.push(temp)
}
//   排序colorList
let sortColor = (num) => {
  let keyName
  switch (num) {
    case 1:
      keyName = 'colorNameEN'
      break
    case 2:
      keyName = 'colorNameCN'
      break
    case 3:
      keyName = 'colorHex'
      break
    case 4:
      keyName = 'colorDec'
      break
    default:
      keyName = 0
      break
  }
  if (keyName == 0) {
    console.log('请输入正确的数字参数!')
    return
  }
  sortByKey(colorList, keyName)
  //   重新输出页面
  for (let i = 0; i < colorList.length; i++) {
    oColorUl[i].innerHTML = `<li style="background-color: ${colorList[i].colorHex}"</li>
          <li>${colorList[i].colorNameEN}</li>
          <li>${colorList[i].colorNameCN}</li>
          <li>${colorList[i].colorHex}</li>
          <li>${colorList[i].colorDec}</li>
          <li style="background-color: ${colorList[i].colorHex}">
        </li>`
  }
}
console.log(
  '信息提示:\n可以调用sortColor函数展示不同的颜色顺序,页面初始默认按英文名排序(更多功能比如按rgb某一通道颜色值、16进制拆分排序请等待后续开发)\n目前函数参数可选1~4\n1 代表 颜色名\n2 代表 中文名称\n3 代表 Hex RGB\n4 代表 十进制 Decimal\n比如sortColor(4)表示按十进制 Decimal排序\n\n复制下面一行\nsortColor()\n在下面粘贴并填写数字,就能实现不同的排序'
)
