let SPACING = 100;
let nodes = [];
let coordinates = [];
let count = 0;
let sel;
let chordTransformer;
let hist;
let transButton;
let scale = {
    C: 0,
    "C#": 1,
    D: 2,
    "D#": 3,
    E: 4,
    F: 5,
    "F#": 6,
    G: 7,
    "G#": 8,
    A: 9,
    "A#": 10,
    B: 11,
  };
let autoplay = false;
let osc;
let edges = [];
var synth = new Tone.PolySynth(4, Tone.Synth).toMaster()
let noteIndex = 0;
var eventIndex = 0;
let tris = []
let radio;


var Triads = function (triad) {
  this.triad = triad;
  this.history = [];
  var scale = {
    C: 0,
    "C#": 1,
    D: 2,
    "D#": 3,
    E: 4,
    F: 5,
    "F#": 6,
    G: 7,
    "G#": 8,
    A: 9,
    "A#": 10,
    B: 11,
  };

  this.transpose = function (shift) {
    this.triad = this.triad.map(
      (note) => (Object.keys(scale).indexOf(note) + shift) % 12
    );
    return this;
  };

  this.invert = function () {
    this.triad = this.triad.map(
      (note) => (12 - Object.keys(scale).indexOf(note)) % 12
    );
    return this;
  };

  this.parallel = function () {
    let triadIndexes = this.triad.map((note) =>
      Object.keys(scale).indexOf(note)
    );
    let difference = 0;
    if (Math.sign(triadIndexes[1] - triadIndexes[0]) === -1) {
      console.log(triadIndexes[1] - triadIndexes[0]);
      difference = 12 + (triadIndexes[1] - triadIndexes[0]);
    } else {
      difference = triadIndexes[1] - triadIndexes[0];
    }
    if (difference === 4) {
      triadIndexes[1] = (triadIndexes[1] - 1) % 12;

      if (Math.sign(triadIndexes[1]) === -1) {
        triadIndexes[1] = 12 + triadIndexes[1];
      }
    } else if (difference === 3) {
      triadIndexes[1] = (triadIndexes[1] + 1) % 12;
    }
    this.triad = triadIndexes.map((index) =>
      Object.keys(scale).find((key) => scale[key] === index)
    );
    this.history.push(this.triad);
    return this;
  };
  this.leading = function () {
    let triadIndexes = this.triad.map((note) =>
      Object.keys(scale).indexOf(note)
    );
    let difference = 0;
    if (Math.sign(triadIndexes[1] - triadIndexes[0]) === -1) {
      difference = 12 + (triadIndexes[1] - triadIndexes[0]);
    } else {
      difference = triadIndexes[1] - triadIndexes[0];
    }
    if (difference === 4) {
      triadIndexes[0] = (triadIndexes[0] - 1) % 12;

      if (Math.sign(triadIndexes[0]) === -1) {
        triadIndexes[0] = 12 + triadIndexes[0];
      }
      var lastIndex = triadIndexes.shift();
      triadIndexes.push(lastIndex);
    } else if (difference === 3) {
      triadIndexes[2] = (triadIndexes[2] + 1) % 12;
      var firstIndex = triadIndexes.pop();

      triadIndexes.unshift(firstIndex);
    }
    this.triad = triadIndexes.map((index) =>
      Object.keys(scale).find((key) => scale[key] === index)
    );
    this.history.push(this.triad);
    return this;
  };

  this.relative = function () {
    let triadIndexes = this.triad.map((note) =>
      Object.keys(scale).indexOf(note)
    );
    let difference = 0;
    if (Math.sign(triadIndexes[1] - triadIndexes[0]) === -1) {
      difference = 12 + (triadIndexes[1] - triadIndexes[0]);
    } else {
      difference = triadIndexes[1] - triadIndexes[0];
    }
    if (difference === 3) {
      triadIndexes[0] = (triadIndexes[0] - 2) % 12;

      if (Math.sign(triadIndexes[0]) === -1) {
        triadIndexes[0] = 12 + triadIndexes[0];
      }
      var lastIndex = triadIndexes.shift();
      triadIndexes.push(lastIndex);
    } else if (difference === 4) {
      triadIndexes[triadIndexes.length - 1] =
        (triadIndexes[triadIndexes.length - 1] + 2) % 12;
      var firstIndex = triadIndexes.pop();
      triadIndexes.unshift(firstIndex);
    }
    this.triad = triadIndexes.map((index) =>
      Object.keys(scale).find((key) => scale[key] === index)
    );
    this.history.push(this.triad);
    return this;
  };

  this.utt = function ({
    mode: mode,
    majInterval: majInterval,
    minInterval: minInterval,
  }) {
    let triadIndexes = this.triad.map((note) =>
      Object.keys(scale).indexOf(note)
    );
    let difference = 0;
    if (Math.sign(triadIndexes[1] - triadIndexes[0]) === -1) {
      difference = 12 + (triadIndexes[1] - triadIndexes[0]);
    } else {
      difference = triadIndexes[1] - triadIndexes[0];
    }
    if (difference === 4 && mode == "+") {
      const newIndexes = [
        (triadIndexes[0] + majInterval) % 12,
        (triadIndexes[0] + majInterval + 4) % 12,
        (triadIndexes[0] + majInterval + 7) % 12,
      ];
      this.triad = newIndexes.map((index) =>
        Object.keys(scale).find((key) => scale[key] === index)
      );
      this.history.push(this.triad);
      return this;
    }
    if (difference === 4 && mode == "-") {
      const newIndexes = [
        (triadIndexes[0] + majInterval) % 12,
        (triadIndexes[0] + majInterval + 3) % 12,
        (triadIndexes[0] + majInterval + 7) % 12,
      ];
      this.triad = newIndexes.map((index) =>
        Object.keys(scale).find((key) => scale[key] === index)
      );
      this.history.push(this.triad);
      return this;
    }

    if (difference === 3 && mode == "+") {
      const newIndexes = [
        (triadIndexes[0] + minInterval) % 12,
        (triadIndexes[0] + minInterval + 3) % 12,
        (triadIndexes[0] + minInterval + 7) % 12,
      ];
      this.triad = newIndexes.map((index) =>
        Object.keys(scale).find((key) => scale[key] === index)
      );
      this.history.push(this.triad);
      return this;
    }
    if (difference === 3 && mode == "-") {
      const newIndexes = [
        (triadIndexes[0] + minInterval) % 12,
        (triadIndexes[0] + minInterval + 4) % 12,
        (triadIndexes[0] + minInterval + 7) % 12,
      ];
      this.triad = newIndexes.map((index) =>
        Object.keys(scale).find((key) => scale[key] === index)
      );

      this.history.push(this.triad);
      return this;
    }
  };
};

var ninthSymphony = new Triads(["C", "E", "G"]);
//console.log(ninthSymphony.relative().leading().parallel().relative().leading().parallel().history)
let song = ninthSymphony
  .relative()
  .leading()
  .parallel()
  .relative()
  .leading()
  .parallel().history;

console.log(song);

let midiSong = [];
let timer = 0; 
song.map((chord) => {
  let keys = []
   chord.map((sound) => {
   keys.push(`${sound}3`)
   })
   midiSong.push([`0:${timer}`, keys])
   timer+=2;


})

var pianoPart = new Tone.Part(function(time, chord) {

  for (note of nodes) {
    note.revert()
  }
  for (tf of tris) {
    console.log(tf)
    tf.revert()
  }
  

  synth.triggerAttackRelease(chord, "2n", time);
 for (note of nodes) {
 
   if (chord.includes(`${Object.keys(scale).find((key) => scale[key] === note.note)}3`)) {
    // console.log(note)
     note.changeColor()

   }


  
 }
 for (note of nodes) {
   if (note.active) {
     let points = []
     points.push({x: note.x, y: note.y})
     note.edges.map((position) => {
      for (item of nodes) {
        if (item.x === position.x2 && item.y === position.y2 && item.active) {
          points.push({x: item.x, y: item.y})
        }
      }
    }

     )
     //console.log(points)
     if (points.length === 3) {
       const tr = new TriShape(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y)
       console.log(tr)

       tris.push(tr)
      //stroke(255);
      //strokeWeight(1);
      //fill(color(255, 0, 200));
      //triangle(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y)
     }
    
   }
  
 } 

}, midiSong).start();



//pianoPart.loop = false;
//pianoPart.loopEnd = "4m";

console.log(midiSong)

function genLattice(x, y, initialNote = 0) {
  if (x > windowWidth || y > windowHeight || x < 0 || y < 0) {
    return;
  } else {
    coordinates.push({ x: x, y: y });
    const note = new Node(x, y, initialNote);

    

    const west = { x: x - SPACING, y: y, initialNote: (initialNote + 5) % 12 };
    const westLine = { x1: x, y1: y, x2: west.x, y2: west.y };
    const east = { x: x + SPACING, y: y, initialNote: (initialNote + 7) % 12 };
    const eastLine = { x1: x, y1: y, x2: east.x, y2: east.y };
    const northEast = {
      x: x + SPACING / 2,
      y: y + (3 ** 0.5 * SPACING) / 2,
      initialNote: (initialNote + 4) % 12,
    };

    const northEastLine = { x1: x, y1: y, x2: northEast.x, y2: northEast.y };
    const northWest = {
      x: x - SPACING / 2,
      y: y + (3 ** 0.5 * SPACING) / 2,
      initialNote: (initialNote + 9) % 12,
    };
    const northWestLine = { x1: x, y1: y, x2: northWest.x, y2: northWest.y };
    const southWest = {
      x: x - SPACING / 2,
      y: y - (3 ** 0.5 * SPACING) / 2,
      initialNote: (initialNote + 8) % 12,
    };
    const southWestLine = { x1: x, y1: y, x2: southWest.x, y2: southWest.y };
    const southEast = {
      x: x + SPACING / 2,
      y: y - (3 ** 0.5 * SPACING) / 2,
      initialNote: (initialNote + 3) % 12,
    };
    const southEastLine = { x1: x, y1: y, x2: southEast.x, y2: southEast.y };
    for (coord of [
      eastLine,
      westLine,
      southEastLine,
      southWestLine,
      northWestLine,
      northEastLine,
    ]) {
      note.edges.push(coord)
      if (
        edges.some(
          (edge) =>
            edge.x1 === coord.x1 &&
            edge.x2 === coord.x2 &&
            edge.y1 === coord.y1 &&
            edge.y2 === coord.y2
        )
      ) {
        continue;
      } else {
        const newEdge = new Edge(coord.x1, coord.y1, coord.x2, coord.y2);
        edges.push(newEdge);
       
      }
    }
    nodes.push(note);
   // console.log(note)

    for (direction of [
      west,
      east,
      northEast,
      northWest,
      southEast,
      southWest,
    ]) {
      if (
        coordinates.some(
          (coordinate) =>
            coordinate.x === direction.x && coordinate.y === direction.y
        )
      ) {
        continue;
      } else {
        genLattice(direction.x, direction.y, direction.initialNote);
      }
    }
  }
}

function mousePressed() {
  for (note of nodes) {
    if (dist(mouseX, mouseY, note.x, note.y) < 12) {
      note.playNote(200);

      for (item of nodes) {
        if (item.note === note.note) {
          console.log(item);
          item.playNote(200);
        }
      }
    }
  }
}

function chooseChord() {
  let item = sel.value();
  console.log(item)

  for (note of nodes) {
    note.revert()
  }

  for (tr of tris) {
    tr.revert()
  }
  
  if (item == "CMaj") {
    chordTransformer = new Triads(['C', 'E', 'G'])
  } else if (item == "CMin") {
    chordTransformer = new Triads(['C', 'D#', 'G'])
  }
  console.log(chordTransformer.triad)
  chordTransformer.triad.map((item) => {
    console.log(Object.keys(scale).indexOf(item))
    for (note of nodes) {
      if (note.note === Object.keys(scale).indexOf(item)) {
        note.changeColor()
      }
   //   console.log(note.note)
    }
  })

  for (note of nodes) {
    if (note.active) {
      let points = []
      points.push({x: note.x, y: note.y})
      note.edges.map((position) => {
       for (item of nodes) {
         if (item.x === position.x2 && item.y === position.y2 && item.active) {
           points.push({x: item.x, y: item.y})
         }
       }
     }
 
      )
      //console.log(points)
      if (points.length === 3) {
        const tr = new TriShape(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y)
        console.log(tr)
 
        tris.push(tr)
       //stroke(255);
       //strokeWeight(1);
       //fill(color(255, 0, 200));
       //triangle(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y)
      }
     
    }
   
  }
  console.log(chordTransformer)
  //background(200);
  //text('It is a ' + item + '!', 50, 50);
}

function evaluateNotes()  {

  for (note of nodes) {
    note.revert()
  }

  for (tr of tris) {
    tr.revert()
  }




  chordTransformer.triad.map((item) => {
    console.log(Object.keys(scale).indexOf(item))
    for (note of nodes) {
      if (note.note === Object.keys(scale).indexOf(item)) {
        note.changeColor()
      }
   //   console.log(note.note)
    }
  })

  for (note of nodes) {

    if (note.active) {
      let points = []
      points.push({x: note.x, y: note.y})
      note.edges.map((position) => {
       for (item of nodes) {
         if (item.x === position.x2 && item.y === position.y2 && item.active) {
           points.push({x: item.x, y: item.y})
         }
       }
     }
 
      )
      //console.log(points)
      if (points.length === 3) {
        const tr = new TriShape(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y)
        console.log(tr)
 
        tris.push(tr)
       //stroke(255);
       //strokeWeight(1);
       //fill(color(255, 0, 200));
       //triangle(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y)
      }
     
    }
   
  }
}

function printHistory() {
  let item = chordTransformer.history;
  console.log(item)
 
}

function changeChord() {
 
  console.log(transButton.value())
  if(chordTransformer) {
  if (transButton.value() == "leading") {
    chordTransformer.leading()
    console.log(chordTransformer.triad)
    evaluateNotes()
  } else if (transButton.value() == "parallel") {
    chordTransformer.parallel()
    console.log(chordTransformer.triad)
    evaluateNotes()
  }
  else if (transButton.value() == "relative") {
    chordTransformer.relative()
    console.log(chordTransformer.triad)
    evaluateNotes()
  }
}
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let div = createDiv("Choose chord");
  div.id("control");
  div.position(0,10)
  
  let button = createButton("Play Circle");
  button.parent("control");
  button.mousePressed(function () {
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    } else {
      for (note of nodes) {
        note.revert()
      }
      Tone.Transport.stop();
    }
  });

  sel = createSelect('Choose scale');
  sel.parent("control");
  sel.option('CMaj');
  sel.option('CMin');
  sel.changed(chooseChord);
  
  transButton = createSelect().id('radios');
  transButton.parent("control")
  transButton.option('parallel');
  transButton.option('leading');
  transButton.option('relative');
  transButton.selected('parallel');


  let trans = createButton('Transform');
  trans.parent("control");
  trans.mousePressed(changeChord);

  let printButton = createButton('Print History');
  printButton.parent("control");
  printButton.mousePressed(printHistory);


  
 
  // Trigger automatically playing

  osc = new p5.TriOsc();

  osc.start();
  osc.amp(0);



  genLattice(windowWidth / 2, windowHeight / 2);
}



function draw() {
  

  smooth();

  for (ed of edges) {
    ed.show();
  }
  for (tr of tris) {
    tr.show()
  }
  for (note of nodes) {
    note.show();
  }
  
}

function clearConnections() {
  while (coordinates.length > 0) {
    coordinates.pop();
  }
  while (nodes.length > 0) {
    nodes.pop();
  }
}

function touchStarted() {
  getAudioContext().resume();
}

class Node {
  constructor(x, y, note) {
    this.x = x;
    this.y = y;
    this.note = note;
    this.active = false
    this.edges = []
    this.color = color(255,100);
    this.scale = {
      C: 0,
      "C#": 1,
      D: 2,
      "D#": 3,
      E: 4,
      F: 5,
      "F#": 6,
      G: 7,
      "G#": 8,
      A: 9,
      "A#": 10,
      B: 11,
    };
  }

  show() {
    stroke(0).strokeCap(ROUND);
    fill(this.color)
    ellipse(this.x, this.y, 30, 30);
    const letterNote = Object.keys(this.scale).find(
      (key) => this.scale[key] === this.note
    );
    textAlign(CENTER);
    textSize(14);
    fill(0)
    .strokeWeight(0)
   
    textFont('Helvetica');
    text(`${letterNote}`, this.x, this.y+6);
  }
  changeColor() {
    this.color = color(255, 0, 200);
    this.active = true
  }

  revert() {
    this.color = color(255, 100);
    this.active = false
  }
  playNote(duration) {
    this.color = color(255, 0, 200);

    // print(midiToFreq(this.note + 60));
    //print(freqToMidi(midiToFreq(this.note + 60)));
    osc.freq(midiToFreq(this.note + 60));

    osc.fade(0.5, 0.2);

    if (duration) {
      const self = this;
      setTimeout(function () {
        osc.fade(0, 0.2);
        autoplay = false;
        self.color = color(255, 100);
      }, duration - 50);
    }
  }
}



class Edge {
  constructor(x1, y1, x2, y2) {
    this.y1 = y1;
    this.x1 = x1;
    this.y2 = y2;
    this.x2 = x2;
  }
  show() {
     stroke(0)

    line(this.x1, this.y1, this.x2, this.y2);
    stroke(0).strokeCap(ROUND);
  }
}

class TriShape {
  constructor(x1, y1, x2, y2, x3, y3) {
    this.y1 = y1;
    this.x1 = x1;
    this.y2 = y2;
    this.x2 = x2;
    this.x3 = x3;
    this.y3 = y3;
    this.color = color(255, 0, 200)
  }
  show() {
    stroke(0)
    fill(this.color);
    triangle(this.x1, this.y1, this.x2, this.y2,this.x3, this.y3)
  }

  revert() {
   this.color = color(255,100)
  }
}
