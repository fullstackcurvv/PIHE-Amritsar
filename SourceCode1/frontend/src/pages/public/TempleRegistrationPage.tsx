import { Outlet } from 'react-router'
import { TempleFormProvider } from '@/context/TempleFormContext'

/**
 * TempleRegistrationPage
 *
 * Acts as the layout boundary for the multi-step temple registration flow.
 * It wraps all child step-routes with the TempleFormProvider so that form
 * state persists across steps without polluting the global app store.
 *
 * This component is intentionally UI-less — the Navbar, Footer, and page
 * background come from the parent PublicLayout in AppRouter.
 *
 * Route tree (all under /temple-registration):
 *   index          → TempleDetails  (step 1)
 *   /president     → PresidentDetails (step 2)
 *   /vice-president→ VicePresidentDetails (step 3)
 *   /review        → ReviewSubmit (step 4)
 *   /success       → RegistrationSuccess
 */
export default function TempleRegistrationPage() {
  return (
    <TempleFormProvider>
      <Outlet />
    </TempleFormProvider>
  )
}
