import fs from 'fs'

const dumpPath = 'SupabaseFullDump.csv'
const outputPath = 'supabase/models.ts'

interface Column {
  name: string
  type: string
  optional: boolean
}

function mapType(sqlType: string): string {
  const t = sqlType.toLowerCase()
  if (t.includes('text') || t.includes('character') || t.includes('uuid') || t.includes('inet') || t.includes('name')) return 'string'
  if (t.includes('timestamp') || t.includes('date')) return 'string'
  if (t.includes('bigint') || t.includes('int') || t.includes('numeric') || t.includes('double')) return 'number'
  if (t.includes('boolean')) return 'boolean'
  if (t.includes('json')) return 'any'
  if (t.includes('bytea')) return 'string'
  return 'any'
}

function parseLine(line: string) {
  if (!line) return null
  line = line.trim()
  if (line.startsWith('"') && line.endsWith('"')) {
    line = line.slice(1, -1)
  }
  line = line.replace(/\\n/g, '\n')
  const tableMatch = line.match(/CREATE TABLE\s+([^\s(]+)/i)
  if (!tableMatch) return null
  const table = tableMatch[1]
  const colsSection = line.substring(line.indexOf('(') + 1, line.lastIndexOf(')'))
  const colLines = colsSection.split(/,\n/)
  const columns: Column[] = []
  for (const colLine of colLines) {
    const trimmed = colLine.trim()
    if (!trimmed || trimmed.toUpperCase().startsWith('CONSTRAINT')) continue
    const parts = trimmed.split(/\s+/)
    const name = parts[0].replace(/"/g, '')
    const typeParts = [] as string[]
    for (let i = 1; i < parts.length; i++) {
      const p = parts[i]
      if (p.toUpperCase() === 'NOT' && parts[i+1]?.toUpperCase() === 'NULL') {
        continue
      }
      if (p.toUpperCase() === 'NULL') {
        continue
      }
      if (p === '') continue
      typeParts.push(p)
      if (p.includes(',')) break
    }
    let type = typeParts.join(' ')
    type = type.replace(/,$/, '')
    const optional = !trimmed.includes('NOT NULL')
    columns.push({ name, type, optional })
  }
  return { table, columns }
}

function generate() {
  const lines = fs.readFileSync(dumpPath, 'utf8').split(/\r?\n/).slice(1)
  const tables = [] as { table: string, columns: Column[] }[]
  for (const line of lines) {
    if (!line.trim()) continue
    const parsed = parseLine(line)
    if (parsed) tables.push(parsed)
  }

  let out = '// Auto-generated from SupabaseFullDump.csv\n\n'
  for (const { table, columns } of tables) {
    const interfaceName = table
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/^_+/, '')
      .replace(/_+$/, '')
      .replace(/(?:^|_)([a-z])/g, (_, c) => c.toUpperCase())
    out += `export interface ${interfaceName} {\n`
    for (const col of columns) {
      const tsType = mapType(col.type)
      out += `  ${col.name}${col.optional ? '?' : ''}: ${tsType}\n`
    }
    out += `}\n\n`
  }
  fs.writeFileSync(outputPath, out)
}

generate()
