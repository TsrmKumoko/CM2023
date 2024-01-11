// 添加0为了方便reduce计算
let fansData = [9070, 532346, 956818, 3283561, 4490611, 5345441, 6044707, 6432501, 6613443, 6848090, 11320033, 13094392, 14077838, 14796441, 15224449, 15515560, 15675065, 16009874, 16625986, 16776186, 16885778, 17097632, 17236371, 17318052, 17478284, 17568855, 17593997, 17628518, 17660850, 17705193, 17727632, 17741979, 17746479, 17753725, 17768630, 17908767, 17919965, 17922083, 17929209, 17936294, 17935031, 17990118, 18013379, 18023975, 18037221, 18068263, 18172488, 18231418, 18262702, 18274481, 18276241, 18288609, 18292345, 18292396, 18291409, 18296106, 18293629, 18299746, 18324355, 18327146, 18332721, 18332970, 18334657, 18334812, 18342868, 18344525, 18350676, 18349742, 18349485, 18352505, 18355956, 18358176, 18367393, 18389673, 18388589, 18384355, 18382030, 18383631, 18386189, 18387207, 18385835, 18383338, 18376202, 18385698, 18388317, 18392935, 18392902, 18392344, 18392056, 18393046, 18462936, 18472166, 0]

// fansData = [4, 6.4, 8, 8.8, 9.22, 9.5, 9.7, 9.86, 10, 10.2, 10.32, 10.42, 10.5, 10.55, 10.58, 10.6, 0]

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
// let numFansSteady = 1 / ansFans.entry(0, 0)
let numFansSteady = Math.exp(ansFans.entry(0, 0))
const q2AnsSpan = document.getElementById('q2ans')
q2AnsSpan.innerText = `\\(a = ${numFansSteady.toFixed(0)}\\)`
fansData = fansData.slice(9)
coeffFans = new Matrix([
  [fansData.length - 1, fansData.reduceRight((pre, cur, idx) => pre + 1 / (idx + 1))],
  [fansData.reduceRight((pre, cur, idx) => pre + 1 / (idx + 1)), fansData.reduceRight((pre, cur, idx) => pre + 1 / (idx + 1) / (idx + 1))]
])
constFans = new Matrix([
  [fansData.reduceRight((pre, cur, idx) => pre + Math.log(cur))],
  [fansData.reduceRight((pre, cur, idx) => pre + Math.log(cur) / (idx + 1))]
])
ansFans = coeffFans.solve(constFans)
numFansSteady = Math.exp(ansFans.entry(0, 0))
const q2AnsCutSpan = document.getElementById('q2ans-cut')
q2AnsCutSpan.innerText = `\\(a = ${numFansSteady.toFixed(0)}\\)`

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
