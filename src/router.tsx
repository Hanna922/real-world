import { Route, Routes } from 'react-router-dom'

import ArticlePage from './pages/ArticlePage'
import CreatePage from './pages/CreatePage'
import EditorPage from './pages/EditorPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import SettingsPage from './pages/SettingsPage'

export const IndexRouter = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />
      <Route
        path="/login"
        element={<LoginPage />}
      />
      <Route
        path="/register"
        element={<RegisterPage />}
      />
      <Route
        path="/editor/:slug"
        element={<EditorPage />}
      />
      <Route
        path="/create"
        element={<CreatePage />}
      />
      <Route
        path="/settings"
        element={<SettingsPage />}
      />
      <Route
        path="/article/:slug"
        element={<ArticlePage />}
      />
      <Route
        path="/:userName"
        element={<ProfilePage />}
      />
    </Routes>
  )
}
