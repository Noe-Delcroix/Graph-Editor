const edgeThickness=0.03
const edgeTextSize=0.3

class Edge{
  constructor(graph,from,to,value){
    this.graph=graph
    this.from=from
    this.to=to

    this.parameters=new Gui(width-205,10,"Edge Settings",{
      outerMarge: 5,
      innerMarge: 5,
      elementMarge: 15,
      draggable:false
    })
    this.parameters.createInput("value","")
    this.parameters.createButton("switch orientation",switchOrientationSelected)
    this.parameters.createButton("delete",deleteSelected)
    this.parameters.setStyle(color(255,100),color(220,100),color(0))
    this.parameters.hide()
  }

  update(){
    this.parameters.run()
  }

  render(){
    if (this.isSelected()){
      stroke(0,255,255)
    }else{
      stroke(200)
    }

    strokeWeight(this.graph.zoom*nodeRenderSize*edgeThickness)

    let from=this.getPoints()[0]
    let to=this.getPoints()[1]
    let dir=p5.Vector.sub(from,to).normalize()

    line(from.x,from.y,to.x,to.y)

    if (this.graph.parameters.getValue("oriented")==true){
      if (this.isSelected()){
        fill(0,255,255)
      }else{
        fill(200)
      }
      noStroke()

      let arrowSz=0.1

      let pos1=to.copy()
      let pos2=p5.Vector.add(pos1,dir.copy().mult(this.graph.zoom*arrowSz)).add(dir.copy().rotate(-PI/2).mult(this.graph.zoom*arrowSz/2))
      let pos3=p5.Vector.add(pos1,dir.copy().mult(this.graph.zoom*arrowSz)).add(dir.copy().rotate(PI/2).mult(this.graph.zoom*arrowSz/2))
      triangle(pos1.x,pos1.y,pos2.x,pos2.y,pos3.x,pos3.y)
    }

    if (this.getValue(true)!=null){
      fill(255)
      stroke(50)
      strokeWeight(this.graph.zoom*nodeRenderSize*edgeThickness)
      textSize(this.graph.zoom*nodeRenderSize*edgeTextSize)
      textAlign(CENTER,CENTER)
      text(this.getValue(),(from.x+to.x)/2,(from.y+to.y)/2)
    }
  }

  getValue(returnNull=false){
    let val=parseFloat(this.parameters.getValue("value"))
    if (isNaN(val)){
      if (returnNull){
        return null
      }else{
        return 0
      }
    }
    return val
  }

  delete(){
    this.del=true
  }

  switchOrientation(){
    let temp=this.to
    this.to=this.from
    this.from=temp

    for (let e of this.graph.edges){
      if (e!=this && e.to==this.to && e.from==this.from){
        temp=e.to
        e.to=e.from
        e.from=temp
      }
    }
  }

  getPoints(){
    let from=this.from.graph.wts(this.from.pos.x,this.from.pos.y)
    let to=this.to.graph.wts(this.to.pos.x,this.to.pos.y)
    let dir=p5.Vector.sub(from,to).normalize()
    from.sub(dir.copy().mult(nodeRenderSize*this.graph.zoom/2))
    to.add(dir.copy().mult(nodeRenderSize*this.graph.zoom/2))

    if (this.needsOffset()){
      let offset=0.1
      from.add(dir.copy().rotate(PI/2).mult(this.graph.zoom*offset))
      to.add(dir.copy().rotate(PI/2).mult(this.graph.zoom*offset))
    }
    return [from,to]
  }

  needsOffset(){
    if (this.graph.parameters.getValue("oriented")){
      for (let e of this.graph.edges){
        if (e.to==this.from && this.to==e.from){
          return true
        }
      }
    }
    return false
  }

  isAllowed(){
    for (let e of this.graph.edges){
      if (e!=this){
        if (this.graph.parameters.getValue("oriented") && (e.to==this.to && e.from==this.from)){
          return false
        }
        if (!this.graph.parameters.getValue("oriented") && ((e.to==this.to && e.from==this.from) || (e.to==this.from && e.from==this.to) )){
          return false
        }
      }
    }
    return true
  }

  isSelected(){
    return this.graph.selected==this
  }

  mouseOver(){
    let A = (mouseX-width/2) - this.getPoints()[0].x;
    let B = (mouseY-height/2) - this.getPoints()[0].y;
    let C = this.getPoints()[1].x - this.getPoints()[0].x;
    let D = this.getPoints()[1].y - this.getPoints()[0].y;

    let dot = A * C + B * D;
    let len_sq = C * C + D * D;
    let param = -1;
    if (len_sq != 0) //in case of 0 length line
      param = dot / len_sq;

    var xx, yy;

    if (param < 0) {
      xx = this.getPoints()[0].x;
      yy = this.getPoints()[0].y;
    } else if (param > 1) {
      xx = this.getPoints()[1].x;
      yy = this.getPoints()[1].y;
    } else {
      xx = this.getPoints()[0].x + param * C;
      yy = this.getPoints()[0].y + param * D;
    }

    let dx = (mouseX-width/2) - xx;
    let dy = (mouseY-height/2) - yy;
    let dist=Math.sqrt(dx * dx + dy * dy);
    return dist<10
  }
}

function switchOrientationSelected(){
  graph.selected.switchOrientation()
}
