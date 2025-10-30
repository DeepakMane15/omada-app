import { Navigate, Route, Routes } from 'react-router-dom';

import './App.css';
import Home from './component/Home';
import Auth from './component/Auth';
import { useSelector } from 'react-redux';
import ProtectedRoute from './protectedRoute';
import DeviceList from './component/DeviceList';
import Header from './component/Header';
import Prtg from './component/prtg';
import PrtgList from './component/prtgList';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Auth />} />

      <Route path="/home" element={
        <ProtectedRoute >
          <Header />
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/device-list" element={
        <ProtectedRoute >
          <Header />
          <DeviceList />
        </ProtectedRoute>
      } />

      <Route path="/prtg" element={
        <ProtectedRoute >
          <Header />
          <Prtg />
        </ProtectedRoute>
      } />


      <Route path="/op-manager" element={
        <ProtectedRoute >
          <Header />
          <PrtgList />
        </ProtectedRoute>
      } />

    </Routes>
  );
}

export default App;
