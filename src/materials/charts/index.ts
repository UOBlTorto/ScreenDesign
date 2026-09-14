import { barMaterial } from './bar'
import ChartMaterial from './component.vue'
import { areaMaterial } from './area.ts'
import { lineMaterial } from './line.ts'
import { pieMaterial } from './pie.ts'

const chartMaterial = [barMaterial, areaMaterial, lineMaterial, pieMaterial]
export function install(register) {
  chartMaterial.forEach((materialItem) => {
    register(materialItem, ChartMaterial)
  })
}
