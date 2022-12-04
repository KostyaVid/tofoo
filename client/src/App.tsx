import { Routes } from 'react-router';
import './App.css';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="container">
      <header className="header"></header>
      <main className="main">
        <Routes></Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
