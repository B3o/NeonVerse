import { Vector2 } from 'three'

interface Point {
  x: number
  y: number
}

export class PoissonDiskSampling {
  private width: number
  private height: number
  private radius: number
  private k: number
  private grid: (Point | null)[][]
  private cellSize: number
  private points: Point[]
  private activePoints: Point[]

  constructor(width: number, height: number, radius: number, k: number = 30) {
    this.width = width
    this.height = height
    this.radius = radius
    this.k = k
    this.cellSize = radius / Math.sqrt(2)
    
    const cols = Math.ceil(width / this.cellSize)
    const rows = Math.ceil(height / this.cellSize)
    
    this.grid = Array(cols).fill(null).map(() => Array(rows).fill(null))
    this.points = []
    this.activePoints = []
  }

  private distance(a: Point, b: Point): number {
    const dx = b.x - a.x
    const dy = b.y - a.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  private getGridCoords(point: Point): [number, number] {
    const col = Math.floor(point.x / this.cellSize)
    const row = Math.floor(point.y / this.cellSize)
    return [col, row]
  }

  private isValidPoint(point: Point): boolean {
    if (point.x < 0 || point.x >= this.width || point.y < 0 || point.y >= this.height) {
      return false
    }

    const [col, row] = this.getGridCoords(point)
    const searchRadius = 2

    for (let i = -searchRadius; i <= searchRadius; i++) {
      for (let j = -searchRadius; j <= searchRadius; j++) {
        const newCol = col + i
        const newRow = row + j

        if (
          newCol >= 0 && newCol < this.grid.length &&
          newRow >= 0 && newRow < this.grid[0].length
        ) {
          const point2 = this.grid[newCol][newRow]
          if (point2 && this.distance(point, point2) < this.radius) {
            return false
          }
        }
      }
    }

    return true
  }

  private addPoint(point: Point): void {
    const [col, row] = this.getGridCoords(point)
    this.grid[col][row] = point
    this.points.push(point)
    this.activePoints.push(point)
  }

  generate(): Point[] {
    // Add first point
    const firstPoint: Point = {
      x: this.width / 2,
      y: this.height / 2
    }
    this.addPoint(firstPoint)

    while (this.activePoints.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.activePoints.length)
      const point = this.activePoints[randomIndex]
      let found = false

      for (let i = 0; i < this.k; i++) {
        const angle = Math.random() * Math.PI * 2
        const r = Math.random() * this.radius + this.radius
        const newPoint: Point = {
          x: point.x + Math.cos(angle) * r,
          y: point.y + Math.sin(angle) * r
        }

        if (this.isValidPoint(newPoint)) {
          this.addPoint(newPoint)
          found = true
          break
        }
      }

      if (!found) {
        this.activePoints.splice(randomIndex, 1)
      }
    }

    return this.points
  }
}

export function generateCityPositions(
  count: number,
  minDistance: number = 5,
  width: number = 100,
  height: number = 100
): { x: number; z: number }[] {
  const sampling = new PoissonDiskSampling(width, height, minDistance)
  const points = sampling.generate()
  
  // Center the points around origin
  const offsetX = width / 2
  const offsetY = height / 2
  
  return points.slice(0, count).map(point => ({
    x: point.x - offsetX,
    z: point.y - offsetY
  }))
}
