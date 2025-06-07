/// <reference types="node" />
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

declare const process: {
  env: {
    SUPABASE_URL?: string
    SUPABASE_SERVICE_KEY?: string
  }
}

interface RequestOptions {
  method?: string
  body?: any
  query?: Record<string, string>
  headers?: Record<string, string>
}

function getConfig() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set')
  }
  return { url, key }
}

async function fetchWithFallback(path: string, options: RequestOptions = {}) {
  const { url, key } = getConfig()
  const qs = options.query ? `?${new URLSearchParams(options.query).toString()}` : ''
  const fullUrl = `${url}/rest/v1${path}${qs}`
  const method = options.method || 'GET'
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  const body = options.body ? JSON.stringify(options.body) : undefined

  try {
    const res = await fetch(fullUrl, { method, headers, body })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Supabase error: ${res.status} - ${text}`)
    }
    return res.json()
  } catch (err) {
    console.warn('fetch failed, using curl fallback', err)
    let cmd = `curl -s -X ${method} \"${fullUrl}\"`
    Object.entries(headers).forEach(([k, v]) => {
      cmd += ` -H \"${k}: ${v}\"`
    })
    if (body && method !== 'GET') {
      cmd += ` -d '${body.replace(/'/g, "'\''")}'`
    }
    const { stdout, stderr } = await execAsync(cmd)
    if (stderr) {
      console.error('curl stderr:', stderr)
    }
    if (!stdout) {
      throw new Error('Empty response from curl')
    }
    return JSON.parse(stdout)
  }
}

export async function selectFrom(table: string, limit: number = 10) {
  return fetchWithFallback(`/${table}`, { query: { select: '*', limit: String(limit) } })
}

export async function insertInto(table: string, values: Record<string, any>) {
  return fetchWithFallback(`/${table}`, { method: 'POST', body: values })
}

export async function updateTable(
  table: string,
  values: Record<string, any>,
  filter: { column: string; value: string },
) {
  return fetchWithFallback(`/${table}`, {
    method: 'PATCH',
    body: values,
    query: { [`${filter.column}`]: `eq.${filter.value}` },
  })
}

export async function deleteFrom(table: string, filter: { column: string; value: string }) {
  return fetchWithFallback(`/${table}`, {
    method: 'DELETE',
    query: { [`${filter.column}`]: `eq.${filter.value}` },
  })
}
