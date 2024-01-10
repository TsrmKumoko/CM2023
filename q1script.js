let depthArray = [341.96, 311.10, 315.74, 324.49, 321.14, 333.09, 318.68, 338.88, 325.66, 309.84, 328.62, 321.80, 320.74, 308.30, 328.45, 312.62, 317.83, 327.40, 323.75, 313.48, 316.66, 340.19, 332.40, 319.20, 334.64, 311.43, 328.92, 314.11, 319.84, 321.28, 333.84, 319.68, 321.20, 320.89, 325.90, 335.28, 332.00, 324.47, 313.36, 330.60, 322.32, 315.10, 319.89, 316.75, 321.92, 327.64, 320.40, 329.88, 332.00, 344.35, 348.41]
const xUnit = 100

const minDepth = 300
const maxDepth = 350
const ratio = 160 / (maxDepth - minDepth)

const q1InputBtn = document.getElementById('q1inputBtn')
const q1DropdownArrow = q1InputBtn.children[1]
const q1Select = document.getElementById('q1select')
const q1SelectOptions = q1Select.getElementsByTagName('div')
const q1Descriptions = document.getElementsByClassName('q1description')

let algrsmIdx = -1

// 点击按钮展开/关闭菜单
q1InputBtn.addEventListener('click', () => {
  q1DropdownArrow.classList.toggle('active')
  q1Select.classList.toggle('active')
})

// 定义点击菜单内选项行为，选择算法
q1Select.addEventListener('click', (ev) => {
  for (let i = 0; i < q1SelectOptions.length; i++) {
    if (ev.target == q1SelectOptions[i]) {
      q1SelectOptions[i].classList.add('active')
      q1InputBtn.children[0].innerText = q1SelectOptions[i].innerText
      q1Descriptions[i].classList.add('active')
      algrsmIdx = i
      drawAllThings()
    } else {
      q1SelectOptions[i].classList.remove('active')
      q1Descriptions[i].classList.remove('active')
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

// drawRefLines()
// drawRefVals()

// 绘制曲线函数列表
let drawCurve = new Array(3).fill(() => { return })

// 向q1ctx中添加绘制散点函数
q1ctx.node = function (x, y) {
  this.beginPath()
  this.arc(x, y, 5, 0, Math.PI * 2)
  this.fill()
}

let q1NodesOffset = 0
let nodesInterval = 25
function q1Data2Disp(idx, depth) {
  let x = (idx * nodesInterval + 20 + 30 - q1NodesOffset * 0.2) * q1ctx.scale
  let y = ((depth - minDepth) * ratio + 20) * q1ctx.scale
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
// drawAllNodes()

function drawAllThings() {
  q1ctx.clearRect(0, 0, canvasWidth * q1ctx.scale, canvasHeight * q1ctx.scale)
  drawRefLines()
  drawAllNodes()
  if (algrsmIdx != -1) drawCurve[algrsmIdx](depthArray)
  drawRefVals()
}
drawAllThings()

// 定义滚轮在绘图区滚动时的行为
q1Canvas.addEventListener('wheel', (ev) => {
  ev.preventDefault()
  let upperBorder = (nodesInterval * 50 - canvasWidth + 70) * 5
  if (q1NodesOffset > upperBorder) q1NodesOffset = upperBorder
  if (q1NodesOffset < 0) q1NodesOffset = 0
  q1NodesOffset += ev.deltaX
  q1NodesOffset += ev.deltaY
  drawAllThings()
})

// 定义窗口大小改变时绘图区的行为
window.addEventListener('resize', (ev) => {
  canvasWidth = cQ1CS.width.slice(0, -2)
  canvasHeight = cQ1CS.height.slice(0, -2)
  q1Canvas.width = (parseInt(canvasWidth) * q1ctx.scale).toString()
  q1Canvas.height = (parseInt(canvasHeight) * q1ctx.scale).toString()
  drawAllThings()
})

/**
 * 分段线性插值算法计算海底光缆长度
 * @param {Array.<number>} depthArray 海底深度列表
 */
function segLinInterp(depthArray) {
  let prev = 0
  return depthArray.map((value, idx) => {
    ans = idx == 0 ? 0 : value - prev
    prev = value
    return ans
  }).reduce((pre, cur) => pre + Math.sqrt(cur * cur + xUnit * xUnit))
}

// 绘制直线
drawCurve[0] = function drawSegLin(depthArray) {
  q1ctx.strokeStyle = '#456789'
  q1ctx.lineWidth = 2
  q1ctx.setLineDash([])
  q1ctx.beginPath()
  for (let i = 0; i < depthArray.length; i++) {
    if (i == 0) q1ctx.moveTo(...q1Data2Disp(i, depthArray[i]))
    else q1ctx.lineTo(...q1Data2Disp(i, depthArray[i]))
  }
  q1ctx.stroke()
}

let segQuaCoeff = []
/**
 * 分段二次插值算法计算海底光缆长度
 * @param {Array.<number>} depthArray 海底深度列表
 */
function segQuaInterp(depthArray) {
  segQuaCoeff = []
  let sumLen = 0
  let f0, f1, f2, f01, f12, f012, a, b, c
  // 二次函数曲线长度（不定积分结果）
  function curveLenInt(x, a, b) {
    let _2axb = 2 * a * x + b
    let ans = _2axb * Math.sqrt(1 + _2axb * _2axb)
    ans += Math.asinh(_2axb)
    ans /= 4 * a
    return ans
  }
  // 牛顿插值多项式
  for (let i = 0; i < depthArray.length - 1; i += 2) {
    f0 = depthArray[i]
    f1 = depthArray[i + 1]
    f2 = depthArray[i + 2]
    f01 = (f1 - f0) / xUnit
    f12 = (f2 - f1) / xUnit
    f012 = (f12 - f01) / xUnit / 2
    // segQuaCoef.push((x) => f0 + (x - i * xUnit) * (f01 + f012 * (x - (i + 1) * xUnit)))
    c = f0 - f01 * i * xUnit + f012 * i * (i + 1) * xUnit * xUnit
    b = f01 - f012 * (2 * i + 1) * xUnit
    a = f012
    segQuaCoeff.push([a, b, c])
    sumLen += curveLenInt((i + 2) * xUnit, a, b)
    sumLen -= curveLenInt(i * xUnit, a, b)
  }
  return sumLen
}

segLinInterp(depthArray)
drawCurve[1] = function drawQuaCur(depthArray) {
  q1ctx.strokeStyle = '#456789'
  q1ctx.lineWidth = 2
  q1ctx.setLineDash([])
  q1ctx.beginPath()
  for (let i = 0; i < depthArray.length - 1; i += 2) {
    if (i == 0) q1ctx.moveTo(...q1Data2Disp(i, depthArray[i]))
    // 将区间(i, i+2]分为n份
    let nPoints = 20
    let nUnit = 2 / nPoints
    // 创建(i, i+2]的linspace
    let pointArr = new Array(nPoints).fill(i)
    pointArr = pointArr.map((value, idx) => value + (idx + 1) * nUnit)
    pointArr.forEach((value) => {
      let x = value * xUnit
      let a, b, c
      [a, b, c] = segQuaCoeff[Math.round(i / 2)]
      let depth = c + (b + a * x) * x
      q1ctx.lineTo(...q1Data2Disp(value, depth))
    })
  }
  q1ctx.stroke()
}

let splTriCoeff = []
/**
 * 三次样条插值算法计算海底光缆长度
 * @param {Array.<number>} depthArray 海底深度列表
 */
function splTriInterp(depthArray) {
  // 求出三次样条插值的系数矩阵，阶数应当为序列长度51
  let order = depthArray.length
  let coeffArr = new Array(order)
  coeffArr.fill([0.5, 2, 0.2])
  let coeffMat = new BandMatrix(coeffArr, 1, 1)
  let constArr = new Array(order).fill(0)
  let depth = (idx) => {
    if (idx < 0) idx += order
    if (idx >= order) idx -= order
    return depthArray[idx]
  }
  constArr = constArr.map((val, idx) => {
    let f0, f1, f2, f01, f12, f012
    [f0, f1, f2] = [depth(idx - 1), depth(idx), depth(idx + 1)]
    f01 = (f1 - f0) / xUnit
    f12 = (f2 - f1) / xUnit
    f012 = (f12 - f01) / xUnit / 2
    return 6 * f012
  })
  let constMat = new Matrix([constArr]).transpose()
  let ansMat = coeffMat.solve(constMat).transpose()
  splTriCoeff = ansMat.entries[0] // 求出了M0-M50
  // 求每个分段上的积分，误差限1e-3
  let x0, x1, y0, y1, M0, M1
  function Sl(x) {
    let fnVal = -(x1 - x) * (x1 - x) * M0 / xUnit / 2
    fnVal += (x - x0) * (x - x0) * M1 / xUnit / 2
    fnVal += -(y0 / xUnit - M0 * xUnit / 6)
    fnVal += (y1 / xUnit - M1 * xUnit / 6)
    return Math.sqrt(1 + fnVal * fnVal)
  }
  function rbgInt(time, order) {
    if (order == 0 && time == 0) {
      return xUnit / 2 * (Sl(x0) + Sl(x1))
    } else if (order == 0 && time > 0) {
      let step = xUnit / Math.pow(2, time)
      let sum = 0
      for (let i = 1; i <= Math.pow(2, time - 1); i++) {
        sum += Sl(x0 + (2 * i - 1) * step)
      }
      return rbgInt(time - 1, order) / 2 + step * sum
    } else if (order > 0) {
      return rbgInt(time + 1, order - 1) + (rbgInt(time + 1, order - 1) - rbgInt(time, order - 1)) / (Math.pow(4, order) - 1)
    }
  }
  let splInt = 0
  for (let i = 0; i < depthArray.length - 1; i++) {
    x0 = i * xUnit
    x1 = (i + 1) * xUnit
    y0 = depthArray[i]
    y1 = depthArray[i + 1]
    M0 = splTriCoeff[i]
    M1 = splTriCoeff[i + 1]
    let time = 1
    while (Math.abs(rbgInt(time, 3) - rbgInt(time - 1, 3)) >= 1e-3) time += 1
    splInt += rbgInt(time, 3)
  }
  return splInt
}

splTriInterp(depthArray)
drawCurve[2] = function drawSplCur(depthArray) {
  q1ctx.strokeStyle = '#456789'
  q1ctx.lineWidth = 2
  q1ctx.setLineDash([])
  q1ctx.beginPath()
  for (let i = 0; i < depthArray.length - 1; i++) {
    if (i == 0) q1ctx.moveTo(...q1Data2Disp(i, depthArray[i]))
    // 将区间(i, i+1]分为n份
    let nPoints = 10
    let nUnit = 1 / nPoints
    // 创建(i, i+1]的linspace
    let pointArr = new Array(nPoints).fill(i)
    pointArr = pointArr.map((value, idx) => value + (idx + 1) * nUnit)
    // 区间的左右边界（米）
    let x0 = i * xUnit
    let x1 = (i + 1) * xUnit
    let y0 = depthArray[i]
    let y1 = depthArray[i + 1]
    let M0 = splTriCoeff[i]
    let M1 = splTriCoeff[i + 1]
    pointArr.forEach((value) => {
      let x = value * xUnit
      let depth = (x1 - x) * (x1 - x) * (x1 - x) * M0 / xUnit / 6
      depth += (x - x0) * (x - x0) * (x - x0) * M1 / xUnit / 6
      depth += (x1 - x) * (y0 / xUnit - M0 * xUnit / 6)
      depth += (x - x0) * (y1 / xUnit - M1 * xUnit / 6)
      q1ctx.lineTo(...q1Data2Disp(value, depth))
    })
  }
  q1ctx.stroke()
}

console.log(segLinInterp(depthArray))
console.log(segQuaInterp(depthArray))
console.log(splTriInterp(depthArray))
