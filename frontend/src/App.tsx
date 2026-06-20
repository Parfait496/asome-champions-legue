import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import MatchesPage from './pages/MatchesPage'
import MatchDetailPage from './pages/MatchDetailPage'
import TeamsPage from './pages/TeamsPage'
import TeamDetailPage from './pages/TeamDetailPage'
import NewsPage from './pages/NewsPage'
import NewsDetailPage from './pages/NewsDetailPage'
import AnnouncementsPage from './pages/AnnouncementsPage'
import GalleryPage from './pages/GalleryPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import SubmitPage from './pages/SubmitPage'

export default function App() {
  return (
    <ThemeProvider>
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
                <Route path="/teams/:id" element={<TeamDetailPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/panel" element={<AdminPage />} />
                <Route path="/x7k9-admin" element={<AdminPage />} />
                <Route path="/submit" element={<SubmitPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}