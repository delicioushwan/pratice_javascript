const gameWindow = document.getElementById('game_window')
const nextArea = document.getElementById('next_block')
const coloum = 12;
const row = 25;
const size = 30;
let speed = Number(1);
let pause = false;
let current = null;
let next = null;
let keep;
let count = 0;
let center = Math.floor((coloum - 1) / 2)
let onMove = false;
let checkBoard = [];
let nothing = false;
let interval;
let breakBlocks = false;

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
      goLeft(e)
      break;
    case 'ArrowRight':
      goRight(e)
      break;
    case 'ArrowUp':
      rotate(e)
      break;
    case 'ArrowDown':
    case 'Space':
      goToBottom(e);
      break;
    default:
      console.log('nothing', e.code)
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
  this.x = x;
  this.y = y;
  this.element.style['left'] = (x * size) + 'px';
  this.element.style['top'] = (y * size) + 'px';
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
  let wall = false;
  for (let i in current) {
    if(current[i].x + dx < 0 || current[i].x + dx > coloum - 1) {
      wall = true;
    } else if(current[i].y >= 0 && (checkBoard[current[i].y + 1 + dy][current[i].x + dx] || checkBoard[current[i].y + 1 + dy][current[i].x - dx])) {
      wall = true;
    }
  }
  if (!wall) {
    for (let i in current) {
      let x = current[i].x + dx
      let y = current[i].y + dy
      current[i].moveTo(x, y);
    }
  }
}

function goLeft(e) {
  e.preventDefault();
  move(-1, 0)
}

function goRight(e) {
  e.preventDefault();
  move(1, 0)
}


function rotate(e) {
  e.preventDefault();

  if(current[0].style === 'ㅁ') return;

  function changeLoc(current, i) {
    let center = current[1];
    let x = current[i].x - center.x;
    let y = center.y - current[i].y;
    let temp = x;
    x = y + center.x;
    y = temp + center.y;
    return [x, y]
  }

  let wall = false;
  for(let i in current) {
    const [x, y] = changeLoc(current, i);
    if (y < 0 || y > row - 1) {
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
    for (let i in current) {
      const [x, y] = changeLoc(current, i);
      current[i].moveTo(x, y);
    }
  }
}

function goToBottom(e) {
  e.preventDefault();

  let check = false;
  let dy = 0;

  while(!check) {
    dy ++
    for(let i in current) {
      let x = current[i].x;
      let y = current[i].y + dy;
    
      if(x < 0 || x > coloum - 1) {
        check = true;
      } else if(checkBoard[y + 1] && checkBoard[y + 1][x]) {
        check = true;
      } else if(y > row - 1) {
        check = true;
      }
    }
  }
  if(check) {
    move(0, dy - 1)
    return;
  }
}

function goDown(block) {
  let blocked = false;
  for(let i in current) {

    let x = current[i].x;
    let y = current[i].y + speed;
    current[i].element.style['visibility'] = y < 0 ?  'hidden' : 'visible'

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
      let y = current[i].y + speed
      let x = temp.x
      temp.moveTo(x, y)
    }
  }
}

function place(current) {
  let place = false;
  for(let i = 0; i < current.length; i ++) {
    if(current[i].y > row - 2 || checkBoard[current[i].y + 2] && checkBoard[current[i].y + 2][current[i].x]) {
      place = true;
      break;
    }
  }
  if(place) {
    for(let j = 0; j < current.length; j ++) {
      let block = current[j]
      if(checkBoard[block.y + 1]) {
        checkBoard[block.y + 1][block.x] = block
      }  
    }
    removeBlock();
    regenerateBlock();
    pause = false;
  }
}

function removeBlock() {
  let row = [];
  for(let i in checkBoard) {
    let exist = true;
    for(let j in checkBoard[i]) {
      if(!checkBoard[i][j]) {
        exist = false
      }
    }
    if(exist) {
      row.push(i)
    }
  }

  if(row.length) {
    breakBlocks = true;
    row.forEach(r => {
      for(let col in checkBoard[r]) {
        checkBoard[r][col].element.classList.add('break');
      }
    })

    setTimeout(() => {
      row.forEach(r => {
        for(let col in checkBoard[r]) {
          checkBoard[r][col].element.remove();
        }
      })
  
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
        let oneRow = []
  
        for(let i = 0; i < coloum; i ++) {
          oneRow.push(false)
        }
        checkBoard.splice(r,1)
        checkBoard.splice(0,0,oneRow)
      })
      setTimeout(() => breakBlocks = false, 500)
    }, 400)
  }
}

function regenerateBlock() {
  let blocks = [createBar, createL, createS, createZ, createㄱ, createㅁ, createㅗ]
  let random = Math.floor(Math.random() * Math.floor(7))
  for(let i = 0; i < coloum; i ++) {
    if(checkBoard[0][i]) {
      clearInterval(interval)
      console.log('over')
      return;
    }
  }
  if(next === null) {
    let random1 = Math.floor(Math.random() * Math.floor(7))
    let random2 = Math.floor(Math.random() * Math.floor(7))

    next = blocks[random1](2,nextArea, 7);

    keep = blocks[random1]
    current = blocks[random2](center,gameWindow);
  } else {
    current = keep(center, gameWindow)
    for(let i = 3 ; i >= 0; i --) {
      next[i].element.remove();
    }
    next = blocks[random](2,nextArea, 7);  
    keep = blocks[random] 
  }
  for(let i = 3 ; i >= 0; i --) {
    next[i].element.style['visibility'] = 'visible';
  }

  return current
}

// define blocks
function createBar(x, area, y = 0) {
  return [
    new makeBlock(x, y -6, 'bar', area),
    new makeBlock(x, y -5, 'bar', area),
    new makeBlock(x, y -4, 'bar', area),
    new makeBlock(x, y -3, 'bar', area),   
  ]
}

function createㄱ(x, area, y = 0) {
  return [
    new makeBlock(x - 1, y -5, 'ㄱ', area),
    new makeBlock(x, y -5, 'ㄱ', area),
    new makeBlock(x, y -4, 'ㄱ', area),
    new makeBlock(x, y -3, 'ㄱ', area),   
  ]
}

function createL(x, area, y = 0) {
  return [
    new makeBlock(x - 1, y -3, 'L', area),   
    new makeBlock(x, y -3, 'L', area),
    new makeBlock(x, y-4, 'L', area),
    new makeBlock(x, y -5, 'L', area),
  ]
}

function createZ(x, area, y = 0) {
  return [
    new makeBlock(x - 1, y -4, 'z', area),
    new makeBlock(x, y -4, 'z', area),
    new makeBlock(x, y -3, 'z', area),
    new makeBlock(x + 1, y -3, 'z', area),   
  ]
}

function createS(x, area, y = 0) {
  return [
    new makeBlock(x + 1, y -4, 's', area),
    new makeBlock(x, y -4, 's', area),
    new makeBlock(x, y -3, 's', area),
    new makeBlock(x - 1, y -3, 's', area),   
  ]
}

function createㅁ(x, area, y = 0) {
  return [
    new makeBlock(x, y -4, 'ㅁ', area),
    new makeBlock(x + 1, y -4, 'ㅁ', area),
    new makeBlock(x + 1, y -3, 'ㅁ', area),
    new makeBlock(x, y -3, 'ㅁ', area),   
  ]
}

function createㅗ(x, area, y = 0) {
  return [
    new makeBlock(x, y -4, 'ㅗ', area),
    new makeBlock(x, y -3, 'ㅗ', area),
    new makeBlock(x - 1, y -3, 'ㅗ', area),
    new makeBlock(x + 1, y -3, 'ㅗ', area),
  ]
}


function operate() {
  if(!nothing) {
    count++
    if(count % 10 === 0) {
      !breakBlocks && !onMove && goDown(current)
      !breakBlocks && !onMove && place(current)
      onMove = false  
    }  
  }
}


function stop() {
  let stopButton = document.getElementById('stop');
  nothing = !nothing
  stopButton.innerText = !nothing ? 'stop' : 'resume'
  if(nothing) {
    clearInterval(interval)
  } else {
    interval = setInterval(operate, 10)
  }
}

function start() {
  checkBoard = [];
  const block = document.getElementsByClassName('block_span')
  for(let i = block.length - 1; i >= 0; i --) {
    block.remove();
  }

  for(let i = 0; i <= row; i ++) {
    checkBoard.push([])
    for(let j = 0; j < coloum; j ++) {
      checkBoard[i][j] = false;
    }
  }
  regenerateBlock()
  interval = setInterval(operate, 10)


}

//사라질때 애니메이션
//스페이스 또는 아래 버튼 누르면 뚝떨어지기
//보이기전에 움직이기
//스코어 및 설명 등 꾸미기
//코드 정리!

//버그 이유 array의 특성 떄문 블록을 없애고 새로 추가된 ROW array들이 같은 지점을 바라보고 있었고 그로인해 그중하나에 블록이 지정되면 모두가 값을 가지게
//되는현상.