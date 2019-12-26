const gameWindow = document.getElementById('game_window')
const nextArea = document.getElementById('next_block')
const coloum = 12;
const row = 25;
const size = 30;
let speed = Number(0.1);
let pause = false;
let current = null;
let done = false;
let count = 0;
let center = Math.floor((coloum - 1) / 2)

let checkBoard = [];

for(let i = 0; i <= row; i ++) {
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

document.addEventListener('keydown',toMoveBlock)


function toMoveBlock(e){
  console.log(e.code)
}

function makeBlock(x, y, style, gameWindow) {
  this.x = x;
  this.y = y;
  this.style = style;
  this.element = makeSpan(x,y,style)
  gameWindow.appendChild(this.element);
}

makeBlock.prototype.moveTo = function(x, y) {
  let x1 = +x.toFixed(12);
  let y1 = +y.toFixed(12);
  this.x = x1;
  this.y = y1;
  this.element.style['left'] = (x1 * size) + 'px';
  this.element.style['top'] = (y1 * size) + 'px';
}

function makeSpan(x, y, style) {
  let span = document.createElement('span');
  span.className = 'block_span ' + style;
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
    let y = temp.y + speed

    if(y >= 0 && checkBoard[Math.floor(y)][temp.x]){
      console.log('over')
      return clearInterval(interval)
    }

    temp.moveTo(temp.x, y)
  }
}

function stop(current) {
  for(let i = 0; i < current.length; i ++) {
    current[i].element.style['visibility'] = current[i].y < 0 ?  'hidden' : 'visible'
    if(current[i].y >= row - 1 || checkBoard[current[i].y + 2] && checkBoard[current[i].y + 2][current[i].x]) {
      pause = true;
      break;
    }
  }

  if(pause) {
    for(let j = 0; j < current.length; j ++) {
      if(checkBoard[current[j].y + 1]) checkBoard[current[j].y + 1][current[j].x] = current[j]
    }
    regenerateBlock()
    pause = false;
  }
}

function regenerateBlock() {
  let blocks = [createBar, createL, createS, createZ, createㄱ, createㅁ, createㅗ]
  let random = Math.floor(Math.random() * Math.floor(7))

  for(let i = 0; i < coloum; i ++) {
    if(checkBoard[0][i]) {
      done = true;
      console.log('over')
      console.log(checkBoard)
      clearInterval(interval)
      return;
    }
  }
  current = blocks[random](center,gameWindow)
  // for(let i = 0; i < current.length; i ++) {
  //   if(current.y >= 0 && checkBoard[current[i].y][current[i].x]){
  //     console.log('over')
  //     done = true;
  //   }
  // }
  return current
}

// define blocks
function createBar(x, area) {
  return [
    new makeBlock(x, -4, 'bar', area),
    new makeBlock(x, -3, 'bar', area),
    new makeBlock(x, -2, 'bar', area),
    new makeBlock(x, -1, 'bar', area),   
  ]
}

function createㄱ(x, area) {
  return [
    new makeBlock(x - 1, -3, 'ㄱ', area),
    new makeBlock(x, -3, 'ㄱ', area),
    new makeBlock(x, -2, 'ㄱ', area),
    new makeBlock(x, -1, 'ㄱ', area),   
  ]
}

function createL(x, area) {
  return [
    new makeBlock(x, -3, 'L', area),
    new makeBlock(x, -2, 'L', area),
    new makeBlock(x, -1, 'L', area),
    new makeBlock(x - 1, -1, 'L', area),   
  ]
}

function createZ(x, area) {
  return [
    new makeBlock(x - 1, -2, 'z', area),
    new makeBlock(x, -2, 'z', area),
    new makeBlock(x, -1, 'z', area),
    new makeBlock(x + 1, -1, 'z', area),   
  ]
}

function createS(x, area) {
  return [
    new makeBlock(x + 1, -2, 's', area),
    new makeBlock(x, -2, 's', area),
    new makeBlock(x, -1, 's', area),
    new makeBlock(x - 1, -1, 's', area),   
  ]
}

function createㅁ(x, area) {
  return [
    new makeBlock(x, -1, 'ㅁ', area),
    new makeBlock(x + 1, -1, 'ㅁ', area),
    new makeBlock(x + 1, -2, 'ㅁ', area),
    new makeBlock(x, -2, 'ㅁ', area),   
  ]
}

function createㅗ(x, area) {
  return [
    new makeBlock(x, -2, 'ㅗ', area),
    new makeBlock(x - 1, -1, 'ㅗ', area),
    new makeBlock(x, -1, 'ㅗ', area),
    new makeBlock(x + 1, -1, 'ㅗ', area),
  ]
}

regenerateBlock()
function operate() {
  stop(current)
  !done && !pause && goDown(current)
}
let interval = setInterval(operate, 10)