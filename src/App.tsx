// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import HostView from './components/HostView';
import GuestView from './components/GuestView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/host/:roomId" element={<HostView />} />
        <Route path="/guest/:roomId" element={<GuestView />} />
      </Routes>
    </Router>
  );
}

export default App;