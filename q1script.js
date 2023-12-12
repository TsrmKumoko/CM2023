const depthArray = [341.96, 311.10, 315.74, 324.49, 321.14, 333.09, 318.68, 338.88, 325.66, 309.84, 328.62, 321.80, 320.74, 308.30, 328.45, 312.62, 317.83, 327.40, 323.75, 313.48, 316.66, 340.19, 332.40, 319.20, 334.64, 311.43, 328.92, 314.11, 319.84, 321.28, 333.84, 319.68, 321.20, 320.89, 325.90, 335.28, 332.00, 324.47, 313.36, 330.60, 322.32, 315.10, 319.89, 316.75, 321.92, 327.64, 320.40, 329.88, 332.00, 344.35, 348.41]

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
