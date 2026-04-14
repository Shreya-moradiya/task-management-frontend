import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login/Login';
import Registration from './Pages/Registration/Registration';
import Dashboard from './Pages/Dashboard/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/registration' element={<Registration />} />
    </Routes>
  )

}

export default App;
