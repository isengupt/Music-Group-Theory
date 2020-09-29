
const SPACING = 200






function permute(permutation) {
  var length = permutation.length,
      result = [permutation.slice()],
      c = new Array(length).fill(0),
      i = 1, k, p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
}


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

  this.invert = function() {
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

  this.augment = function() {
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
      triadIndexes[0] = (triadIndexes[0] - 1) % 12;

      if (Math.sign(triadIndexes[0]) === -1) {
        triadIndexes[0] = 12 + triadIndexes[0];
      }
     // var lastIndex = triadIndexes.shift();
     // triadIndexes.push(lastIndex);
    } else if (difference === 4) {
      triadIndexes[triadIndexes.length-1] = (triadIndexes[triadIndexes.length-1] + 1) % 12;
      //var firstIndex = triadIndexes.pop();
     // triadIndexes.unshift(firstIndex);
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
      triadIndexes[triadIndexes.length-1] = (triadIndexes[triadIndexes.length-1] + 2) % 12;
      var firstIndex = triadIndexes.pop();
      triadIndexes.unshift(firstIndex);
    }
    this.triad = triadIndexes.map((index) =>
      Object.keys(scale).find((key) => scale[key] === index)
    );
    this.history.push(this.triad);
    return this;
  };

  this.getVariations = function() {
    let triadIndexes = this.triad.map((note) =>
    Object.keys(scale).indexOf(note)
  );
  let firstVariation = [triadIndexes[0], triadIndexes[1], (triadIndexes[2] + 1) % 12]
  var firstIndex = firstVariation.pop();
  firstVariation.unshift(firstIndex);
  let secondVariation = [(triadIndexes[0] + 1) % 12 , triadIndexes[1], triadIndexes[2]]
  let thirdVariation = [triadIndexes[0], (triadIndexes[1] + 1) % 12, triadIndexes[2]]
  var lastIndex = thirdVariation.shift();
  thirdVariation.push(lastIndex);
  let fourthVariation = [triadIndexes[0], triadIndexes[1], (triadIndexes[2] - 1) % 12]
  let fifthVariation = [(triadIndexes[0] -1) % 12, triadIndexes[1], triadIndexes[2]]
  var lastIndex = fifthVariation.shift();
  fifthVariation.push(lastIndex);
  let sixthVariation = [triadIndexes[0], (triadIndexes[1] -1) % 12, triadIndexes[2]]
  var firstIndex = sixthVariation.pop();
  sixthVariation.unshift(firstIndex);

  for ( variation of [firstVariation, secondVariation, thirdVariation, fourthVariation, fifthVariation, sixthVariation]) {
    variation.forEach(function(part, index, theArray) {
      if (Math.sign(variation[index]) === -1) {
        theArray[index] = 12 + theArray[index];
      }

     theArray[index] =  Object.keys(scale).find((key) => scale[key] === theArray[index])
     
    });
    
  }

  return [{branch: "left", triads: [{branch: "top", triad: new Triads(firstVariation)}, {branch: "middle", triad: new Triads(secondVariation)}, {branch: "bottom", triad:  new Triads(thirdVariation)}]}, {branch: "right", triads: [{branch: "top", triad: new Triads(fourthVariation)}, {branch: "middle", triad: new Triads(fifthVariation)}, {branch: "bottom", triad:  new Triads(sixthVariation)}]}]





   //var firstIndex = triadIndexes.pop();
     // triadIndexes.unshift(firstIndex);
    

  }

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



var ninthSymphony = new Triads(["C", "E", "G"])

let variations = ninthSymphony.augment().getVariations()
for (branch of variations) {

   //console.log(branch['branch'])
  for (tri of branch['triads']) {
    let index = 1
   // console.log(tri['branch'])
   // console.log(tri['triad'].triad)
    let parallelCheck = tri['triad'].parallel().triad
    let leadingCheck = tri['triad'].parallel().leading().triad
    

  if (index & 2 !== 0) {
    tri['firstChild'] = [{first: new Triads(parallelCheck), second: new Triads(leadingCheck)}]
   // console.log([parallelCheck, leadingCheck ])
    const augmentLeft = new Triads(parallelCheck).augment().triad
    const augmentRight = new Triads(leadingCheck).augment().triad
    tri['secondChild'] = [{first: new Triads(augmentRight), second: new Triads(augmentLeft)}]

    //console.log([augmentLeft, augmentRight])
    //console.log([parallelCheck, leadingCheck ])
    index ++
  } else {
    tri['firstChild'] = [{first: new Triads(leadingCheck), second: new Triads(parallelCheck)}]
   // console.log([leadingCheck, parallelCheck ])
    const augmentLeft = new Triads(parallelCheck).augment().triad
    const augmentRight = new Triads(leadingCheck).augment().triad
    tri['secondChild'] = [{first: new Triads(augmentRight), second: new Triads(augmentLeft)}]
    //console.log([augmentLeft, augmentRight])
  
    index++
  }
  }
 
}



function getCheckPoint(variations) {
let checkpoints = [];
for (points of variations) {
 for (arr of points) {
let parallelCheck = arr.parallel().triad
let leadingCheck = arr.parallel().leading().triad
checkpoints.push([new Triads(parallelCheck), new Triads(leadingCheck)])
 }
}
return checkpoints
}


let lineFields = []

//checkpoints = getCheckPoint(variations)
//for (check of checkpoints) {
//  for (tri of check) {
//    console.log(tri.triad)
//  }
//}
//console.log(checkpoints)
//for (check of checkpoints) {
//  let newTriad = new Triads(check)
//  console.log(check.augment().triad)
//}
console.log(variations)

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  createLines(windowWidth/2, windowHeight/2)

}


function createLines(x, y) {
  console.log(x,y)
  lineFields.push(new LineShape(0,0,0,100,100,0));
  lineFields.push(new LineShape(0,0,0,100,100, 100));
  lineFields.push(new LineShape(0,0,0,100,0, 0));
  lineFields.push(new LineShape(0,0,0,100,0, 100));
  lineFields.push(new LineShape(100,0,0,100,0, 100));
  lineFields.push(new LineShape(100,100,100,100,0, 100));
  lineFields.push(new LineShape(100,100,100,100,100, 0));
  lineFields.push(new LineShape(100,100,0,100,0, 0));

}

class LineShape {
  constructor(x1, y1,z1, x2, y2,z2) {
    this.x1 = x1
    this.y1 = y1
    this.z1= z1
    this.x2 = x2
    this.y2 = y2
    this.z2 = z2
  }
  show() {

    line( this.x1,this.y1,this.z1,this.x2,this.y2, this.z2) 
  }

  revert() {
    this.color = color(255, 100);
  }
}




function draw() {

  background(220);
  rotateY(frameCount * 0.01);
  //rotateX(frameCount * 0.01);

  noFill();
  stroke(0);
  box(30, 20, 10)
 for (lin of lineFields) {
 
   lin.show()

 }

  

}



function mousePressed() {
 console.log('pressed')
}

