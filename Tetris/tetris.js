const gameWindow = document.getElementById('game_window')
const nextArea = document.getElementById('next_block')
const coloum = 12;
const row = 25;
const size = 30;
let speed = Number(0.1)

let checkBoard = [];

for(let i = 0; i < row; i ++) {
  checkBoard.push([])
  for(let j = 0; j < coloum; j ++) {
    checkBoard[i][j] = false;
  }
}

for(let i = 0; i < row; i ++) {
  for(let j = 0; j < coloum; j ++) {
    let span = document.createElement('span')
    span.className='grid'
    span.style['left'] = (size * j) + 'px'
    span.style['top'] = (size * i) + 'px'
    gameWindow.appendChild(span)
  }
}


function makeBlock(x, y, style, gameWindow) {
  this.x = x;
  this.y = y;
  this.style = style;
  this.element = makeSpan(x,y,style)
  gameWindow.appendChild(this.element);
}

makeBlock.prototype.moveTo = function(x, y){
  this.x = x;
  this.y = y;
  this.element.style['left'] = (x * size) + 'px';
  this.element.style['top'] = (y * size) + 'px';
}



function makeSpan(x, y, style) {
  const span = document.createElement('span');
  span.className = 'block_span ' + style;

  span.style['position'] = 'absolute';
  span.style['display'] = 'block';
  span.style['top'] = (y * size) + 'px';
  span.style['left'] = (x * size) + 'px';
  span.style['width'] = size + 'px';
  span.style['height'] = size + 'px';

  return span;
}

function move(dx, dy) {
  for (let i in current) {
      let block = current[i];
      block.moveTo(block.x + dx, block.y + dy);
  }
}


function goDown(current) {
  for(let i = 0; i < current.length; i ++) {
    let temp = current[i]
    temp.moveTo(temp.x, temp.y + speed)
  }
}


// define blocks
function createBar(x, area) {
  return [
    new makeBlock(x, 0, 'bar', area),
    new makeBlock(x, 1, 'bar', area),
    new makeBlock(x, 2, 'bar', area),
    new makeBlock(x, 3, 'bar', area),   
  ]
}

function createㄱ(x, area) {
  return [
    new makeBlock(x - 1, 0, 'ㄱ', area),
    new makeBlock(x, 0, 'ㄱ', area),
    new makeBlock(x, 1, 'ㄱ', area),
    new makeBlock(x, 2, 'ㄱ', area),   
  ]
}

function createL(x, area) {
  return [
    new makeBlock(x, 0, 'L', area),
    new makeBlock(x, 1, 'L', area),
    new makeBlock(x, 2, 'L', area),
    new makeBlock(x - 1, 2, 'L', area),   
  ]
}

function createZ(x, area) {
  return [
    new makeBlock(x - 1, 0, 'z', area),
    new makeBlock(x, 0, 'z', area),
    new makeBlock(x, 1, 'z', area),
    new makeBlock(x + 1, 1, 'z', area),   
  ]
}

function createS(x, area) {
  return [
    new makeBlock(x + 1, 0, 's', area),
    new makeBlock(x, 0, 's', area),
    new makeBlock(x, 1, 's', area),
    new makeBlock(x - 1, 1, 's', area),   
  ]
}

function createㅁ(x, area) {
  return [
    new makeBlock(x, 0, 'ㅁ', area),
    new makeBlock(x + 1, 0, 'ㅁ', area),
    new makeBlock(x + 1, 1, 'ㅁ', area),
    new makeBlock(x, 1, 'ㅁ', area),   
  ]
}

const test = createBar(0, gameWindow)
createㄱ(2, gameWindow)
createL(4, gameWindow)
createZ(6, gameWindow)
createS(8, gameWindow)
createㅁ(10, gameWindow)

// test[0].moveTo(2,12);
// test[1].moveTo(3,13);
// test[2].moveTo(7,9);
// test[3].moveTo(8,9);

// test.forEach( a => checkBoard[a.y][a.x] = a)


// checkBoard.forEach((a, row) => a.forsEach(b => {
//   if(row === 12) {
//     console.log('run', b)
//     b && (
//       b.element.remove(),
//       b = false
//     )
//   }
    
// } ))

// setInterval(() => goDown(test), 10)