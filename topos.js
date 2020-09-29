let mainCircle;
let r = 300;
let angle = 0;
let step = (2 * Math.PI) / 12;
let autoplay = false;
let osc;
let input, button, greeting;
let tris = [];
const scale = {
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

function Networks(triad) {
  this.triad = triad;
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
  this.fifths = {
    C: 0,
    G: 1,
    D: 2,
    A: 3,
    E: 4,
    B: 5,
    "F#": 6,
    "C#": 7,
    "G#": 8,
    "D#": 9,
    "A#": 10,
    F: 11,
  };
  this.history = [];
  this.dissonance = [0, 7, 3, 4, 8, 9];

  this.monotransform = function (u, v) {
    let triadIndexes = this.triad.map(
      (note) => (Object.keys(this.scale).indexOf(note) * u + v) % 12
    );

    this.triad = triadIndexes.map((index) =>
      Object.keys(this.scale).find((key) => this.scale[key] === index)
    );

    this.history.push(this.triad);
    return this;
  };

  this.zRelation = function () {
    let triadIndexes = this.triad.map(
      (note) => Object.keys(this.scale).indexOf(note) % 12
    );
    console.log(triadIndexes);
    zindex = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
    };
    for (note of triadIndexes) {
      for (item of triadIndexes) {
        let diff;
        if (Math.sign(note - item) === -1) {
          console.log(12 + note - item);
          diff = 12 + note - item;
        } else {
          console.log(note - item);
          diff = note - item;
        }
        zindex[String(diff)] += 1;
      }
    }
    console.log(zindex);
  };
}

Networks.prototype.getInterval = function (a, b) {
  const self = this;

  const startIndex = Object.keys(self.scale).indexOf(self.a);
  const finIndex = Object.keys(self.scale).indexOf(self.b);

  if (self.dissonance.includes(Math.abs(startIndex - finIndex) % 12) === true) {
    return `${a} -> ${b} is dissonant`;
  } else {
    return `${a} -> ${b} is consonant`;
  }
};

const networkNode = new Networks(["C", "C#", "D#", "G"]);
networkNode.zRelation();

let circleNotes = [];

function getChords() {
  let chords = input.value();
  let shapeNum = 1;
  for (note of circleNotes) {
    note.shapeNum = [];
  }
  if (chords.indexOf("(") === -1) {
    //console.log(chords.split(","))
    input.value("");
    chords = chords.split(",");
    let trimChords = chords.map((item) => {
      return String(item).trim().toUpperCase();
    });
    console.log(trimChords);

    trimChords.map((item) => {
      console.log(Object.keys(scale).indexOf(item));
      for (note of circleNotes) {
        if (note.note === Object.keys(scale).indexOf(item)) {
          note.changeColor(shapeNum);
        }
        //   console.log(note.note)
      }
    });
    let argsArr = [];
    for (note of circleNotes) {
      if (note.shapeNum[0] === shapeNum) {
        argsArr.push({ x: note.x, y: note.y });
      }
    }

    console.log(argsArr);
    const trig = new TriShape(argsArr);
    tris.push(trig);
  } else {
    chords = chords.trim().split(")");
    console.log(chords);
    let trimChords = [];
    for (chord of chords) {
      let trimmed = chord.replace("(", "").split(",");
      if (trimmed.length === 3) {
        let cleanChords = trimmed.map((item) => {
          return String(item).trim().toUpperCase();
        });
        trimChords.push(cleanChords);
      }
    }

    console.log(trimChords);
    for (trimChord of trimChords) {
      trimChord.map((item) => {
        console.log(Object.keys(scale).indexOf(item));
        for (note of circleNotes) {
          if (note.note === Object.keys(scale).indexOf(item)) {
            note.changeColor(shapeNum);
          }
          //   console.log(note.note)
        }
      });
      shapeNum++;
    }

    let argsArr = [];
    for (note of circleNotes) {
      if (note.shapeNum.length > 0) {
        for (occur of note.shapeNum) {
          argsArr.push({ x: note.x, y: note.y, num: occur });
        }
      }
    }

    console.log(argsArr);
    let divided = groupBy(argsArr, "num");
    console.log(divided);

    for (divideKey of Object.keys(divided)) {
      const trig = new TriShape(divided[divideKey]);
      tris.push(trig);
    }
    //const trig = new TriShape(argsArr)
    //tris.push(trig)
  }
}

function groupBy(arr, property) {
  return arr.reduce(function (memo, x) {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  createCircle(windowWidth / 2, windowHeight / 2);
  let div = createDiv("Enter chord with commas");
  div.id("instructions");
  input = createInput();
  input.parent("instructions");

  button = createButton("submit");
  button.parent("instructions");

  button.mousePressed(getChords);

  textAlign(CENTER);

  osc = new p5.TriOsc();

  osc.start();
  osc.amp(0);
}

function createCircle(x, y) {
  mainCircle = new MainCircle(x, y);
  console.log(mainCircle);

  console.log("Circled Created");
  let initNote = 0;
  while (angle < Math.PI * 2) {
    var x1 = x - r * sin(angle);
    var y1 = y - r * cos(angle);
    console.log(x1, y1);

    //draw ellipse at every1 x1,y point
    //ellipse(x1, y1, 30);
    const noteSphere = new Node(x1, y1, initNote);
    circleNotes.push(noteSphere);
    initNote++;

    //increase angle by step size
    angle = angle + step;
  }
}

class MainCircle {
  constructor(x, y, radius = r) {
    this.y = y;
    this.x = x;
    this.radius = radius;
  }
  show() {
    circle(this.x, this.y, this.radius);
  }

  revert() {
    this.color = color(255, 100);
  }
}

function draw() {
  mainCircle.show();

  for (tr of tris) {
    tr.show();
  }

  for (circ of circleNotes) {
    circ.show();
  }
}

class Node {
  constructor(x, y, note) {
    this.x = x;
    this.y = y;
    this.note = note;
    this.active = false;
    this.shapeNum = [];
    this.edges = [];
    this.color = color(255, 100);
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
    stroke(0);
    strokeWeight(1);
    fill(this.color);
    ellipse(this.x, this.y, 30, 30);
    const letterNote = Object.keys(this.scale).find(
      (key) => this.scale[key] === this.note
    );
    text(`${letterNote}`, this.x, this.y);
  }
  changeColor(shapeNum) {
    this.color = color(255, 0, 200);
    this.active = true;
    this.shapeNum.push(shapeNum);
  }

  revert() {
    this.color = color(255, 100);
    this.active = false;
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

function mousePressed() {
  for (note of circleNotes) {
    if (dist(mouseX, mouseY, note.x, note.y) < 12) {
      note.playNote(200);

      for (item of circleNotes) {
        if (item.note === note.note) {
          console.log(item);
          item.playNote(200);
        }
      }
    }
  }
}

class TriShape {
  constructor(argsArr) {
    this.argsArr = argsArr;
    this.color = color(255, 0, 200);
  }
  show() {
    beginShape();
    for (const vert of this.argsArr) {
      vertex(vert.x, vert.y);
    }
    console.log;

    endShape(CLOSE);
  }

  revert() {
    this.color = color(255, 100);
  }
}
