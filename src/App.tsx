import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './pages/Home/Home';
import InterviewCoach from './pages/InterviewCoach/InterviewCoach';
import ResumeGenerator from './pages/ResumeGenerator/ResumeGenerator';
import AuthPage from './pages/Auth/AuthPage';
import PPTGenerator from './pages/PPTGenerator/PPTGenerator';
import { useAppStore } from './store';

function App() {
  useEffect(() => {
    useAppStore.getState().initializeAuth();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/resume-generator"
            element={
              <ProtectedRoute>
                <ResumeGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-coach"
            element={
              <ProtectedRoute>
                <InterviewCoach />
              </ProtectedRoute>
            }
          />
          <Route path="/ppt-generator" element={<PPTGenerator />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
