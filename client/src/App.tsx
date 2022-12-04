import { Route, Routes } from 'react-router';
import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Signup from './pages/Signup';

function App() {
  return (
    <div className="body-container">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
