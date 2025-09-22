import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import ResumeGenerator from './pages/ResumeGenerator/ResumeGenerator';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume-generator" element={<ResumeGenerator />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;