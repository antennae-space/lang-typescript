// Checks the pack: plugin.json against the JSON Schema of the plugin SDK (the version its
// $schema names), and that its grammars are JSON.
import { readFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('plugin.json', 'utf8'))
const schema = process.env.SCHEMA ? JSON.parse(readFileSync(process.env.SCHEMA, 'utf8')) : await (await fetch(manifest.$schema)).json()
const errors = []
// A small validator: enough for the schema of the SDK (types, required, enum, pattern, items,
// properties, additionalProperties, propertyNames, anyOf, const).
function check(v, s, at) {
  if (s.const !== undefined && v !== s.const) errors.push(`${at}: must be ${s.const}`)
  if (s.enum && !s.enum.includes(v)) errors.push(`${at}: one of ${s.enum.join(', ')}`)
  if (s.anyOf) {
    const before = errors.length
    const ok = s.anyOf.some((sub) => { const n = errors.length; check(v, sub, at); const fine = errors.length === n; errors.length = n; return fine })
    errors.length = before
    if (!ok) errors.push(`${at}: matches none of its forms`)
  }
  const type = Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v
  if (s.type && !(s.type === type || (s.type === 'integer' && Number.isInteger(v)))) return errors.push(`${at}: a ${s.type}`)
  if (type === 'string' && s.pattern && !new RegExp(s.pattern).test(v)) errors.push(`${at}: ${JSON.stringify(v)} does not match ${s.pattern}`)
  if (type === 'array' && s.items) v.forEach((x, i) => check(x, s.items, `${at}[${i}]`))
  if (type === 'object') {
    for (const r of s.required ?? []) if (!(r in v)) errors.push(`${at}.${r}: required`)
    for (const [k, x] of Object.entries(v)) {
      if (s.propertyNames?.pattern && !new RegExp(s.propertyNames.pattern).test(k)) errors.push(`${at}.${k}: an invalid name`)
      if (s.properties?.[k]) check(x, s.properties[k], `${at}.${k}`)
      else if (s.additionalProperties === false) errors.push(`${at}.${k}: unknown`)
      else if (typeof s.additionalProperties === 'object') check(x, s.additionalProperties, `${at}.${k}`)
    }
  }
}
check(manifest, schema, 'plugin.json')
for (const l of manifest.contributes.languages) if (l.grammar) JSON.parse(readFileSync(l.grammar, 'utf8'))
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log('plugin.json: valid')
