class Graph{
  constructor(){
    this.nodes=[]
    this.edges=[]

    this.cam=createVector()
    this.zoom=200

    this.selected=null
    this.edgeStart=null

    this.parameters=new Gui(5,10,"Graph Global Settings",{
      outerMarge: 5,
      innerMarge: 5,
      elementMarge: 15,
      draggable:false
    })
    this.parameters.createCheckbox("oriented",true,deleteUnallowed)

    this.parameters.createTitle("Snapping Settings",20)
    this.parameters.createCheckbox("snap to grid",true)
    this.parameters.createSlider("grid size",0.1,2,0.5,0.1)

    this.parameters.createTitle("Controls :",20)
    this.parameters.createTitle("Left Click : Select/Move",0,'normal')
    this.parameters.createTitle("Double Click : New node",-5,'normal')
    this.parameters.createTitle("Right Click : New edge",-5,'normal')
    this.parameters.createTitle("Middle Click : Move camera",-5,'normal')

    this.parameters.createTitle("Scroll Wheel : Zoom in/out",-5,'normal')
    this.parameters.createTitle("Suppr : Delete selected",-5,'normal')


    this.parameters.show()
    this.parameters.setStyle(color(255,100),color(220,100),color(0))
  }
  update(){
    this.parameters.run()
    this.mouseControls()
  }

  render(){
    if (this.parameters.getValue("snap to grid")==true){
      this.drawGrid()
    }

    for (let i=this.edges.length-1;i>=0;i--){
      this.edges[i].update()
      this.edges[i].render()
      if (this.edges[i].del==true){
        this.edges[i].parameters.remove()
        this.edges.splice(i,1)
      }
    }

    for (let i=this.nodes.length-1;i>=0;i--){
      this.nodes[i].update()
      this.nodes[i].render()
      if (this.nodes[i].del==true){
        this.nodes[i].parameters.remove()
        this.nodes.splice(i,1)
      }
    }

    if (this.edgeStart!=null){
      stroke(200)
      strokeWeight(this.zoom*nodeRenderSize*edgeThickness)
      let pos1=this.wts(this.edgeStart.pos.x,this.edgeStart.pos.y)
      line(pos1.x,pos1.y,mouseX-width/2,mouseY-height/2)
    }
  }
  drawGrid(){
    stroke(255,10)
  	strokeWeight(this.zoom*0.02)
  	let topleft = this.stw(-width/2, -height/2)
  	let bottomright = this.stw(width/2, height/2)
    let pas=this.parameters.getValue("grid size")

  	for (let x = round(topleft.x/pas)*pas; x < round((bottomright.x+1)/pas)*pas; x+=pas) {
  		let posx=this.wts(x,0).x
  		line(posx,-height/2,posx,height/2)
  	}
  	for (let y = round(topleft.y/pas)*pas; y < round((bottomright.y+1)/pas)*pas; y+=pas) {
  		let posy=this.wts(0,y).y
  		line(-width/2,posy,width/2,posy)
  	}
  }

  recommandName(){
    let nameList=generateNameList(this.nodes.length+1,"abcdefghijklmnopqrstuvwxyz")
    for (let name of nameList){
      let free=true
      for (let n of this.nodes){
        if (n.parameters.getValue("name")==name){
          free=false
        }
      }
      if (free){
        return name
      }
    }
  }

  addNode(x,y,name){
    if (name==null){
      name=this.recommandName()
    }

    if (this.parameters.getValue("snap to grid")){
      let pas=this.parameters.getValue("grid size")
      this.nodes.push(new Node(this,round(x/pas)*pas,round(y/pas)*pas,name))
    }else{
      this.nodes.push(new Node(this,x,y,name))
    }
  }

  /*createEdge(from,to,value=null){
    let nodeFrom=this.findNodeByName(from)
    let nodeTo=this.findNodeByName(to)
    if (nodeFrom!=null && nodeTo!=null && nodeFrom!=nodeTo){
      this.edges.push(new Edge(this,nodeFrom,nodeTo,value))
    }
  }*/

  findNodeByName(name){
    for (let n of this.nodes){
      if (n.parameters.getValue("name")==name){return n}
    }
    return null
  }

  deleteUnallowedEdges(){
    for (let i=this.edges.length-1;i>=0;i--){
      if (!this.edges[i].isAllowed()){
        this.edges[i].parameters.remove()
        this.edges.splice(i,1)
      }
    }
  }

  stw(screenX, screenY) {
    return createVector(screenX / this.zoom + this.cam.x, screenY / this.zoom + this.cam.y)
  }

  wts(worldX, worldY) {
    return createVector((worldX - this.cam.x) * this.zoom, (worldY - this.cam.y) * this.zoom)
  }

  mouseControls(){
    if (mouseIsPressed && mouseButton==CENTER){
      this.cam.x+=(pmouseX-mouseX)/this.zoom
      this.cam.y+=(pmouseY-mouseY)/this.zoom
    }
  }

  mouseWheel(delta){
    let previous=this.stw(mouseX-width/2,mouseY-height/2);
  	if (delta.deltaY>0){
  		this.zoom*=0.8
  	}else{
  		this.zoom*=1.2
  	}
  	let next=this.stw(mouseX-width/2,mouseY-height/2);
  	this.cam.x += (previous.x - next.x)
    this.cam.y += (previous.y - next.y)
	}

  clickCondition(){

    return !(mouseX<this.parameters.getSize().x+this.parameters.options.outerMarge*2 && mouseY<this.parameters.getSize().y+this.parameters.options.outerMarge*4) &&
    (this.selected==null || !(mouseX>width-this.selected.parameters.getSize().x-this.selected.parameters.options.outerMarge*2 && mouseY<this.selected.parameters.getSize().y+this.selected.parameters.options.outerMarge*4))
  }

  mousePressed(){
    if (this.clickCondition()){
      if (mouseButton==LEFT){
        this.selected=null
        for (let e of this.edges){
          e.parameters.hide()
        }
        for (let e of this.edges){
          if (e.mouseOver()){
            this.selected=e
            e.parameters.show()
          }
        }
        for (let n of this.nodes){
          n.parameters.hide()
        }
        for (let n of this.nodes){
          if (n.mouseOver()){
            this.selected=n
            n.parameters.show()
          }
        }
      }else if (mouseButton==RIGHT){
        this.edgeStart=null
        for (let n of this.nodes){
          if (n.mouseOver()){
            this.edgeStart=n
          }
        }
      }
    }

  }

  mouseReleased(){
    if (this.edgeStart!=null){
      for (let n of this.nodes){
        if (n.mouseOver()){
          this.edges.push(new Edge(this,this.edgeStart,n,true,0))
          this.deleteUnallowedEdges()
        }
      }
    }
    this.edgeStart=null
  }
}

function deleteSelected(){
  if (graph.selected!=null){
    graph.selected.delete()
  }
}

function deleteUnallowed(){
  graph.deleteUnallowedEdges()
}

function doubleClicked(){
  if (graph.clickCondition()){
    let pos=graph.stw(mouseX-width/2,mouseY-height/2)
    graph.addNode(pos.x,pos.y)
  }
}

function mouseWheel(delta){
	graph.mouseWheel(delta);
}

function mousePressed(){
  graph.mousePressed()
}

function mouseReleased(){
  graph.mouseReleased()
}

function keyPressed(){
  if (keyCode==46){
    deleteSelected()
  }
}

function generateNameList(n,letters,newList=[""],list=[],start=0){
	for (let e of newList){
		for (let l of letters){
			list.push(e+l)
			if (list.length==n){
				if (start==0){
					return list
				}
				return
			}
		}
	}
	newList=list.slice(start,list.length)
	start+=newList.length
	list.concat(generateNameList(n,letters,newList,list,start))
	return list
}
