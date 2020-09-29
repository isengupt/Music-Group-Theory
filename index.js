
function MusicGroup(start) {
  this.start = start;
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
  this.natural = [0, 2, 4, 5, 7, 9, 11];
}

MusicGroup.prototype.getScale = function () {
  const self = this;

  const startIndex = Object.keys(self.scale).indexOf(self.start);
  console.log(startIndex);
  return self.natural.map((index) => (index + startIndex) % 12);
};





var Symmetries = function (motive, pitch) {
  this.motive = motive;
  this.pitch = pitch;
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
  //var natural = [0,2,4,5,7,9,11]

  this.inversion = function () {
    const inversionValue = (Object.keys(scale).indexOf(pitch) * 2) % 12;
    const invertedIndexes = this.motive.map(
      (note) => 12 + (inversionValue - Object.keys(scale).indexOf(note))
    );

    this.motive = invertedIndexes.map((index) =>
      Object.keys(scale).find((key) => scale[key] === index)
    );
    return this;
  };
  this.retrograde = function () {
    const indexes = this.motive.map((note) => Object.keys(scale).indexOf(note));

    this.motive = indexes
      .reverse()
      .map((index) => Object.keys(scale).find((key) => scale[key] === index));
    return this;
  };
};


var CounterPoint = function (
  { interval: [x1, x2], direction: direction },
  operator
) {
  this.base = x1;
  this.length = x2;
  this.direction = direction;
  this.operator = operator;
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

  this.endpoint = function () {
    if (this.direction == "descending") {
      const value = this.base - this.length;

      if (value === 0) {
        return Object.keys(scale).find((key) => scale[key] === value);
      } else if (Math.sign(value) === -1) {
    
        return Object.keys(scale).find(
          (key) => scale[key] === 12 + (value % 12)
        );
      } else {
        return Object.keys(scale).find((key) => scale[key] === value % 12);
      }
    } else if (this.direction == "ascending") {
      return Object.keys(scale).find((key) => scale[key] === ((this.base + this.length) % 12));
    }
  };

  this.operate = function () {
     const y1 = this.operator[0] * this.base 

     const y2 =  (this.operator[1] * this.base) + (this.length * this.operator[0])
     return {interval: [getIndex(y1), getIndex(y2)], direction: flipDirection(this.direction) }
};
}

function flipDirection(direction) {
    if (direction == "ascending") {
        return "descending"
    }
    else if (direction == "descending") {
        return "ascending"
    }
}

function checkSign(value, scale) {

    if (value === 0) {
        return Object.keys(scale).find((key) => scale[key] === value);
      } else if (Math.sign(value) === -1) {
    
        return Object.keys(scale).find(
          (key) => scale[key] === 12 + (value % 12)
        );
      } else {
        return Object.keys(scale).find((key) => scale[key] === value % 12);
      }
}

function getIndex(value) {
    if (value === 0) {
        return value
      } else if (Math.sign(value) === -1) {
    
        return 12 + (value % 12)

      } else {
        return value % 12;
      }
}


var symmetry = new Symmetries(['A','G','F','E','G'], 'G')
console.log(symmetry.retrograde())
var counterPoint = new CounterPoint({ interval: [2,7], direction: "ascending"}, [-1,2])

console.log(counterPoint.operate())