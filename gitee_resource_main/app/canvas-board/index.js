
let canvas, ctx, canvasWidthInput, canvasHeightInput

const init = () => {
  canvas = document.getElementById('main-canvas')
  adjustCanvasSize()
  window.addEventListener('resize', adjustCanvasSize)

  // 初始化控制输入框并添加事件监听器
  // setupControls()
  draw()
}

const adjustCanvasSize = () => {
  const width = window.innerWidth - 60 // 减去边距等
  const height = window.innerHeight - 180 // 减去标题、控件等空间
  canvas.width = width
  canvas.height = height
  if (canvasWidthInput && canvasHeightInput) {
    canvasWidthInput.value = width
    canvasHeightInput.value = height
  }
}

const setupControls = () => {
  canvasWidthInput = document.createElement('input')
  canvasHeightInput = document.createElement('input')
  // 简化了控制面板的创建，仅展示核心逻辑
  canvasWidthInput.type = 'number'
  canvasHeightInput.type = 'number'
  canvasWidthInput.onchange = () => {
    canvas.width = canvasWidthInput.value
  }
  canvasHeightInput.onchange = () => {
    canvas.height = canvasHeightInput.value
  }
}

let draw = () => {
  /** @type {HTMLCanvasElement} */
  let mainCanvas = document.getElementById('main-canvas')
  let canvasWidth = document.getElementById('canvas-width')
  let canvasHeight = document.getElementById('canvas-height')
  let drawWidth = document.getElementById('draw-width')
  let drawColor = document.getElementById('draw-color')
  let drawClear = document.getElementById('draw-clear')
  let a = mainCanvas.getBoundingClientRect()
  let styleWidth = 3
  let styleColor = '#333'
  drawWidth.onchange = () => {
    styleWidth = drawWidth.value
  }
  drawColor.onchange = () => {
    styleColor = drawColor.value
  }

  if (mainCanvas.getContext) {
    let ctx = mainCanvas.getContext('2d')

    // 清空画布
    drawClear.onclick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    // 鼠标按下事件
    mainCanvas.onmousedown = e => {
      e = e || window.event
      let lastX = 0
      let lastY = 0
      ctx.strokeStyle = styleColor
      ctx.lineWidth = styleWidth
      ctx.lineCap = 'round'
      mainCanvas.onmousemove = e => {
        e = e || window.event
        let x =
          e.clientX -
          mainCanvas.getBoundingClientRect().left
        let y =
          e.clientY -
          mainCanvas.getBoundingClientRect().top
        if (lastX !== 0 || lastY !== 0) {
          ctx.beginPath()
          ctx.moveTo(lastX, lastY)
          ctx.lineTo(x, y)
          ctx.stroke()
        }
        lastX = x
        lastY = y
      }
    }
    mainCanvas.onmouseup = mainCanvas.onmouseout = () => {
      mainCanvas.onmousemove = null
    }
  }
}
