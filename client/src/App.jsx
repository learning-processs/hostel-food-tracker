import React from 'react'
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './pages/student/StudentDashboard';
import MessManagerDashboard from './pages/messManager/MessManagerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import SubmitComplaint from './pages/student/SubmitComplaint';
import ComplaintsInbox from './pages/messManager/ComplaintsInbox';
import AdminUsers from './pages/admin/AdminUsers';
import Insights from './pages/Insights';
import QRCodeDisplay from './pages/QRCodeDisplay';

const App = () => {
    return (
    <>
    <Toaster position="top-right" />

    <Routes>
      <Route path='/' element={ <Navigate  to="login"/> } />
      <Route path='/login' element={ <Login/> } />
      <Route path='/register' element={ <Register/> } />

      <Route path='/student' element={ <ProtectedRoute allowedRoles={['student']}> <StudentDashboard /> </ProtectedRoute> } />
      <Route path='/student/complaint' element={ <ProtectedRoute allowedRoles={['student']}> <SubmitComplaint /> </ProtectedRoute> } />

      <Route path='/mess-manager' element={ <ProtectedRoute allowedRoles={['mess_manager']}> <MessManagerDashboard /> </ProtectedRoute> } />
      <Route path='/mess-manager/complaints' element={ <ProtectedRoute allowedRoles={['mess_manager']}> <ComplaintsInbox /> </ProtectedRoute> } />

      <Route path='/admin' element={ <ProtectedRoute allowedRoles={['admin']}> <AdminDashboard /> </ProtectedRoute> } />
      <Route path='/admin/users' element={ <ProtectedRoute allowedRoles={['admin']}> <AdminUsers /> </ProtectedRoute> } />

      <Route path='/insights' element={ <ProtectedRoute allowedRoles={['admin', 'mess_manager']}> <Insights /> </ProtectedRoute> } />
      <Route path='/qr-code' element={ <ProtectedRoute allowedRoles={['admin', 'mess_manager']}> <QRCodeDisplay /> </ProtectedRoute> } />



    </Routes>
    </>
  )
}

export default App
