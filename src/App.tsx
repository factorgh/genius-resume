import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CVEditor from './components/CVEditor';
import { CV } from './types/CV';
import Preview from './components/Preview';

function App() {
  // Load saved CVs from localStorage on app initialization
  const [savedCVs, setSavedCVs] = useState<CV[]>(() => {
    const saved = localStorage.getItem('savedCVs');
    return saved ? JSON.parse(saved) : [];
  });

  // Save CVs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedCVs', JSON.stringify(savedCVs));
  }, [savedCVs]);

  // Add or update a CV
  const saveCV = (cv: CV) => {
    setSavedCVs((prev) => {
      const existingIndex = prev.findIndex(item => item.id === cv.id);
      if (existingIndex >= 0) {
        // Update existing CV
        const updated = [...prev];
        updated[existingIndex] = cv;
        return updated;
      } else {
        // Add new CV
        return [...prev, cv];
      }
    });
  };

  // Delete a CV
  const deleteCV = (id: string) => {
    setSavedCVs(prev => prev.filter(cv => cv.id !== id));
  };

  // Load fonts
  useEffect(() => {
    const poppinsLink = document.createElement('link');
    poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    poppinsLink.rel = 'stylesheet';
    
    const latoLink = document.createElement('link');
    latoLink.href = 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap';
    latoLink.rel = 'stylesheet';
    
    document.head.appendChild(poppinsLink);
    document.head.appendChild(latoLink);
    
    return () => {
      document.head.removeChild(poppinsLink);
      document.head.removeChild(latoLink);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white font-body text-neutral-900">
        <Routes>
          <Route 
            path="/" 
            element={<Dashboard savedCVs={savedCVs} deleteCV={deleteCV} />} 
          />
          <Route 
            path="/editor/:id?" 
            element={<CVEditor savedCVs={savedCVs} saveCV={saveCV} />} 
          />
          <Route 
            path="/preview/:id" 
            element={<Preview savedCVs={savedCVs} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
