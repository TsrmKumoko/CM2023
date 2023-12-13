const depthArray = [341.96, 311.10, 315.74, 324.49, 321.14, 333.09, 318.68, 338.88, 325.66, 309.84, 328.62, 321.80, 320.74, 308.30, 328.45, 312.62, 317.83, 327.40, 323.75, 313.48, 316.66, 340.19, 332.40, 319.20, 334.64, 311.43, 328.92, 314.11, 319.84, 321.28, 333.84, 319.68, 321.20, 320.89, 325.90, 335.28, 332.00, 324.47, 313.36, 330.60, 322.32, 315.10, 319.89, 316.75, 321.92, 327.64, 320.40, 329.88, 332.00, 344.35, 348.41]

const minDepth = 300
const maxDepth = 350
const ratio = 160 / (maxDepth - minDepth)

const q1InputBtn = document.getElementById('q1inputBtn')
const q1DropdownArrow = q1InputBtn.children[1]
const q1Select = document.getElementById('q1select')
const q1SelectOptions = q1Select.getElementsByTagName('div')

q1InputBtn.addEventListener('click', () => {
  q1DropdownArrow.classList.toggle('active')
  q1Select.classList.toggle('active')
})

q1Select.addEventListener('click', (ev) => {
  for (let i = 0; i < q1SelectOptions.length; i++) {
    if (ev.target == q1SelectOptions[i]) {
      q1SelectOptions[i].classList.add('active')
      q1InputBtn.children[0].innerText = q1SelectOptions[i].innerText
    } else {
      q1SelectOptions[i].classList.remove('active')
    }
  }
  q1InputBtn.click()
})

const q1Canvas = document.getElementsByTagName('canvas')[0]
const q1ctx = q1Canvas.getContext('2d')
const cQ1CS = window.getComputedStyle(q1Canvas)

let canvasWidth = cQ1CS.width.slice(0, -2)
let canvasHeight = cQ1CS.height.slice(0, -2)

q1ctx.scale = 2
q1Canvas.width = (parseInt(canvasWidth) * q1ctx.scale).toString()
q1Canvas.height = (parseInt(canvasHeight) * q1ctx.scale).toString()

// 画参考线和数值
function drawRefLines() {
  q1ctx.strokeStyle = '#abcdef'
  q1ctx.setLineDash([10, 10])
  for (let depth = minDepth; depth <= maxDepth; depth += 10) {
    let y = (depth - minDepth) * ratio + 20
    q1ctx.beginPath()
    q1ctx.moveTo(60, y * q1ctx.scale)
    q1ctx.lineTo(canvasWidth * q1ctx.scale, y * q1ctx.scale)
    q1ctx.stroke()
  }
}

function drawRefVals() {
  q1ctx.font = '24px Avenir'
  q1ctx.fillStyle = '#abcdef'
  q1ctx.clearRect(0, 0, 60, canvasHeight * q1ctx.scale)
  for (let depth = minDepth; depth <= maxDepth; depth += 10) {
    let y = (depth - minDepth) * ratio + 20
    q1ctx.fillText(depth.toString(), 10, y * q1ctx.scale + 8)
  }
}

drawRefLines()
drawRefVals()

q1ctx.node = function (x, y) {
  this.beginPath()
  this.arc(x * this.scale, y * this.scale, 5, 0, Math.PI * 2)
  this.fill()
}

let q1NodesOffset = 0
let nodesInterval = 25
function q1Data2Disp(idx, depth) {
  let x = idx * nodesInterval + 20 + 30 - q1NodesOffset * 0.2
  let y = (depth - minDepth) * ratio + 20
  return [x, y]
}

// 绘制散点
function drawAllNodes() {
  q1ctx.strokeStyle = '#456789'
  q1ctx.fillStyle = '#456789'
  depthArray.forEach((depth, idx) => {
    q1ctx.node(...q1Data2Disp(idx, depth))
  })
}
drawAllNodes()

q1Canvas.addEventListener('wheel', (ev) => {
  ev.preventDefault()
  let upperBorder = (nodesInterval * 50 - canvasWidth + 70) * 5
  if (q1NodesOffset > upperBorder) q1NodesOffset = upperBorder
  if (q1NodesOffset < 0) q1NodesOffset = 0
  q1NodesOffset += ev.deltaX
  q1NodesOffset += ev.deltaY
  q1ctx.clearRect(0, 0, canvasWidth * q1ctx.scale, canvasHeight * q1ctx.scale)
  drawRefLines()
  drawAllNodes()
  drawRefVals()
})

window.addEventListener('resize', (ev) => {
  canvasWidth = cQ1CS.width.slice(0, -2)
  canvasHeight = cQ1CS.height.slice(0, -2)
  q1Canvas.width = (parseInt(canvasWidth) * q1ctx.scale).toString()
  q1Canvas.height = (parseInt(canvasHeight) * q1ctx.scale).toString()
  q1ctx.clearRect(0, 0, canvasWidth * q1ctx.scale, canvasHeight * q1ctx.scale)
  drawRefLines()
  drawAllNodes()
  drawRefVals()
})
