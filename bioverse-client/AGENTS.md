AGENTS.md
Last updated: 2024-06-10
Purpose
This file provides explicit, actionable instructions for AI agents (such as OpenAI Codex) and human contributors working in this codebase. It ensures that all generated code, documentation, and automation tasks follow our project's standards, architecture, and workflows with a strong emphasis on context provider patterns and third-party service integrations. This file is a living document and must be updated as the project evolves.

Project Structure & Architecture

Monorepo Layout:

The main application is under bioverse-app/bioverse-client/app/.
All code, assets, and configuration files are organized in a modular, feature-oriented structure.


Key Directories:

components/: Reusable UI and logic components (React, hooks, etc.)
pages/: Next.js route handlers and page-level logic.
utils/: Utility functions, helpers, and shared logic.
types/: TypeScript type definitions and enums.
styles/: Tailwind and custom CSS modules.
public/: Static assets (images, fonts, etc.)
providers/: Context providers for third-party service integrations


Data Flow:

React (with hooks) is used for UI state management.
Context providers manage global state and third-party service connections.
API calls and data fetching are handled via utility functions in utils/database/controller/.
Stripe, RudderStack, and Supabase integrations are encapsulated through dedicated context providers.


Routing:

Next.js file-based routing is used.
Dynamic routes (e.g., [product], [question_id]) are common for intake flows.


Design Patterns:

Use composition over inheritance.
Prefer context providers for cross-cutting concerns and third-party integrations.
Use container/presenter (smart/dumb) component separation where appropriate.
Implement provider patterns for Stripe payments, RudderStack analytics, and Supabase data management.




Context Provider Architecture & Integration Patterns

Context Provider Philosophy:

All major third-party services should be accessed through dedicated React context providers.
Context providers should encapsulate service initialization, configuration, and common operations.
Prefer context providers over prop drilling for shared service instances.
Each provider should handle loading states, error boundaries, and retry logic.


Priority Integration Services:

Stripe: Payment processing, subscription management, customer portals
RudderStack: Event tracking, user analytics, conversion funnels
Supabase: Real-time data, authentication, database operations


Provider Structure:
ts// Example: StripeProvider structure
export const StripeProvider = ({ children }: { children: ReactNode }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Provider implementation with error handling and retry logic
};

Context Hook Patterns:
ts// Custom hooks for accessing context
export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within StripeProvider');
  }
  return context;
};

Integration Requirements:

All Stripe operations (payments, subscriptions, customer management) must go through the StripeProvider
All analytics events must be routed through the RudderStackProvider
All database operations should leverage the SupabaseProvider for consistency
Providers should implement proper error boundaries and fallback states




Coding Standards & Style Guidelines

General:

Use TypeScript for all new code.
Prefer functional React components and hooks.
Use named exports unless a file has a single default export.
All files must have clear, descriptive names.
Avoid magic numbers and strings; use constants/enums.
Always implement context providers for new third-party service integrations.


Formatting:

2 spaces for indentation.
Use Prettier for code formatting (npm run format).
Use single quotes for strings.
Always include trailing commas in multi-line objects/arrays.
Max line length: 100 characters.


Naming Conventions:

Components: PascalCase
Functions/variables: camelCase
Constants/enums: UPPER_SNAKE_CASE
Context Providers: ServiceNameProvider (e.g., StripeProvider, RudderStackProvider)
Context Hooks: useServiceName (e.g., useStripe, useRudderStack)
CSS classes: Use BEM or Tailwind utility classes.


Comments & Documentation:

Use JSDoc for all exported functions and complex logic.
All context providers must have comprehensive documentation explaining their purpose and usage.
Document all integration patterns and service configurations.
Use TODO/FIXME comments for known issues, with context and ticket references.


Examples:

Good:
ts/**
 * Processes a Stripe payment using the configured payment method
 * @param amount - Payment amount in cents
 * @param currency - ISO currency code
 * @returns Promise resolving to payment confirmation
 */
export function processPayment(amount: number, currency: string): Promise<PaymentResult> {
  const { stripe } = useStripe();
  return stripe.confirmPayment({ amount, currency });
}

Bad:
tsfunction pay(a, c) { return stripe.pay(a, c) }





Context Provider Implementation & Best Practices

Provider Setup:

All context providers should be implemented in the providers/ directory.
Each provider should handle service initialization, configuration, and cleanup.
Implement proper error boundaries and loading states for all providers.


Integration Validation:

All new features involving payments must utilize the StripeProvider.
All analytics events must be tracked through the RudderStackProvider.
All data operations should leverage the SupabaseProvider when applicable.


Provider Testing:

Create comprehensive integration tests for each context provider.
Mock external service calls appropriately in test environments.
Test error states, loading states, and retry mechanisms.


Monitoring & Debugging:

Implement proper logging for all provider operations.
Use RudderStack to track provider initialization and errors.
Monitor Stripe webhook events and Supabase connection health.


Configuration Management:

All service configurations should be environment-aware.
Use proper API key management and rotation strategies.
Implement graceful degradation when services are unavailable.


Example Provider Implementation:
tsexport const StripeProvider = ({ children }: PropsWithChildren) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const { trackEvent } = useRudderStack();

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
        setStripe(stripeInstance);
        trackEvent('Stripe Initialized');
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        trackEvent('Stripe Initialization Failed', { error: error.message });
      }
    };

    initializeStripe();
  }, [trackEvent]);

  const value = useMemo(() => ({ stripe }), [stripe]);

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
};



Pull Request & Collaboration Guidelines

PR Titles:

Use format: [Type] Short description (e.g., [Feature] Add RudderStack provider for checkout analytics)


PR Description:

Include a one-line summary, a "Integration Testing Done" section, and any relevant screenshots or service configuration changes.
Reference related issues or tickets.
Document any new context providers or changes to existing provider patterns.


Commits:

Use clear, atomic commits with descriptive messages.
Squash commits before merging unless otherwise specified.
Include provider-related changes in commit messages (e.g., "feat: enhance StripeProvider with subscription management").


Branch Naming:

Use feature/, fix/, or chore/ prefixes (e.g., feature/supabase-realtime-provider).


Review Process:

All PRs require at least one code review approval before merging.
Pay special attention to context provider implementations and third-party service integrations.
Verify that new integrations follow established provider patterns.


Merge Strategy:

Use rebase and merge for linear history unless otherwise specified.




Advanced Configuration & Tooling

Hierarchical AGENTS.md:

Place this file at the project root for global rules.
Add additional AGENTS.md files in subdirectories to override or extend rules for specific areas (e.g., providers/, components/).


Tool Integration:

Ensure compatibility with CI/CD, linters, formatters, and deployment scripts.
Respect all configuration files (e.g., .eslintrc, .prettierrc, tsconfig.json).
Configure proper environment variables for Stripe, RudderStack, and Supabase in all environments.


Environment:

Document all required environment variables for third-party services in .env.example.
Include API keys, webhook endpoints, and service configuration URLs.
Do not commit secrets or credentials to the repository.


Service Configuration:

Maintain separate configuration files for each environment (dev, staging, prod).
Implement proper service health checks and monitoring.
Use feature flags to control provider activation and service rollouts.




Documentation & Communication

Provider Documentation:

All context providers must have comprehensive README files.
Document service setup, configuration, and usage patterns.
Include examples of common operations and error handling.


Integration Guides:

Maintain guides for setting up and configuring Stripe, RudderStack, and Supabase.
Document webhook configurations and event handling patterns.


API Documentation:

Use OpenAPI/Swagger for backend API documentation.
Document all service integration endpoints and data flows.


Change Management:

Update CHANGELOG.md for all significant provider changes or new integrations.
Track service version updates and migration requirements.




Examples of Correct vs Incorrect Provider Practices

Correct:

Use dedicated context providers for all third-party service interactions.
Implement proper error boundaries and loading states in providers.
Track provider operations through RudderStack for monitoring.
Use environment-specific configurations for all services.


Incorrect:

Direct service instantiation without context providers.
Hardcoded API keys or service configurations.
Missing error handling or retry logic in provider implementations.
Bypassing established provider patterns for quick fixes.


Provider Integration Example:
ts// Correct: Using context providers together
const CheckoutComponent = () => {
  const { stripe, processPayment } = useStripe();
  const { trackEvent } = useRudderStack();
  const { user } = useSupabase();

  const handlePayment = async () => {
    trackEvent('Payment Initiated', { userId: user?.id });
    try {
      const result = await processPayment(amount, 'usd');
      trackEvent('Payment Completed', { paymentId: result.id });
    } catch (error) {
      trackEvent('Payment Failed', { error: error.message });
    }
  };
};



By following these guidelines, AI agents and human contributors will generate code that leverages context providers effectively, maintains consistent third-party service integrations, and follows our established patterns for Stripe, RudderStack, and Supabase implementations.RetryClaude can make mistakes. Please double-check responses.
