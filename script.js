/**
 * ## 矩阵类
 * @class 包含矩阵的基本运算方法
 * @param {Array.<Array.<number>>} entries 用二阶数组的形式表示的矩阵的所有元素
 */
function Matrix(entries) {
  this.entries = entries
}

/**
 * 给指定位置赋值并返回该值，如果不传递`val`则返回原来的值。
 * @param {number} row 指定位置的行数
 * @param {number} col 指定位置的列数
 * @param {numner} val 待赋的值
 * @returns {number} 指定位置上（赋值后）的值
 */
Matrix.prototype.entry = function (row, col, val) {
  // 为了加速删除了判断是否在范围内的语句。
  // if (row < 0 || row >= this.nRows() || col < 0 || col >= this.nCols()) throw new Error('指定位置不在矩阵内')
  if (val === undefined) return this.entries[row][col]
  else {
    this.entries[row][col] = val
    return val
  }
}

/**
 * 在console中预览矩阵。
 * @param {(number|Array.<number>)} rows 打印的行数范围。如果`rows`是`number`，则打印前`rows`行；如果是长度为2的`Array.<number>`，则打印第`rows[0]`到`rows[1]`行（包含起点不包含终点）。越界时不会报错。
 * @param {(number|Array.<number>)} cols 打印的列数范围。如果`cols`是`number`，则打印前`cols`列；如果是长度为2的`Array.<number>`，则打印第`cols[0]`到`cols[1]`列（包含起点不包含终点）。越界时不会报错。
 */
Matrix.prototype.preview = function (rows = 8, cols = 8) {
  if (typeof rows === 'number') rows = [0, rows]
  if (typeof cols === 'number') cols = [0, cols]
  rows[0] = Math.max(rows[0], 0)
  rows[1] = Math.min(rows[1], this.nRows())
  cols[0] = Math.max(cols[0], 0)
  cols[1] = Math.min(cols[1], this.nCols())
  const selectedRows = this.entries.slice(rows[0], rows[1])
  selectedRows.forEach((row, i) => {
    let displayRow = new Array(cols[1] - cols[0]).fill(0).map((val, j) => this.entry(i, j + cols[0]), this)
    console.log(displayRow)
  });
}

/**
 * 输出矩阵对应的LaTeX代码。
 * @param {(number)} rows 打印的行数范围。如果`rows`是`number`，则打印前`rows`行；如果是长度为2的`Array.<number>`，则打印第`rows[0]`到`rows[1]`行（包含起点不包含终点）。越界时不会报错。
 * @param {(number)} cols 打印的列数范围。如果`cols`是`number`，则打印前`cols`列；如果是长度为2的`Array.<number>`，则打印第`cols[0]`到`cols[1]`列（包含起点不包含终点）。越界时不会报错。
 */
Matrix.prototype.latex = function (precision = 3, rows = 10, cols = 10) {
  let latexStr = '\\begin{bmatrix}'
  rows = Math.min(rows, this.nRows())
  cols = Math.min(cols, this.nCols())
  let rowOverFlow = rows < this.nRows()
  let colOverFlow = cols < this.nCols()
  const selectedRows = this.entries.slice(0, rows)
  selectedRows.forEach((row, i) => {
    new Array(cols).fill(0).forEach((val, j) => {
      if (i == rows - 1 && j == cols - 1 && rowOverFlow && colOverFlow) {
        latexStr += '\\ddots'
      } else if (j == cols - 1 && colOverFlow) {
        latexStr += '\\cdots'
      } else if (i == rows - 1 && rowOverFlow) {
        latexStr += '\\vdots'
      } else {
        latexStr += `${this.entry(i, j).toPrecision(precision)}`
      }
      if (i == rows - 1 && j == cols - 1) { }
      else if (j == cols - 1) latexStr += '\\\\'
      else latexStr += '&'
    }, this)
  })
  latexStr += '\\end{bmatrix}'
  return latexStr
}

/**
 * 返回矩阵的行数。
 * @returns {number} 矩阵的行数
 */
Matrix.prototype.nRows = function () {
  return this.entries.length
}

/**
 * 返回矩阵的列数。
 * @returns {number} 矩阵的列数
 */
Matrix.prototype.nCols = function () {
  return this.entries[0].length
}

/**
 * 返回指定阶数的单位矩阵。
 * @static
 * @param {number} order 单位矩阵的阶数
 * @returns {Matrix} 单位矩阵
 */
Matrix.unit = function (order) {
  let ans = new Array(order)
  for (let i = 0; i < order; i++) {
    let row = new Array(order).fill(0)
    row[i] = 1
    ans[i] = row
  }
  return new Matrix(ans)
}

/**
 * 返回矩阵的转置。
 * @returns {Matrix}
 */
Matrix.prototype.transpose = function () {
  let ans = new Array(this.nCols())
  for (let i = 0; i < this.nCols(); i++) {
    let row = new Array(this.nRows()).fill(0)
    ans[i] = row.map((val, j) => this.entry(j, i), this)
  }
  return new Matrix(ans)
}

/**
 * 计算两个矩阵的和。
 * @param {Matrix} that 待相加的另一个矩阵
 * @returns {Matrix} 计算结果
 */
Matrix.prototype.add = function (that) {
  if (!(that instanceof Matrix)) {
    throw new Error('矩阵只能和矩阵相加')
  } else if (this.nRows() != that.nRows() || this.nCols() != that.nCols()) {
    throw new Error('两矩阵维度不同，无法相加')
  } else {
    let ans = new Array(this.nRows())
    for (let i = 0; i < this.nRows(); i++) {
      let row = new Array(this.nCols()).fill(0)
      // 用entry函数访问元素，方便子类entries数据结构改变时调用
      ans[i] = row.map((val, j) => this.entry(i, j) + that.entry(i, j), this)
    }
    return new Matrix(ans)
  }
}

/**
 * 计算矩阵和数或矩阵的乘积。
 * @param {(number|Matrix)} that 待相乘的另一个数或矩阵
 * @returns {Matrix} 计算结果
 */
Matrix.prototype.mul = function (that) {
  if (typeof that === 'number') {
    let ans = new Array(this.nRows())
    for (let i = 0; i < this.nRows(); i++) {
      let row = new Array(this.nCols()).fill(0)
      ans[i] = row.map((val, j) => this.entry(i, j) * that, this)
    }
    return new Matrix(ans)
  } else if (that instanceof Matrix) {
    if (this.nCols() != that.nRows()) {
      throw new Error('两矩阵维度不符合要求，无法相乘')
    }
    let ans = new Array(this.nRows())
    for (let i = 0; i < this.nRows(); i++) {
      let row = new Array(that.nCols())
      for (let j = 0; j < that.nCols(); j++) {
        // 创建一个prd数组存放乘积，再对这个乘积数组求和
        let prd = new Array(this.nCols()).fill(0)
        prd = prd.map((val, k) => this.entry(i, k) * that.entry(k, j), this)
        row[j] = prd.reduce((pre, curr) => pre + curr)
      }
      ans[i] = row
    }
    return new Matrix(ans)
  } else {
    throw new Error('矩阵只能与数或矩阵相乘')
  }
}

/**
 * 交换指定的两行并返回交换后的矩阵。这个操作将修改原矩阵的值而不会创建一个新矩阵。
 * @param {number} row1 其中一行的行数
 * @param {number} row2 另一行的行数
 * @returns {Matrix} 交换两行后的结果
 */
Matrix.prototype.swap2Rows = function (row1, row2) {
  let tempRow = this.entries[row1]
  this.entries[row1] = this.entries[row2]
  this.entries[row2] = tempRow
  return this
}

/**
 * 将某一行乘以一个倍数后加到另外一行并返回操作后的矩阵。这个操作将修改原矩阵的值而不会创建一个新矩阵。
 * @param {number} scalar 待乘的倍数
 * @param {number} row1 某一行的行数。这一行将会被乘以`scalar`并加在第`row2`行上。
 * @param {number} row2 待加的行的行数
 * @returns {Matrix} 结果
 */
Matrix.prototype.scaleAdd = function (scalar, row1, row2) {
  this.entries[row2] = this.entries[row2].map((val, j) => scalar * this.entry(row1, j) + val, this)
  return this
}

/**
 * 用高斯消元法求解方程组。目前，由于没有实现对角线出现零元素的处理方法，系数矩阵为严格对角占优矩阵是该算法可解的必要条件。
 * @param {Matrix} constVec 方程右端常数向量（nx1阶矩阵）
 */
Matrix.prototype.solve = function (constVec) {
  // 下行
  for (let row = 0; row < this.nRows() - 1; row++) {
    for (let i = row + 1; i < this.nRows(); i++) {
      if (this.entry(i, row) == 0) continue
      let scalar = -this.entry(i, row) / this.entry(row, row)
      this.scaleAdd(scalar, row, i)
      constVec.scaleAdd(scalar, row, i)
      // 避免因误差导致的无法消元的情况
      if (this.entry(i, row) != 0) this.entry(i, row, 0)
    }
  }
  // 上行
  let ans = new Array(constVec.nRows())
  for (let row = this.nRows() - 1; row > 0; row--) {
    // 当前行仅剩一个元素，可以直接解出
    ans[row] = [constVec.entry(row, 0) / this.entry(row, row)]
    for (let i = row - 1; i >= 0; i--) {
      if (this.entry(i, row) == 0) continue
      let scalar = -this.entry(i, row) / this.entry(row, row)
      this.scaleAdd(scalar, row, i)
      constVec.scaleAdd(scalar, row, i)
      // 避免因误差导致的无法消元的情况
      if (this.entry(i, row) != 0) this.entry(i, row, 0)
    }
  }
  ans[0] = [constVec.entry(0, 0) / this.entry(0, 0)]
  return new Matrix(ans)
}


/**
 * ## 带状矩阵类
 * @class 用压缩形式存储数据的带状矩阵类。为矩阵类的子类。
 * @param {Array.<Array.<number>>} entries 压缩形式的带状矩阵的元素，用二阶数组表示。行数为原矩阵的行数，而列数为上下带宽之和加一与原矩阵列数的较小者。
 * @param {number} lbw 下带宽。
 * @param {number} ubw 上带宽。
 */
function BandMatrix(entries, lbw, ubw) {
  this.entries = entries
  this.order = entries.length
  this.bw = entries[0].length
  this.lbw = lbw
  this.ubw = ubw
}

BandMatrix.prototype = new Matrix()
BandMatrix.prototype.constructor = BandMatrix

/**
 * 返回带状矩阵的列数。
 * @returns {number} 矩阵的列数
 */
BandMatrix.prototype.nCols = function () {
  return this.order
}

/**
 * 返回带状矩阵的行数。
 * @returns {number} 矩阵的行数
 */
BandMatrix.prototype.nRows = function () {
  return this.order
}

/**
 * 给指定位置赋值并返回该值，如果不传递`val`则返回原来的值。无法给带状区域之外的位置赋值。
 * @param {number} row 指定位置的行数
 * @param {number} col 指定位置的列数
 * @param {number} val 待赋的值
 * @returns {number} 指定位置上（赋值后）的值
 */
BandMatrix.prototype.entry = function (row, col, val) {
  // 为了加速删除了判断是否在范围内的语句。
  // if (row < 0 || row >= this.nRows() || col < 0 || col >= this.nCols()) throw new Error('指定位置不在矩阵内')
  let isEmpty = !(row - col <= this.lbw && col - row <= this.ubw)
  if (val === undefined) {
    if (isEmpty) return 0
    else {
      return this.entries[row][this.lbw - row + col]
    }
  } else {
    if (isEmpty) throw new Error(`无法修改带状矩阵的元素：(${row}, ${col})超出带状范围`)
    else {
      this.entries[row][this.lbw - row + col] = val
      return val
    }
  }
}

/**
 * 将某一行乘以一个倍数后加到另外一行并返回操作后的矩阵。这个操作将修改原矩阵的值而不会创建一个新矩阵。要求`row1`的非零元素位置的集合是带状区域第`row2`行元素位置集合的子集。
 * @param {number} scalar 待乘的倍数
 * @param {number} row1 某一行的行数。这一行将会被乘以`scalar`并加在第`row2`行上。
 * @param {number} row2 待加的行的行数
 * @returns {Matrix} 结果
 */
BandMatrix.prototype.scaleAdd = function (scalar, row1, row2) {
  let left1 = Math.max(row1 - this.lbw, 0)
  let left2 = Math.max(row2 - this.lbw, 0)
  let right1 = Math.min(row1 + this.ubw, this.nCols() - 1)
  let right2 = Math.min(row2 + this.ubw, this.nCols() - 1)
  let left, right
  // if (left1 < left2) {
  //   for (let col = left1; col < left2; col++) {
  //     if (this.entry(row1, col) != 0) throw new Error('无法执行此初等变换：超出带状范围')
  //   }
  //   left = left2
  //   right = right1
  // } else if (right1 > right2) {
  //   for (let col = right1; col > right2; col--) {
  //     if (this.entry(row1, col) != 0) throw new Error('无法执行此初等变换：超出带状范围')
  //   }
  //   left = left1
  //   right = right2
  // } else {
  //   left = left1
  //   right = right1
  // }
  // 为了加速而使用下面的不含报错的语句。如果不清楚矩阵是否符合要求，应当使用上面的包含报错的语句。
  left = left1 < left2 ? left2 : left1
  right = right1 > right2 ? right2 : right1
  for (let col = left; col <= right; col++) {
    this.entry(row2, col, scalar * this.entry(row1, col) + this.entry(row2, col))
  }
  return this
}




// 读取本地dat文件
// const fileInput = document.createElement('input');
// fileInput.type = 'file';

const fileInput = document.getElementById('q3input')
const filenameLabel = document.getElementById('q3filename')
const formulaDisplay = document.getElementById('q3display')

fileInput.addEventListener('change', (ev) => {
  const file = ev.target.files[0];
  const reader = new FileReader();

  const filename = fileInput.files[0].name
  filenameLabel.innerText = filename

  reader.addEventListener('load', (ev) => {
    const fileContent = ev.target.result;

    const infoArray = new Uint32Array(fileContent.slice(0, 24))
    console.log(infoArray)

    let isCompressed = (infoArray[1] == 0x202)
    let order = infoArray[3]
    let ubw = infoArray[4]
    let lbw = infoArray[5]
    let nCols = isCompressed ? Math.min(ubw + lbw + 1, order) : order


    const dataArray = new Float32Array(fileContent.slice(24))

    let coefficients = new Array(order)
    for (let row = 0; row < order; row++) {
      coefficients[row] = dataArray.slice(row * nCols, (row + 1) * nCols)
    }
    let constArray = [dataArray.slice(order * nCols)]


    let coeffMat = isCompressed ? new BandMatrix(coefficients, lbw, ubw) : new Matrix(coefficients)
    let constVec = new Matrix(constArray).transpose()
    let ansVec

    let coeffMatStr = coeffMat.latex()
    let constVecStr = constVec.latex()

    formulaDisplay.innerText = `$$${coeffMatStr}` + '\\begin{bmatrix}' + '?\\\\'.repeat(9) + (order == 10 ? '?' : '\\vdots') + '\\end{bmatrix}' + `=${constVecStr}$$`

    renderMathInElement(formulaDisplay, {
      delimiters: [
        { left: "$$", right: "$$", display: true }
      ]
    })

    setTimeout(() => {
      console.time('Elapsed Time')
      ansVec = coeffMat.solve(constVec)
      console.timeEnd('Elapsed Time')

      formulaDisplay.innerText = `$$${coeffMatStr}` + ansVec.latex(4) + `=${constVecStr}$$`

      renderMathInElement(formulaDisplay, {
        delimiters: [
          { left: "$$", right: "$$", display: true }
        ]
      })
    }, 0)
  })

  reader.readAsArrayBuffer(file);
})

