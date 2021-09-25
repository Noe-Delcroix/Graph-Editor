/*todo

- default name for nodes
- implement the search/path algorithms

*/


var graph

function disableRightClickContextMenu(element) {
	element.addEventListener('contextmenu', function(e) {
		if (e.button == 2) {
			e.preventDefault();
		}
	});
}

function setup() {
  let canvas=createCanvas(windowWidth, windowHeight)
  disableRightClickContextMenu(canvas.elt)
  graph=new Graph()
}

function draw() {
  translate(width/2,height/2)
	background(50)

  graph.update()
  graph.render()
}
