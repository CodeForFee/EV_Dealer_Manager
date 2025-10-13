import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Homepage from './components/Homepage'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { AuthProvider } from './contexts/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
