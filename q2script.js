// 末尾添加0为了方便reduce计算
let fansData = [9070, 532346, 956818, 3283561, 4490611, 5345441, 6044707, 6432501, 6613443, 6848090, 11320033, 13094392, 14077838, 14796441, 15224449, 15515560, 15675065, 16009874, 16625986, 16776186, 16885778, 17097632, 17236371, 17318052, 17478284, 17568855, 17593997, 17628518, 17660850, 17705193, 17727632, 17741979, 17746479, 17753725, 17768630, 17908767, 17919965, 17922083, 17929209, 17936294, 17935031, 17990118, 18013379, 18023975, 18037221, 18068263, 18172488, 18231418, 18262702, 18274481, 18276241, 18288609, 18292345, 18292396, 18291409, 18296106, 18293629, 18299746, 18324355, 18327146, 18332721, 18332970, 18334657, 18334812, 18342868, 18344525, 18350676, 18349742, 18349485, 18352505, 18355956, 18358176, 18367393, 18389673, 18388589, 18384355, 18382030, 18383631, 18386189, 18387207, 18385835, 18383338, 18376202, 18385698, 18388317, 18392935, 18392902, 18392344, 18392056, 18393046, 18462936, 18472166, 0]

// 使用reduceRight，从后往前计算，避免大数加小数
let coeffFans = new Matrix([
  [fansData.length - 1, fansData.reduceRight((pre, cur, idx) => pre + 1 / (idx + 1))],
  [fansData.reduceRight((pre, cur, idx) => pre + 1 / (idx + 1)), fansData.reduceRight((pre, cur, idx) => pre + 1 / (idx + 1) / (idx + 1))]
])

let constFans = new Matrix([
  [fansData.reduceRight((pre, cur, idx) => pre + Math.log(cur))],
  [fansData.reduceRight((pre, cur, idx) => pre + Math.log(cur) / (idx + 1))]
])

let ansFans = coeffFans.solve(constFans)
let numFansSteady = Math.exp(ansFans.entry(0, 0))
const q2AnsSpan = document.getElementById('q2ans')
q2AnsSpan.innerText = `\\(a = ${numFansSteady.toFixed(0)}\\)`

// 绘图
const cScale = 2
const canvas1 = document.getElementsByTagName('canvas')[1]
const ctx1 = canvas1.getContext('2d')
const style1 = window.getComputedStyle(canvas1)

let c1Width = parseInt(style1.width.slice(0, -2))
let c1Height = parseInt(style1.height.slice(0, -2))

canvas1.width = (c1Width * cScale).toString()
canvas1.height = (c1Height * cScale).toString()

// 画参考线，高度为600px，数据从0到20e6，4e6为一个单位，分为6条参考线
// 0线对应550，20e6线对应50
ctx1.strokeStyle = '#abcdef'
ctx1.setLineDash([10, 10])
ctx1.lineWidth = 1
for (let i = 0; i <= 5; i++) {
  ctx1.beginPath()
  ctx1.moveTo(70, 100 * i + 50)
  ctx1.lineTo(c1Width * cScale, 100 * i + 50)
  ctx1.stroke()
}

// 绘制参考数值
ctx1.font = '24px Avenir'
ctx1.fillStyle = '#abcdef'
ctx1.clearRect(0, 0, 70, c1Height * cScale)
for (let i = 0; i <= 5; i++) {
  if (i == 0) ctx1.fillText('0', 10, 100 * (5 - i) + 58)
  else ctx1.fillText(`${(4 * i).toFixed(0)}e6`, 10, 100 * (5 - i) + 58)
}

// 画参考数据点，宽度为1200，从70开始，可用1130
// 1对应70+ni，fD.len-1对应1200-ni
let data2Disp = function (day, fans) {
  let nodesInterval = 1130 / fansData.length
  let slopeX = (1200 - nodesInterval - 70 - nodesInterval) / (fansData.length - 2)
  let x = slopeX * (day - 1) + 70 + nodesInterval
  let slopeY = - 500 / 20e6
  let y = slopeY * fans + 550
  return [x, y]
}
ctx1.strokeStyle = '#bbbbbb'
ctx1.setLineDash([])
ctx1.lineWidth = 4
ctx1.beginPath()
ctx1.moveTo(...data2Disp(1, fansData[0]))
fansData.slice(0, -1).forEach((num, idx) => {
  ctx1.lineTo(...data2Disp(idx + 1, num))
})
ctx1.stroke()

// 画拟合曲线
ctx1.strokeStyle = '#456789'
ctx1.lineWidth = 3
function fitLine(day) {
  return numFansSteady * Math.exp(ansFans.entry(1, 0) / day)
}
ctx1.beginPath()
for (let i = 1; i <= fansData.length - 1; i += 0.1) {
  if (i == 1) ctx1.moveTo(...data2Disp(i, fitLine(i)))
  else ctx1.lineTo(...data2Disp(i, fitLine(i)))
}
ctx1.stroke()

// 舍去前9天的数据
let fansDataCut = fansData.slice(9)
coeffFans = new Matrix([
  [fansDataCut.length - 1, fansDataCut.reduceRight((pre, cur, idx) => pre + 1 / (idx + 1))],
  [fansDataCut.reduceRight((pre, cur, idx) => pre + 1 / (idx + 1)), fansDataCut.reduceRight((pre, cur, idx) => pre + 1 / (idx + 1) / (idx + 1))]
])
constFans = new Matrix([
  [fansDataCut.reduceRight((pre, cur, idx) => pre + Math.log(cur))],
  [fansDataCut.reduceRight((pre, cur, idx) => pre + Math.log(cur) / (idx + 1))]
])
ansFans = coeffFans.solve(constFans)
numFansSteady = Math.exp(ansFans.entry(0, 0))
const q2AnsCutSpan = document.getElementById('q2ans-cut')
q2AnsCutSpan.innerText = `\\(a = ${numFansSteady.toFixed(0)}\\)`
const q2AnsFinal = document.getElementById('q2ans-f')
q2AnsFinal.innerText = `${numFansSteady.toFixed(0)}`

// 绘图
// const cScale = 2
const canvas2 = document.getElementsByTagName('canvas')[2]
const ctx2 = canvas2.getContext('2d')
const style2 = window.getComputedStyle(canvas2)

let c2Width = parseInt(style2.width.slice(0, -2))
let c2Height = parseInt(style2.height.slice(0, -2))

canvas2.width = (c2Width * cScale).toString()
canvas2.height = (c2Height * cScale).toString()

// 画参考线，高度为600px，数据从0到20e6，4e6为一个单位，分为6条参考线
// 0线对应550，20e6线对应50
ctx2.strokeStyle = '#abcdef'
ctx2.setLineDash([10, 10])
ctx2.lineWidth = 1
for (let i = 0; i <= 5; i++) {
  ctx2.beginPath()
  ctx2.moveTo(70, 100 * i + 50)
  ctx2.lineTo(c2Width * cScale, 100 * i + 50)
  ctx2.stroke()
}

// 绘制参考数值
ctx2.font = '24px Avenir'
ctx2.fillStyle = '#abcdef'
ctx2.clearRect(0, 0, 70, c2Height * cScale)
for (let i = 0; i <= 5; i++) {
  if (i == 0) ctx2.fillText('0', 10, 100 * (5 - i) + 58)
  else ctx2.fillText(`${(4 * i).toFixed(0)}e6`, 10, 100 * (5 - i) + 58)
}

// 画参考数据点，宽度为1200，从70开始，可用1130
// 1对应70+ni，fD.len-1对应1200-ni
// let data2Disp = function (day, fans) {
//   let nodesInterval = 1130 / fansData.length
//   let slopeX = (1200 - nodesInterval - 70 - nodesInterval) / (fansData.length - 2)
//   let x = slopeX * (day - 1) + 70 + nodesInterval
//   let slopeY = - 500 / 20e6
//   let y = slopeY * fans + 550
//   return [x, y]
// }
ctx2.strokeStyle = '#bbbbbb'
ctx2.setLineDash([])
ctx2.lineWidth = 4
ctx2.beginPath()
ctx2.moveTo(...data2Disp(1, fansData[0]))
fansData.slice(0, -1).forEach((num, idx) => {
  ctx2.lineTo(...data2Disp(idx + 1, num))
})
ctx2.stroke()

// 画拟合曲线
ctx2.strokeStyle = '#456789'
ctx2.lineWidth = 3
function fitLine(day) {
  return numFansSteady * Math.exp(ansFans.entry(1, 0) / day)
}
ctx2.beginPath()
for (let i = 10; i <= fansData.length - 1; i += 0.1) {
  if (i == 10) ctx2.moveTo(...data2Disp(i, fitLine(i - 9)))
  else ctx2.lineTo(...data2Disp(i, fitLine(i - 9)))
}
ctx2.stroke()

renderMathInElement(q2AnsSpan, {
  delimiters: [
    { left: "\(", right: "\)", display: false }
  ]
})
renderMathInElement(q2AnsCutSpan, {
  delimiters: [
    { left: "\(", right: "\)", display: false }
  ]
})
