'use client'
import React, { useEffect, useState } from 'react'
import { useStripe } from '../providers/StripeProvider'

export default function Dashboard() {
  const { listPrices, purchasePrice } = useStripe()
  const [prices, setPrices] = useState<any[]>([])

  useEffect(() => {
    listPrices(5).then((res: any) => setPrices(res.data || []))
  }, [])

  const buy = async (priceId: string) => {
    const intent = await purchasePrice(priceId)
    console.log('purchased', intent.id)
  }

  return (
    <div>
      <h2>Prices</h2>
      <ul>
        {prices.map((p) => (
          <li key={p.id}>
            {p.id} - {(p.unit_amount ?? 0) / 100} {p.currency}
            <button onClick={() => buy(p.id)}>Buy</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
