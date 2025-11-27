import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import Login from './components/Login';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import Register from './components/Register';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/*" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/home" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
