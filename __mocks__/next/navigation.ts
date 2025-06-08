export const useRouter = () => ({ push: jest.fn() })
export const useParams = () => ({ product: 'weight-loss' })
export const useSearchParams = () => new URLSearchParams()
export const usePathname = () => '/intake/prescriptions/weight-loss/current'
