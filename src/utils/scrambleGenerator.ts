export const generateScramble = (event: string): string => {
  switch (event) {
    case '3x3x3':
      return generate3x3Scramble()
    case '2x2x2':
      return generate2x2Scramble()
    case '4x4x4':
      return generate4x4Scramble()
    case '5x5x5':
      return generate5x5Scramble()
    case '3x3x3 OH':
      return generate3x3Scramble()
    case '3x3x3 BLD':
      return generate3x3Scramble()
    case 'F2L':
      return generateF2LScramble()
    case 'LL':
      return generateLLScramble()
    case 'PLL':
      return generatePLLScramble()
    case 'OLL':
      return generateOLLScramble()
    case 'Pyraminx':
      return generatePyraminxScramble()
    case 'Megaminx':
      return generateMegaminxScramble()
    case 'Skewb':
      return generateSkewbScramble()
    case 'Square-1':
      return generateSquare1Scramble()
    default:
      return generate3x3Scramble()
  }
}

const generate3x3Scramble = (): string => {
  const moves = ['U', 'D', 'R', 'L', 'F', 'B']
  const modifiers = ['', "'", '2']
  const scramble: string[] = []
  let lastAxis = -1
  let lastMove = ''

  for (let i = 0; i < 20; i++) {
    let move = moves[Math.floor(Math.random() * moves.length)]
    let axis = Math.floor(move.charCodeAt(0) / 3) // U,F,R = 0, L,B,D = 1
    
    while (axis === lastAxis || move === lastMove) {
      move = moves[Math.floor(Math.random() * moves.length)]
      axis = Math.floor(move.charCodeAt(0) / 3)
    }
    
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)]
    scramble.push(move + modifier)
    lastAxis = axis
    lastMove = move
  }

  return scramble.join(' ')
}

const generate2x2Scramble = (): string => {
  const moves = ['U', 'R', 'F']
  const modifiers = ['', "'", '2']
  const scramble: string[] = []
  let lastMove = ''

  for (let i = 0; i < 9; i++) {
    let move = moves[Math.floor(Math.random() * moves.length)]
    
    while (move === lastMove) {
      move = moves[Math.floor(Math.random() * moves.length)]
    }
    
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)]
    scramble.push(move + modifier)
    lastMove = move
  }

  return scramble.join(' ')
}

const generate4x4Scramble = (): string => {
  const outerMoves = ['U', 'D', 'R', 'L', 'F', 'B']
  const innerMoves = ['u', 'd', 'r', 'l', 'f', 'b']
  const modifiers = ['', "'", '2']
  const scramble: string[] = []
  let lastAxis = -1
  let lastMove = ''

  for (let i = 0; i < 40; i++) {
    const useInner = Math.random() > 0.7
    let move: string
    
    if (useInner && i < 25) {
      move = innerMoves[Math.floor(Math.random() * innerMoves.length)]
    } else {
      move = outerMoves[Math.floor(Math.random() * outerMoves.length)]
    }
    
    let axis = Math.floor(move.toLowerCase().charCodeAt(0) / 3)
    
    while (axis === lastAxis || move.toLowerCase() === lastMove.toLowerCase()) {
      if (useInner && i < 25) {
        move = innerMoves[Math.floor(Math.random() * innerMoves.length)]
      } else {
        move = outerMoves[Math.floor(Math.random() * outerMoves.length)]
      }
      axis = Math.floor(move.toLowerCase().charCodeAt(0) / 3)
    }
    
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)]
    scramble.push(move + modifier)
    lastAxis = axis
    lastMove = move
  }

  return scramble.join(' ')
}

const generate5x5Scramble = (): string => {
  const outerMoves = ['U', 'D', 'R', 'L', 'F', 'B']
  const wideMoves = ['Uw', 'Dw', 'Rw', 'Lw', 'Fw', 'Bw']
  const modifiers = ['', "'", '2']
  const scramble: string[] = []
  let lastAxis = -1
  let lastMove = ''

  for (let i = 0; i < 60; i++) {
    const useWide = Math.random() > 0.8
    let move: string
    
    if (useWide && i < 40) {
      move = wideMoves[Math.floor(Math.random() * wideMoves.length)]
    } else {
      move = outerMoves[Math.floor(Math.random() * outerMoves.length)]
    }
    
    let axis = Math.floor(move[0].toLowerCase().charCodeAt(0) / 3)
    
    while (axis === lastAxis || move[0].toLowerCase() === lastMove[0].toLowerCase()) {
      if (useWide && i < 40) {
        move = wideMoves[Math.floor(Math.random() * wideMoves.length)]
      } else {
        move = outerMoves[Math.floor(Math.random() * outerMoves.length)]
      }
      axis = Math.floor(move[0].toLowerCase().charCodeAt(0) / 3)
    }
    
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)]
    scramble.push(move + modifier)
    lastAxis = axis
    lastMove = move
  }

  return scramble.join(' ')
}

const generateF2LScramble = (): string => {
  const moves = ['R', 'U', 'L', 'F', 'D']
  const modifiers = ['', "'", '2']
  const scramble: string[] = []
  let lastMove = ''

  for (let i = 0; i < 12; i++) {
    let move = moves[Math.floor(Math.random() * moves.length)]
    
    while (move === lastMove) {
      move = moves[Math.floor(Math.random() * moves.length)]
    }
    
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)]
    scramble.push(move + modifier)
    lastMove = move
  }

  return scramble.join(' ')
}

const generateLLScramble = (): string => {
  const moves = ['U', 'R', 'L', 'F', 'B']
  const modifiers = ['', "'", '2']
  const scramble: string[] = []

  for (let i = 0; i < 10; i++) {
    const move = moves[Math.floor(Math.random() * moves.length)]
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)]
    scramble.push(move + modifier)
  }

  return scramble.join(' ')
}

const generatePLLScramble = (): string => {
  const pllAlgs = [
    "R U R' U' R' F R2 U' R' U' R U R' F'",
    "R' U L' U2 R U' R' U2 R L",
    "R U R' U' R' F R2 U' R' U' R U R' F'",
    "R U R' U' R' F R2 U' R' U' R U R' F'",
    "R U R' U' R' F R2 U' R' U' R U R' F'",
    "R U R' U' R' F R2 U' R' U' R U R' F'"
  ]
  return pllAlgs[Math.floor(Math.random() * pllAlgs.length)]
}

const generateOLLScramble = (): string => {
  const moves = ['R', 'U', 'L', 'F', 'B']
  const modifiers = ['', "'", '2']
  const scramble: string[] = []

  for (let i = 0; i < 8; i++) {
    const move = moves[Math.floor(Math.random() * moves.length)]
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)]
    scramble.push(move + modifier)
  }

  return scramble.join(' ')
}

const generatePyraminxScramble = (): string => {
  const moves = ['R', 'L', 'U', 'B', "R'", "L'", "U'", "B'"]
  const scramble: string[] = []

  for (let i = 0; i < 12; i++) {
    const move = moves[Math.floor(Math.random() * moves.length)]
    scramble.push(move)
  }

  return scramble.join(' ')
}

const generateMegaminxScramble = (): string => {
  const moves = ['U', 'R', 'L', 'F', 'B', 'D']
  const modifiers = ['', "'", '2']
  const scramble: string[] = []

  for (let i = 0; i < 70; i++) {
    const move = moves[Math.floor(Math.random() * moves.length)]
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)]
    scramble.push(move + modifier)
  }

  return scramble.join(' ')
}

const generateSkewbScramble = (): string => {
  const moves = ['R', 'L', 'U', 'B', "R'", "L'", "U'", "B'"]
  const scramble: string[] = []

  for (let i = 0; i < 8; i++) {
    const move = moves[Math.floor(Math.random() * moves.length)]
    scramble.push(move)
  }

  return scramble.join(' ')
}

const generateSquare1Scramble = (): string => {
  const topMoves = [0, 1, 2, 3, 4, 5]
  const bottomMoves = [0, 1, 2, 3, 4, 5]
  const scramble: string[] = []

  for (let i = 0; i < 12; i++) {
    const topMove = topMoves[Math.floor(Math.random() * topMoves.length)]
    const bottomMove = bottomMoves[Math.floor(Math.random() * bottomMoves.length)]
    scramble.push(`(${topMove},${bottomMove})`)
  }

  return scramble.join(' ')
}

export const getEventDisplayName = (event: string): string => {
  const eventNames: { [key: string]: string } = {
    '3x3x3': '3x3',
    '2x2x2': '2x2',
    '4x4x4': '4x4',
    '5x5x5': '5x5',
    '6x6x6': '6x6',
    '7x7x7': '7x7',
    '3x3x3 OH': '3x3 OH',
    '3x3x3 BLD': '3x3 BLD',
    'F2L': 'F2L',
    'LL': 'Last Layer',
    'PLL': 'PLL',
    'OLL': 'OLL',
    'Pyraminx': 'Pyraminx',
    'Megaminx': 'Megaminx',
    'Skewb': 'Skewb',
    'Square-1': 'Square-1'
  }
  return eventNames[event] || event
}
