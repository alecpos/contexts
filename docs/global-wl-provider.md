# GlobalWLFunnelProvider

`GlobalWLFunnelProvider` exposes helper functions for the global weight loss funnel. Wrap your application with this provider so pages can call API routes without duplicating fetch logic.

## Usage

```tsx
import { GlobalWLFunnelProvider } from '@/providers/GlobalWLFunnelProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <GlobalWLFunnelProvider>{children}</GlobalWLFunnelProvider>
}
```

## Functions

- `saveGoalWeight(userId: string, weight: number)` – POSTs to `/api/patient/goal-weight`.
- `getMedicationOptions()` – GETs `/api/products/weight-loss`.
- `selectMedication(userId: string, medication: string)` – POSTs to `/api/prescriptions/medication`.
- `finalizeOrder(orderId: number)` – POSTs to `/api/checkout/weight-loss`.

All functions throw an error if the underlying request fails.
