import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import GoalWeight from '../app/components/intake-v4/pages/goal-weight'
import MedicationOptions from '../app/components/intake-v4/pages/medication-options'
import GlobalIntro from '../app/components/intake-v4/pages/global-intro'
import GlobalCheckout from '../app/components/intake-v4/pages/global-checkout'
import GlobalOrderSummary from '../app/components/intake-v4/pages/global-order-summary'
import GlobalWLUpNext from '../app/components/intake-v4/pages/global-up-next'
import GlobalWhatsNext from '../app/components/intake-v4/pages/global-whats-next'
import InteractiveBMI from '../app/components/intake-v4/pages/interactive-bmi'

jest.mock('@mui/material', () => ({
  Button: (props: any) => <button {...props} />,
}))

const push = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useParams: () => ({ product: 'weight-loss' }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/intake/prescriptions/weight-loss/current',
}))

jest.mock('../app/components/intake-v2/intake-functions', () => ({
  getIntakeURLParams: () => ({ product_href: 'weight-loss' }),
}))

jest.mock('../app/utils/functions/intake-route-controller', () => ({
  getNextIntakeRoute: () => 'next'
}))

describe('intake v4 pages', () => {
  afterEach(() => { push.mockClear() })

  it('goal weight navigates on continue', () => {
    const { getByText } = render(<GoalWeight />)
    fireEvent.click(getByText('Continue'))
    expect(push).toHaveBeenCalled()
  })

  it('medication options navigates on continue', () => {
    const { getByText } = render(<MedicationOptions />)
    fireEvent.click(getByText('Continue'))
    expect(push).toHaveBeenCalled()
  })

  it('interactive BMI navigates on continue', () => {
    const { getByText } = render(<InteractiveBMI />)
    fireEvent.click(getByText('Continue'))
    expect(push).toHaveBeenCalled()
  })

  it('global intro navigates on continue', () => {
    const { getByText } = render(<GlobalIntro />)
    fireEvent.click(getByText('Continue'))
    expect(push).toHaveBeenCalled()
  })

  it('global checkout navigates on continue', () => {
    const { getByText } = render(<GlobalCheckout />)
    fireEvent.click(getByText('Continue'))
    expect(push).toHaveBeenCalled()
  })

  it('global order summary navigates on continue', () => {
    const { getByText } = render(<GlobalOrderSummary />)
    fireEvent.click(getByText('Continue'))
    expect(push).toHaveBeenCalled()
  })

  it('global up next navigates on continue', () => {
    const { getByText } = render(<GlobalWLUpNext />)
    fireEvent.click(getByText('Continue'))
    expect(push).toHaveBeenCalled()
  })

  it('global whats next renders text', () => {
    const { getByText } = render(<GlobalWhatsNext />)
    expect(getByText("What's Next")).toBeTruthy()
  })
})
