// src/App.js
import './App.css';
import LoginPage from './js_files/LoginPage';
import RegisterPage from './js_files/RegisterPage';
import MythicalCreatures from './js_files/MythicalCreatures';
import SelectedPage from './js_files/SelectedPage';
import ContractPage from './js_files/ContractPage';
import FamiliarsPage from './js_files/FamiliarsPage';
import DragonGame from './js_files/DragonGame';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DataProvider } from './context/dataContext';

function App() {
  return (
    <main>
      <DataProvider>
        <Router>
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/mythicalCreatures' element={<MythicalCreatures />} />
            <Route path='/selected' element={<SelectedPage />} />
            <Route path='/contracts' element={<ContractPage />} />
            <Route path='/familiars' element={<FamiliarsPage />} />
            <Route path='/dragon-game' element={<DragonGame />} />
          </Routes>
        </Router>
      </DataProvider>
    </main>
  );
}

export default App;
