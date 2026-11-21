import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import { AppShell } from '@/components/layout/AppShell'
import { PagePlaceholder } from '@/components/layout/PagePlaceholder'
import { RequireAuth } from '@/components/layout/RequireAuth'
import Landing from '@/pages/Landing'
import Discover from '@/pages/Discover'
import ProfileDetail from '@/pages/ProfileDetail'
import Matches from '@/pages/Matches'
import Messages from '@/pages/Messages'
import Stays from '@/pages/Stays'
import StayDetail from '@/pages/StayDetail'
import Premium from '@/pages/Premium'
import Onboarding from '@/pages/Onboarding'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import ListYourSpace from '@/pages/ListYourSpace'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Landing />} />
            <Route path="discover" element={<Discover />} />
            <Route path="profile/:id" element={<ProfileDetail />} />
            <Route element={<RequireAuth />}>
              <Route path="matches" element={<Matches />} />
              <Route path="messages" element={<Messages />} />
              <Route path="messages/:id" element={<Messages />} />
            </Route>
            <Route path="stays" element={<Stays />} />
            <Route path="stays/:id" element={<StayDetail />} />
            <Route path="premium" element={<Premium />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="list-your-space" element={<ListYourSpace />} />
            <Route path="*" element={<PagePlaceholder title="Page not found" note="That page does not exist." />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
