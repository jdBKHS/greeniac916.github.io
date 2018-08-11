let points = [3776, 9371, 19740, 9371, 13656, 9371];
let nodes = [];
let scaleFactor = 0.175;
let minScaleFactor = 0.175;
let allowHiddenNodes = true;
let transX = 0;
let transY = 0;
let img;

function preload() {
  img = loadImage("map.png");
  data = loadJSON("points.json");
}

function setup() {
  createCanvas(img.width * scaleFactor, img.height * scaleFactor);
  noCursor();
  for (let key of Object.keys(data)) {
    nodes[key] = new Node(data[key]);
  }
  // nodes[0] = new Node("FNC", 3776, 9371, true);
  // nodes[1] = new Node("Connection\nHub", 13656, 9371, true);
  // nodes[2] = new Node("Bosco\n& Maoyi\nJunction", 19740, 9371, false);
  // nodes[0].addConnection(nodes[1], "W");
  // nodes[1].addConnection(nodes[2], "E");
  // for (let i = 0; i < points.length; i += 2) {
  //   let x = convertX(points[i]);
  //   let y = convertY(points[i + 1]);
  //   let x2 = convertX(points[i + 2]);
  //   let y2 = convertY(points[i + 3]);
  //   if(points[i + 3]) {
  //     stroke("#0039A6");
  //     strokeWeight(10);
  //     line(x, y, x2, y2);
  //   }
  //   fill(0);
  //   noStroke();
  //   ellipse(x, y, 50, 50);
  // }
}

function draw() {
  background(255);
  push();
  translate(transX, transY);
  scale(scaleFactor);
  image(img, 0, 0);
  for (let node of nodes) {
    node.drawLines();
  }
  for (let node of nodes) {
    node.drawNodes();
  }
  for (let node of nodes) {
    node.drawText();
  }
  pop();
  let coords = round((mouseX / scaleFactor + 381.399) * 4) + " " + round((mouseY / scaleFactor - 24.213) * 4);
  textSize(12);
  textAlign(CENTER, CENTER);
  text(coords, width * 0.5, textAscent());
  noFill();
  stroke(0);
  strokeWeight(1);
  ellipse(mouseX, mouseY, 5);
}

class Node {

  constructor(obj) {
    this.name = obj.name;
    this.connections = obj.connections.slice();
    this.connectionTypes = obj.connectionTypes.slice();
    this.pos = createVector(convertX(obj.x), convertY(obj.y));
    this.size = obj.maj ? 75 : 50;
    this.hide = obj.hide;
  }

  drawLines() {
    for (let i = 0; i < this.connections.length; i++) {
      switch (this.connectionTypes[i]) {
        case "W":
          stroke("#EE352E");
          strokeWeight(15);
          break;
        case "E":
          stroke("#FCCC0A");
          strokeWeight(15);
          break;
        case "I":
          stroke("#0039A6");
          strokeWeight(15);
          break;
        case "N":
          stroke("#00933C");
          strokeWeight(15);
          break;
      }
      line(this.pos.x, this.pos.y, nodes[this.connections[i]].pos.x, nodes[this.connections[i]].pos.y);
    }
  }
  drawNodes() {
    if (this.hide && allowHiddenNodes) return;
    fill(0);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  drawText() {
    if (this.hide && allowHiddenNodes) return;
    if (abs(mouseX / scaleFactor - this.pos.x) < this.size * 0.5 && abs(mouseY / scaleFactor - this.pos.y) < this.size * 0.5) {
      textSize(100);
      textAlign(CENTER, CENTER);
      noStroke();
      fill(0);
      let rectSize = longest(this.name);
      rect(this.pos.x, this.pos.y, rectSize[0], rectSize[1], 50);
      fill(255);
      text(this.name, this.pos.x, this.pos.y);
    }
  }

  addConnection(node, type) {
    this.connections.push(node);
    this.connectionTypes.push(type);
  }

}

//split \n longest word function

function longest(str) {
  rectMode(CENTER);
  words = str.split("\n");
  let longestSize = 0
  for (let word of words) {
    if (longestSize < textWidth(word)) {
      longestSize = textWidth(word);
    }
  }
  let height = 2 * textAscent() * max(words.length - 1, 0.5);
  return [longestSize + 50, height + 50];
}

//convert MC coords to canvas

function convertX(p) {
  return 0.2504 * p - 381.399
}

function convertY(p) {
  return 0.2551 * p + 24.213
}
//
// function mouseWheel(e) {
//   let mouseXP = mouseX / scaleFactor;
//   let mouseYP = mouseY / scaleFactor;
//   if (e.delta < 0) {
//     scaleFactor *= 1.1;
//   } else {
//     scaleFactor /= 1.1;
//   }
//   scaleFactor = constrain(scaleFactor, 0.175, 0.5);
// }
