import Navigation from './components/Navigation';
import { Route, Routes } from 'react-router-dom';
import ArchitectPage from './pages/ArchitectPage';
import BlogPage from './pages/BlogPage';
import HomePage from './pages/HomePage';
import MatrixPage from './pages/MatrixPage';
import PortfolioPage from './pages/PortfolioPage';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/architect" element={<ArchitectPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/matrix" element={<MatrixPage />} />
      </Routes>
    </div>
  );
}
