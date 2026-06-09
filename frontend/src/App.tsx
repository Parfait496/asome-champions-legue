import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import MatchesPage from './pages/MatchesPage'
import MatchDetailPage from './pages/MatchDetailPage'
import TeamsPage from './pages/TeamsPage'
import NewsPage from './pages/NewsPage'
import GalleryPage from './pages/GalleryPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import SubmitPage from './pages/SubmitPage'
import TeamDetailPage from './pages/TeamDetailPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/matches/:id" element={<MatchDetailPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/admin-panel" element={<AdminPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/panel" element={<AdminPage />} />
              <Route path="/x7k9-admin" element={<AdminPage />} />
              <Route path="/submit" element={<SubmitPage />} />
              <Route path="/teams/:id" element={<TeamDetailPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}