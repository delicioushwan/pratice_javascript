const gameWindow = document.getElementById('game_window')
const nextArea = document.getElementById('next_block')
const coloum = 12;
const row = 25;
const size = 30;
let speed = Number(1);
let pause = false;
let current = null;
let count = 0;
let center = Math.floor((coloum - 1) / 2)
let onMove = false;
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


function toMoveBlock(e) {
  onMove = true;
  switch (e.code) {
    case 'ArrowLeft':
      move(-1, 0)
      break;
    case 'ArrowRight':
      move(1, 0)
      break;
    case 'ArrowUp':
      rotate()
      break;
    default:
      console.log('nothing')
      break;
  }

}

function makeBlock(x, y, style, gameWindow) {
  this.x = x;
  this.y = y;
  this.style = style;
  this.element = makeSpan(x,y,style)
  gameWindow.appendChild(this.element);
}

makeBlock.prototype.moveTo = function(x, y) {
  // console.log('moveTo')
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
  // console.log('move')
  let wall = false;
  for (let i in current) {
    if (Math.floor(current[i].y + 1) < 0) {
      wall = true;
    } else if(current[i].x + dx < 0 || current[i].x + dx > coloum - 1) {
      wall = true;
    } else if(checkBoard[Math.floor(current[i].y + 1)][current[i].x + 1] || checkBoard[Math.floor(current[i].y + 1)][current[i].x - 1]) {
      wall = true;
    }
  }
  if (!wall) {
    // console.log('moving')
    for (let i in current) {
      let x = current[i].x + dx
      let y = current[i].y + dy
      current[i].moveTo(x, y);
    }
  }
}


function rotate() {
  // console.log('rotate')
  if(current[0].style === 'ㅁ') return;

  function changeLoc(current, i) {
    let center = current[1];
    let x = current[i].x - center.x;
    let y = center.y - current[i].y;
    let temp = x;
    x = y + center.x;
    y = temp + center.y;
    return [x,y]
  }

  let wall = false;
  for(let i in current) {
    const [x, y] = changeLoc(current, i);
    if (y + 1 < 0 || y > row - 1) {
      wall = true;
      return;
    } else if(x < 0 || x > coloum - 1) {
      wall = true;
      return;
    } else if(checkBoard[y + 1] && checkBoard[y + 1][x]) {
      wall = true;
      return;
    } 
  }
  if (!wall) {
    console.log('moving')
    for (let i in current) {
      const [x, y] = changeLoc(current, i);
      current[i].moveTo(x, y);
    }
  }
}

function goDown(block) {
  // console.log('goDown')
  let blocked = false;
  for(let i in current) {
    let x = current[i].x;
    let y = Math.floor(current[i].y + speed);
    if(x < 0 || x > coloum - 1) {
      blocked = true;
      return;
    } else if(checkBoard[y + 1] && checkBoard[y + 1][x]) {
      blocked = true;
      return;
    } else if(y > row - 1) {
      blocked = true;
      return;
    }
  }

  if(!blocked) {
    for(let i = 0; i < block.length; i ++) {
      let temp = block[i]
      let y = Math.floor(current[i].y + speed)
      let x = temp.x
      temp.element.style['visibility'] = y < 0 ?  'hidden' : 'visible'
      temp.moveTo(x, y)
    }
  }
}

function place(current) {
  // console.log('plcae')
  let place = false;
  for(let i = 0; i < current.length; i ++) {
    if(current[i].y >= row - 1 || checkBoard[current[i].y + 2] && checkBoard[current[i].y + 2][current[i].x]) {
      place = true;
      break;
    }
  }

  if(place) {
    for(let j = 0; j < current.length; j ++) {
      let block = current[j]
      if(checkBoard[block.y + 1]) checkBoard[block.y + 1][block.x] = block
    }
    removeBlock(current);
    regenerateBlock();
    pause = false;
    console.log(checkBoard)
  }
}

function removeBlock(current) {
  console.log('removeBlock=====')
  let row = [];
  for(let i in checkBoard) {
    let exist = true;
    for(let j in checkBoard[i]) {
      if(!checkBoard[i][j]) {
        exist = false
        break;
      }
    }
    if(exist) {
      row.push(i)
    }
  }
  if(row.length) {
    console.log('rowrow', row)
    console.log('exist rows')
    row.forEach(r => {
      for(let i = 0; i < r; i ++) {
        for(let j = 0; j < coloum; j ++) {
          if(checkBoard[i][j]) {
            let y = checkBoard[i][j].y + 1
            let x = checkBoard[i][j].x
            checkBoard[i][j].moveTo(x,y)
          }
        }
      }
    })

    row.forEach(r => {
      for(let col in checkBoard[r]) {
        checkBoard[r][col].element.remove();
      }
    })

    let oneRow = []
    for(let j = 0; j < coloum; j ++) {
      oneRow.push(false);
    }
  
    row.forEach(r => {
      checkBoard.splice(r,1)
      checkBoard.splice(0,0,oneRow)
    })
  }
}

function regenerateBlock() {
  console.log('regeneration')
  let blocks = [createBar, createL, createS, createZ, createㄱ, createㅁ, createㅗ]
  let random = Math.floor(Math.random() * Math.floor(7))

  for(let i = 0; i < coloum; i ++) {
    if(checkBoard[0][i]) {
      clearInterval(interval)
      return;
    }
  }
  current = blocks[random](center,gameWindow)
  return current
}

// define blocks
function createBar(x, area) {
  return [
    new makeBlock(x, -6, 'bar', area),
    new makeBlock(x, -5, 'bar', area),
    new makeBlock(x, -4, 'bar', area),
    new makeBlock(x, -3, 'bar', area),   
  ]
}

function createㄱ(x, area) {
  return [
    new makeBlock(x - 1, -5, 'ㄱ', area),
    new makeBlock(x, -5, 'ㄱ', area),
    new makeBlock(x, -4, 'ㄱ', area),
    new makeBlock(x, -3, 'ㄱ', area),   
  ]
}

function createL(x, area) {
  return [
    new makeBlock(x - 1, -3, 'L', area),   
    new makeBlock(x, -3, 'L', area),
    new makeBlock(x, -4, 'L', area),
    new makeBlock(x, -5, 'L', area),
  ]
}

function createZ(x, area) {
  return [
    new makeBlock(x - 1, -4, 'z', area),
    new makeBlock(x, -4, 'z', area),
    new makeBlock(x, -3, 'z', area),
    new makeBlock(x + 1, -3, 'z', area),   
  ]
}

function createS(x, area) {
  return [
    new makeBlock(x + 1, -4, 's', area),
    new makeBlock(x, -4, 's', area),
    new makeBlock(x, -3, 's', area),
    new makeBlock(x - 1, -3, 's', area),   
  ]
}

function createㅁ(x, area) {
  return [
    new makeBlock(x, -4, 'ㅁ', area),
    new makeBlock(x + 1, -4, 'ㅁ', area),
    new makeBlock(x + 1, -3, 'ㅁ', area),
    new makeBlock(x, -3, 'ㅁ', area),   
  ]
}

function createㅗ(x, area) {
  return [
    new makeBlock(x, -4, 'ㅗ', area),
    new makeBlock(x, -3, 'ㅗ', area),
    new makeBlock(x - 1, -3, 'ㅗ', area),
    new makeBlock(x + 1, -3, 'ㅗ', area),
  ]
}
regenerateBlock()
// removeBlock()
function operate() {
  count++
  // if(count === 3) {
  //   clearInterval(interval)
  // }
  if(count % 10 === 0) {
    // console.log('before')
    !onMove && goDown(current)
    !onMove && place(current)
    onMove = false  
    // console.log('after')
  }
}

let interval = setInterval(operate, 10)
