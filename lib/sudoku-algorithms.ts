// SUDOKU ALGORITHMS - Genetic Algorithm (GA) vs LSGA

export interface AlgorithmMetrics {
  generations: number
  iterations: number
  executionTime: number
  fitnessEvaluations: number
  bestFitness: number
}

// ===== UTILITY FUNCTIONS =====

export const isValidPlacement = (board: number[][], row: number, col: number, num: number): boolean => {
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false
  }
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false
  }
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false
    }
  }
  return true
}

export const copyBoard = (board: number[][]): number[][] => {
  return board.map((row) => [...row])
}

export const calculateFitness = (board: number[][]): number => {
  let errors = 0

  // Column conflicts
  for (let col = 0; col < 9; col++) {
    const seen = new Set()
    for (let row = 0; row < 9; row++) {
      if (board[row][col] !== 0) {
        if (seen.has(board[row][col])) {
          errors++
        } else {
          seen.add(board[row][col])
        }
      }
    }
  }

  // Box conflicts
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const seen = new Set()
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if (board[r][c] !== 0) {
            if (seen.has(board[r][c])) {
              errors++
            } else {
              seen.add(board[r][c])
            }
          }
        }
      }
    }
  }

  return errors
}

// ===== GENETIC ALGORITHM (Standard GA - baseline, without local search) =====

interface Individual {
  grid: number[][]
  fitness: number
}

export const geneticAlgorithmSolver = (
  board: number[][],
  maxGenerations = 500,
  populationSize = 30,
): { solution: number[][] | null; metrics: AlgorithmMetrics } => {
  const startTime = performance.now()
  const original = copyBoard(board)
  let generations = 0
  let totalEvaluations = 0

  const createIndividual = (): Individual => {
    const grid = copyBoard(original)
    for (let row = 0; row < 9; row++) {
      const nums: number[] = []
      for (let num = 1; num <= 9; num++) {
        let canUse = true
        for (let col = 0; col < 9; col++) {
          if (original[row][col] === num) {
            canUse = false
            break
          }
        }
        if (canUse) nums.push(num)
      }

      nums.sort(() => Math.random() - 0.5)

      let numIdx = 0
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0 && numIdx < nums.length) {
          grid[row][col] = nums[numIdx++]
        }
      }
    }
    return { grid, fitness: calculateFitness(grid) }
  }

  let population: Individual[] = Array.from({ length: populationSize }, () => createIndividual())
  population.sort((a, b) => a.fitness - b.fitness)

  let bestEver = copyBoard(population[0].grid)
  let bestFitness = population[0].fitness

  for (generations = 0; generations < maxGenerations; generations++) {
    population.sort((a, b) => a.fitness - b.fitness)

    if (population[0].fitness < bestFitness) {
      bestFitness = population[0].fitness
      bestEver = copyBoard(population[0].grid)
    }

    if (bestFitness === 0) break

    const newPopulation: Individual[] = [{ grid: copyBoard(population[0].grid), fitness: population[0].fitness }]

    for (let i = 1; i < populationSize; i++) {
      const parent1 = population[Math.floor(Math.random() * populationSize)]
      const parent2 = population[Math.floor(Math.random() * populationSize)]

      const child: Individual = { grid: copyBoard(parent1.grid), fitness: 0 }

      // Weak row-level crossover
      for (let row = 0; row < 9; row++) {
        if (Math.random() < 0.3) {
          child.grid[row] = copyBoard([parent2.grid[row]])[0]
        }
      }

      // High mutation rate (no local search to compensate)
      for (let mutIdx = 0; mutIdx < 3; mutIdx++) {
        if (Math.random() < 0.7) {
          const row = Math.floor(Math.random() * 9)
          const col1 = Math.floor(Math.random() * 9)
          const col2 = Math.floor(Math.random() * 9)

          if (original[row][col1] === 0 && original[row][col2] === 0) {
            ;[child.grid[row][col1], child.grid[row][col2]] = [child.grid[row][col2], child.grid[row][col1]]
          }
        }
      }

      child.fitness = calculateFitness(child.grid)
      totalEvaluations++
      newPopulation.push(child)
    }

    population = newPopulation
  }

  const executionTime = performance.now() - startTime

  return {
    solution: bestFitness === 0 ? bestEver : null,
    metrics: {
      generations,
      iterations: population.length,
      executionTime,
      fitnessEvaluations: totalEvaluations,
      bestFitness,
    },
  }
}

// ===== LSGA ALGORITHM (Local Search-based Genetic Algorithm - Enhanced) =====

export const lsgaSolver = (
  board: number[][],
  maxGenerations = 500,
  populationSize = 30,
): { solution: number[][] | null; metrics: AlgorithmMetrics } => {
  const startTime = performance.now()
  const original = copyBoard(board)
  let generations = 0
  let totalEvaluations = 0

  const createIndividual = (): Individual => {
    const grid = copyBoard(original)
    for (let row = 0; row < 9; row++) {
      const nums: number[] = []
      for (let num = 1; num <= 9; num++) {
        let canUse = true
        for (let col = 0; col < 9; col++) {
          if (original[row][col] === num) {
            canUse = false
            break
          }
        }
        if (canUse) nums.push(num)
      }

      nums.sort(() => Math.random() - 0.5)

      let numIdx = 0
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0 && numIdx < nums.length) {
          grid[row][col] = nums[numIdx++]
        }
      }
    }
    return { grid, fitness: calculateFitness(grid) }
  }

  let population: Individual[] = Array.from({ length: populationSize }, () => createIndividual())

  // Apply local search immediately
  for (const ind of population) {
    applyLocalSearch(ind.grid, original)
    ind.fitness = calculateFitness(ind.grid)
    totalEvaluations++
  }

  population.sort((a, b) => a.fitness - b.fitness)

  let bestEver = copyBoard(population[0].grid)
  let bestFitness = population[0].fitness

  for (generations = 0; generations < maxGenerations; generations++) {
    if (bestFitness === 0) break

    population.sort((a, b) => a.fitness - b.fitness)

    if (population[0].fitness < bestFitness) {
      bestFitness = population[0].fitness
      bestEver = copyBoard(population[0].grid)
    }

    const newPopulation: Individual[] = [{ grid: copyBoard(population[0].grid), fitness: population[0].fitness }]

    for (let i = 1; i < populationSize; i++) {
      const parent1 = population[Math.floor(Math.random() * Math.min(10, populationSize))]
      const parent2 = population[Math.floor(Math.random() * Math.min(10, populationSize))]

      const child: Individual = { grid: copyBoard(parent1.grid), fitness: 0 }

      // Strong row-level crossover
      for (let row = 0; row < 9; row++) {
        if (Math.random() < 0.6) {
          child.grid[row] = copyBoard([parent2.grid[row]])[0]
        }
      }

      // Light mutation (local search will handle optimization)
      if (Math.random() < 0.15) {
        const row = Math.floor(Math.random() * 9)
        const col1 = Math.floor(Math.random() * 9)
        const col2 = Math.floor(Math.random() * 9)

        if (original[row][col1] === 0 && original[row][col2] === 0) {
          ;[child.grid[row][col1], child.grid[row][col2]] = [child.grid[row][col2], child.grid[row][col1]]
        }
      }

      applyLocalSearch(child.grid, original)

      child.fitness = calculateFitness(child.grid)
      totalEvaluations++
      newPopulation.push(child)
    }

    population = newPopulation
  }

  const executionTime = performance.now() - startTime

  return {
    solution: bestFitness === 0 ? bestEver : null,
    metrics: {
      generations,
      iterations: population.length,
      executionTime,
      fitnessEvaluations: totalEvaluations,
      bestFitness,
    },
  }
}

const applyLocalSearch = (grid: number[][], original: number[][]): void => {
  // Multiple passes of local search for better convergence
  for (let pass = 0; pass < 3; pass++) {
    // Column-based local search
    for (let col = 0; col < 9; col++) {
      for (let r1 = 0; r1 < 9; r1++) {
        if (original[r1][col] === 0) {
          for (let r2 = r1 + 1; r2 < 9; r2++) {
            if (original[r2][col] === 0) {
              // Try swapping if it reduces conflicts
              const fit1 = countCellConflicts(grid, r1, col)
              const fit2 = countCellConflicts(grid, r2, col)
              ;[grid[r1][col], grid[r2][col]] = [grid[r2][col], grid[r1][col]]

              const newFit1 = countCellConflicts(grid, r1, col)
              const newFit2 = countCellConflicts(grid, r2, col)

              if (newFit1 + newFit2 > fit1 + fit2) {
                // Revert if worse
                ;[grid[r1][col], grid[r2][col]] = [grid[r2][col], grid[r1][col]]
              }
            }
          }
        }
      }
    }

    // Sub-block local search
    for (let boxRow = 0; boxRow < 9; boxRow += 3) {
      for (let boxCol = 0; boxCol < 9; boxCol += 3) {
        const cells: Array<{ r: number; c: number }> = []
        for (let r = boxRow; r < boxRow + 3; r++) {
          for (let c = boxCol; c < boxCol + 3; c++) {
            if (original[r][c] === 0) {
              cells.push({ r, c })
            }
          }
        }

        // Try all swaps in sub-block
        for (let i = 0; i < cells.length; i++) {
          for (let j = i + 1; j < cells.length; j++) {
            const { r: r1, c: c1 } = cells[i]
            const { r: r2, c: c2 } = cells[j]

            const fit1 = countCellConflicts(grid, r1, c1)
            const fit2 = countCellConflicts(grid, r2, c2)
            ;[grid[r1][c1], grid[r2][c2]] = [grid[r2][c2], grid[r1][c1]]

            const newFit1 = countCellConflicts(grid, r1, c1)
            const newFit2 = countCellConflicts(grid, r2, c2)

            if (newFit1 + newFit2 > fit1 + fit2) {
              // Revert if worse
              ;[grid[r1][c1], grid[r2][c2]] = [grid[r2][c2], grid[r1][c1]]
            }
          }
        }
      }
    }
  }
}

const countCellConflicts = (grid: number[][], row: number, col: number): number => {
  let conflicts = 0
  const val = grid[row][col]

  // Check row conflicts
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row][c] === val) conflicts++
  }

  // Check column conflicts
  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r][col] === val) conflicts++
  }

  // Check box conflicts
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && grid[r][c] === val) conflicts++
    }
  }

  return conflicts
}

// ===== PUZZLE GENERATOR =====

export const generateSudokuPuzzle = (difficulty: "easy" | "medium" | "hard" | "evil"): number[][] => {
  const cluesCount = {
    easy: 40,
    medium: 30,
    hard: 20,
    evil: 22,
  }

  const board: number[][] = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0))

  for (let box = 0; box < 3; box++) {
    const nums = Array.from({ length: 9 }, (_, i) => i + 1).sort(() => Math.random() - 0.5)
    let idx = 0
    for (let r = box * 3; r < box * 3 + 3; r++) {
      for (let c = box * 3; c < box * 3 + 3; c++) {
        board[r][c] = nums[idx++]
      }
    }
  }

  const solved = copyBoard(board)
  const solveBoard = (board: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(board, row, col, num)) {
              board[row][col] = num
              if (solveBoard(board)) {
                return true
              }
              board[row][col] = 0
            }
          }
          return false
        }
      }
    }
    return true
  }
  solveBoard(solved)

  const cellCount = cluesCount[difficulty]
  let removed = 0

  while (removed < 81 - cellCount) {
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)

    if (solved[row][col] !== 0) {
      solved[row][col] = 0
      removed++
    }
  }

  return solved
}
