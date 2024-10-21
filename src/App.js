import { Navigate, Route, Routes } from 'react-router-dom';

import './App.css';
import Home from './component/Home';
import Auth from './component/Auth';
import { useSelector } from 'react-redux';
import ProtectedRoute from './protectedRoute';
import DeviceList from './component/DeviceList';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Auth />} />

      <Route path="/home" element={
        <ProtectedRoute >
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/device-list" element={
        <ProtectedRoute >
          <DeviceList />
        </ProtectedRoute>
      } />

    </Routes>
  );
}

export default App;
