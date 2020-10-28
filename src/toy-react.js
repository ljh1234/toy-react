const RENDER_TO_DOM = Symbol('render to dom')
class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    if(name.match(/^on([\s\S]+)$/)) {
      this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
    }else {
      if(name === 'className') {
        this.root.setAttribute('class', value)
      } else {
        this.root.setAttribute(name, value)
      }
      
    }
  }
  appendChild(component) {
    let range = document.createRange()
    range.setStart(this.root, this.root.childNodes.length);
    range.setEnd(this.root, this.root.childNodes.length);
    component[RENDER_TO_DOM](range)
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this.root)
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this.root)
  }
}

export class Component {
  constructor() {
    this.props = Object.create(null)
    this.children = []
    this._root = null
    this._range = null
  }
  setAttribute(name, value) {
    this.props[name] = value
  }
  appendChild(component) {
    this.children.push(component)
  }
  [RENDER_TO_DOM](range) {
    this._range = range
    this.render()[RENDER_TO_DOM](range)
  }
  rerender() {
    let oldRange = this._range
    let range = document.createRange()
    
    range.setStart(oldRange.startContainer, oldRange.startOffset)
    range.setEnd(oldRange.startContainer, oldRange.startOffset)
    this[RENDER_TO_DOM](range)

    oldRange.setStart(range.endContainer, range.endOffset)
    this._range.deleteContents()
  }
  setState(newState) {
    if(this.state === null || typeof this.state !== 'object') {
        this.state = newState
        this.rerender()
        return  
    }
    let merge = (oldState, newState) => {
      for (const k in newState) {
        if(oldState[k] === null || oldState[k] !== 'object') {
          oldState[k] = newState[k]
        } else {
          merge(oldState[k], newState[k])
        }
      }
    }
    merge(this.state, newState)
    this.rerender()
  }
  // get root() {
  //   if(!this._root) {
  //     this._root = this.render().root
  //   }
  //   return this._root
  // }
}

export function createElement(type, attributes, ...children) {
  let el 
  if(typeof type === 'string') {
    el = new ElementWrapper(type)
  } else {
    el = new type
  }
  
  for (const p in attributes) {
    if (attributes.hasOwnProperty(p)) {
      const element = attributes[p];
      el.setAttribute(p, element)
    }
  }
  console.log('children', children)
  const insertChild = (children) => {
    for (const child of children) {
      console.log('child', child)
      if(typeof child === 'string') {
        child = new TextWrapper(child)
      }
      if(typeof child === null) {
        continue
      }
      if((typeof child === 'object') && (child instanceof Array)) {
        insertChild(child)
      } else {
        el.appendChild(child)
      }
      
    }
  }
  insertChild(children)
  return el
}

export function render(component, parentElement) {
  let range = document.createRange()
  range.setStart(parentElement, 0);
  range.setEnd(parentElement, parentElement.childNodes.length);
  range.deleteContents()
  component[RENDER_TO_DOM](range)
}