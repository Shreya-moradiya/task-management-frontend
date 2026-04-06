import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  )

}

export default App;
