class Caret {
  readonly #dom: HTMLDivElement
  #interval: number = -1

  constructor(dom: HTMLDivElement) {
    dom.style.display = 'inherit'
    dom.style.width = '2px'
    dom.style.backgroundColor = 'black'
    dom.style.position = 'absolute'
    this.#dom = dom
    this.#resetInterval()
  }

  setHeight(height: number) {
    this.#dom.style.height = height + 'px'
  }

  setOffset({left, top}: { left: number; top: number }) {
    this.#dom.style.left = (left - 1) + 'px'
    this.#dom.style.top = top + 'px'
    this.#dom.style.visibility = ''
    this.#resetInterval()
  }

  #resetInterval() {
    if (this.#interval >= 0) clearInterval(this.#interval)
    this.#interval = setInterval(() => {
      this.#dom.style.visibility = this.#dom.style.visibility ? '' : 'hidden'
    }, 550)
  }
}

const caret = new Caret(document.body.appendChild(document.createElement('div')))
document.body.addEventListener('click', () => {
  const selection = getSelection()!
  if (selection.type === 'Caret') {
    selection.anchorNode?.textContent?.at(selection.anchorOffset)
    caret.setOffset(getCaretTopPoint())
    caret.setHeight(16)
  }
})
const content = document.getElementById('content')!
content.textContent = '一段测试文字，含有word，数字123一段测试文字，含有word，数字123一段测试文字，含有word，数字123一段测试文字，含有word，数字123一段测试文字，含有word，数字123'

function getCaretTopPoint(): { left: number, top: number } {
  const r = document.getSelection()!.getRangeAt(0)
  const node = r.startContainer as Element
  const offset = r.startOffset
  if (offset > 0) {
    const range = document.createRange()
    range.setStart(node, (offset - 1))
    range.setEnd(node, offset)
    const rect = range.getBoundingClientRect()
    return {left: rect.right, top: rect.top}
  } else if (offset < (node as unknown as Text).length) {
    const range = document.createRange()
    range.setStart(node, offset)
    range.setEnd(node, (offset + 1))
    const {left, top} = range.getBoundingClientRect()
    return {left, top}
  } else {
    const rect = node.getBoundingClientRect()
    const styles = getComputedStyle(node)
    return {left: rect.left, top: rect.top + (parseInt(styles.lineHeight) - parseInt(styles.fontSize)) / 2}
  }
}

export {}
