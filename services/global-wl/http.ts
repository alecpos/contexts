export async function saveGoalWeight(userId: string, weight: number) {
  const res = await fetch('http://localhost:3000/api/patient/goal-weight', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, weight })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`saveGoalWeight failed: ${res.status} ${text}`)
  }
  return res.json()
}

export async function getMedicationOptions() {
  const res = await fetch('http://localhost:3000/api/products/weight-loss')
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`getMedicationOptions failed: ${res.status} ${text}`)
  }
  return res.json()
}

export async function selectMedication(userId: string, medication: string) {
  const res = await fetch('http://localhost:3000/api/prescriptions/medication', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, medication })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`selectMedication failed: ${res.status} ${text}`)
  }
  return res.json()
}

export async function finalizeOrder(orderId: number) {
  const res = await fetch('http://localhost:3000/api/checkout/weight-loss', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: orderId })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`finalizeOrder failed: ${res.status} ${text}`)
  }
  return res.json()
}
