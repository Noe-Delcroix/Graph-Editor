const nodeRenderSize=0.5
const nodeTextSize=0.5

class Node{
  constructor(graph,x,y,name){
    this.graph=graph
    this.pos=createVector(x,y)
    this.parameters=new Gui(width-205,10,"Node Settings",{
      outerMarge: 5,
      innerMarge: 5,
      elementMarge: 15,
      draggable:false
    })
    this.parameters.createInput("name",name)
    this.parameters.createColorPicker("color",color(100))
    this.parameters.createButton("delete",deleteSelected)
    this.parameters.hide()

    this.parameters.setStyle(color(255,100),color(220,100),color(0))
  }
  render(){
    push()
    let pos=this.graph.wts(this.pos.x,this.pos.y)
    translate(pos.x,pos.y)
    if (this.isSelected()){
      strokeWeight(0.02*this.graph.zoom)
      stroke(0,255,255)
    }else{
      noStroke()
    }
    let c=this.parameters.getValue("color")
    fill(c)
    circle(0,0,nodeRenderSize*this.graph.zoom)

    if (brightness(c)>50){
      fill(0)
    }else{
      fill(255)
    }
    noStroke()
    textAlign(CENTER,CENTER)
    textSize(nodeRenderSize*this.graph.zoom*nodeTextSize)
    text(this.parameters.getValue("name"),0,0)
    pop()
  }

  edgesGoingOut(){
    let list=[]
    for (let e of this.graph.edges){
      if (e.from==this || (e.to==this && !this.graph.parameters.getValue("oriented"))){
        list.push(e)
      }
    }
    return list
  }

  edgesGoingIn(){
    let list=[]
    for (let e of this.graph.edges){
      if (e.to==this || (e.from==this && !this.graph.parameters.getValue("oriented"))){
        list.push(e)
      }
    }
    return list
  }

  update(){
    if (this.isSelected() && mouseIsPressed && mouseButton==LEFT && this.graph.clickCondition()){
      let pos=this.graph.stw(mouseX-width/2,mouseY-height/2)
      if (this.graph.parameters.getValue("snap to grid")==true){
        let gridSnapSize=this.graph.parameters.getValue("grid size")
        pos.x=round(pos.x/gridSnapSize)*gridSnapSize
        pos.y=round(pos.y/gridSnapSize)*gridSnapSize
      }
      this.pos=pos
    }
    this.parameters.run()
  }

  isSelected(){
    return this.graph.selected==this
  }

  delete(){
    this.del=true
    for (let e of this.edgesGoingOut()){
      e.delete()
    }
    for (let e of this.edgesGoingIn()){
      e.delete()
    }
  }

  mouseOver(){
    let mousePos=this.graph.stw(mouseX-width/2,mouseY-height/2)
    return mousePos.dist(this.pos)*2<nodeRenderSize
  }
}
