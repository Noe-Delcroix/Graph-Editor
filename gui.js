/*
  Gui library made by Iguana
  Based on p5.js
  Version 1.0.1
*/

class Gui {
  constructor(x, y, label,options) {
    this.elements = []
    this.pos = createVector(x, y)
    this.rect = createDiv('')
    this.rect.style('z-index', 1)
    if (typeof label == 'string') {
      this.createTitle(label, 0)
    } else {
      this.createTitle('Gui (by Iguana)', 0)
    }
    this.setStyle(color(0), color(15), color(0, 255, 0))

    this.isShown = true
    this.isDragged = false

    if (options==undefined){
      this.options = {
        outerMarge: 10,
        innerMarge: 5,
        elementMarge: 15,
        draggable:true
      }
    }else{
      this.options=options
    }


  }

  setStyle(bgColor, subColor, textColor) {
    this.style = [bgColor, subColor, textColor]

  }

  lastElt() {
    return this.elements[this.elements.length - 1]
  }

  createTitle(label, marge, weight='bold') {
    this.elements.push(createDiv(label))
    this.lastElt().marge = marge
    this.lastElt().style('font-weight', weight)
    this.lastElt().label = label
    this.lastElt().txt = null
    this.lastElt().type = 'title'
    this.lastElt().rect = createDiv('')
  }

  createSlider(label, min, max, value, range, func) {
    this.elements.push(createSlider(min, max, value, range))
    this.lastElt().label = label
    this.lastElt().txt = createDiv(label + ':')
    this.lastElt().type = 'slider'
    this.lastElt().rect = createDiv('')

    if (typeof func == 'function') {
      this.lastElt().changed(func)
    }

  }

  createCheckbox(label, value, func) {
    this.elements.push(createCheckbox(label, value))
    this.lastElt().label = label
    this.lastElt().txt = null
    this.lastElt().type = 'checkbox'
    this.lastElt().rect = createDiv('')

    if (typeof func == 'function') {
      this.lastElt().changed(func)
    }
  }

  createInput(label, value, func) {
    this.elements.push(createInput(value))
    this.lastElt().label = label
    this.lastElt().txt = createDiv(label + ' : ')
    this.lastElt().type = 'input'
    this.lastElt().rect = createDiv('')

    if (typeof func == 'function') {
      this.lastElt().input(func)
    }
  }

  createColorPicker(label, color, func) {
    this.elements.push(createColorPicker(color))
    this.lastElt().label = label
    this.lastElt().txt = createDiv(label + ' : ')
    this.lastElt().type = 'colorpicker'
    this.lastElt().rect = createDiv('')

    if (typeof func == 'function') {
      this.lastElt().input(func)
    }
  }

  createButton(label, func) {
    this.elements.push(createButton(label))
    this.lastElt().label = label
    this.lastElt().txt = null
    this.lastElt().type = 'button'
    this.lastElt().rect = createDiv('')

    if (typeof func == 'function') {
      this.lastElt().mousePressed(func)
    }
  }
  createSelect(label, options, selected, func) {
    this.elements.push(createSelect())
    for (let o of options) {
      this.lastElt().option(o)
    }
    this.lastElt().selected(selected)
    this.lastElt().label = label
    this.lastElt().txt = createDiv(label + ' : ')
    this.lastElt().type = 'select'
    this.lastElt().rect = createDiv('')

    if (typeof func == 'function') {
      this.lastElt().changed(func)
    }
  }

  getElement(labelOrIndex) {
    if (typeof labelOrIndex == 'string') {
      for (let i=0;i<this.elements.length;i++) {
        if (this.elements[i].label == labelOrIndex) {
          return [this.elements[i],i]
        }
      }
    } else if (typeof labelOrIndex == 'number' && labelOrIndex < this.elements.length) {
      return [this.elements[floor(labelOrIndex)],floor(labelOrIndex)]
    }
    console.warn("Could not access element " + labelOrIndex + " of your Gui")
    return [undefined,undefined]
  }

  removeElement(labelOrIndex) {
    let elt=this.getElement(labelOrIndex)[0]
    let index=this.getElement(labelOrIndex)[1]

    if (elt!=undefined){
      elt.remove()
      elt.rect.remove()
      if (elt.txt){
        elt.txt.remove()
      }

      this.elements.splice(index,1)
    }
  }

  getValue(labelOrIndex) {
    let elt = this.getElement(labelOrIndex)[0]
    if (elt != undefined) {
      if (['slider', 'input', 'select'].includes(elt.type)) {
        return elt.value()
      }
      if (elt.type == 'colorpicker') {
        return elt.color()
      }
      if (elt.type == 'checkbox') {
        return elt.checked()
      }
    }
  }

  setValue(labelOrIndex, value) {
    let elt = this.getElement(labelOrIndex)[0]
    let index = this.getElement(labelOrIndex)[1]
    if (elt != undefined) {
      if (['slider', 'input', 'select'].includes(elt.type) && (typeof value == 'number' || typeof value == 'string')) {
        elt.value(value)
      } else if (elt.type == 'colorpicker' && value instanceof p5.Color) {

        let temp=elt

        this.elements[index]=createColorPicker(value)

        this.elements[index].label = temp.label
        this.elements[index].txt = createDiv(temp.label + ' : ')
        this.elements[index].type = 'colorpicker'
        this.elements[index].rect = createDiv('')


        elt.rect.remove()
        if (elt.txt){
          elt.txt.remove()
        }
        elt.remove()


      } else if (elt.type == 'checkbox' && typeof value == 'boolean') {
        elt.checked(value)
      } else if (['title', 'button'].includes(elt.type)) {
        elt.html(value)
      }
    }
  }

  setFunction(labelOrIndex, func) {
    let elt = this.getElement(labelOrIndex)[0]
    if (elt != undefined && typeof func == 'function') {
      if (['slider', 'checkbox', 'select'].includes(elt.type)) {
        elt.changed(func)
      } else if (['colorpicker', 'input'].includes(elt.type)) {
        elt.input(func)
      } else if (elt.type == 'button') {
        elt.mousePressed(func)
      }
    }
  }

  position(x, y) {
    this.pos = createVector(x, y)
  }

  show() {
    this.isShown = true
    this.rect.show()
    for (let e of this.elements) {
      e.show()
      e.rect.show()
      if (e.txt) {
        e.txt.show()
      }
    }
  }
  hide() {
    this.isShown = false
    this.rect.hide()
    for (let e of this.elements) {
      e.hide()
      e.rect.hide()
      if (e.txt) {
        e.txt.hide()
      }
    }
  }
  remove(){
    for (let i=this.elements.length-1;i>=0;i--){
      this.removeElement(i)
    }
    this.rect.remove()
  }

  run() {
    this.updateDOM()
    this.updateDOMtext()
  }

  canBeDragged(){
    let outerMarge = this.options.outerMarge
    let innerMarge = this.options.innerMarge
    return this.elements.length>0 && (mouseX>this.pos.x - outerMarge) && mouseX<(this.pos.x - outerMarge)+(this.getSize().x + outerMarge * 2) && mouseY>(this.pos.y - outerMarge - innerMarge) && mouseY<(this.pos.y - outerMarge - innerMarge)+(this.elements[0].height+innerMarge*2+outerMarge)
  }

  updateDOM() {
    let outerMarge = this.options.outerMarge
    let innerMarge = this.options.innerMarge

    if (this.options.draggable && this.canBeDragged()){
      if (mouseIsPressed && this.isDragged==false){
        this.isDragged=true
      }
    }

    if (this.isDragged){
      this.pos.add(createVector(mouseX-pmouseX,mouseY-pmouseY))
      if (!mouseIsPressed){
        this.isDragged=false
      }
    }

    this.rect.position(this.pos.x - outerMarge, this.pos.y - outerMarge - innerMarge)
    this.rect.style('width', (this.getSize().x + outerMarge * 2) + 'px')
    this.rect.style('height', (this.getSize().y + outerMarge * 2 + innerMarge * 2) + 'px')

    this.rect.style('background', this.style[0])

    let sz = this.getSize()
    let marge = this.options.elementMarge
    let y = this.pos.y
    for (let i = 0; i < this.elements.length; i++) {
      let elt = this.elements[i]
      if (elt.marge) {
        y += elt.marge
      }
      let txtHeight = 0
      if (elt.txt) {
        txtHeight = elt.txt.height
      }
      elt.style('z-index', 3)
      if (!['button', 'input', 'select'].includes(elt.type)) {
        elt.style('color', this.style[2])
      }
      elt.rect.position(this.pos.x, y - innerMarge)
      elt.rect.style('width', sz.x + 'px')
      elt.rect.style('height', elt.height + txtHeight + innerMarge * 2 + 'px')
      elt.rect.style('background', this.style[1])
      elt.rect.style('z-index', 2)

      if (elt.txt) {
        elt.txt.position(this.pos.x, y)
        elt.txt.style('color', this.style[2])
        elt.txt.style('z-index', 3)
        y += elt.txt.height
      }

      elt.position(this.pos.x, y)
      y += elt.height
      y += marge
    }
  }

  updateDOMtext() {
    for (let i = 0; i < this.elements.length; i++) {
      let elt = this.elements[i]

      if (elt.type == 'slider') {
        elt.txt.html(elt.label + ' : ' + elt.value())
      }
    }
  }


  getSize() {
    let sz = createVector(200, 0)
    for (let i = 0; i < this.elements.length; i++) {
      let elt = this.elements[i]
      if (elt.marge) {
        sz.y += elt.marge
      }
      if (elt.txt) {
        sz.y += elt.txt.height
      }
      sz.y += elt.height
      if (i != this.elements.length - 1) {
        sz.y += this.options.elementMarge
      }
    }
    return sz
  }
}
