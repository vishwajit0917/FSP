import React, { useContext } from 'react'
import Login from './pages/Login.jsx'
import { ToastContainer } from 'react-toastify'
import { AdminContext } from './context/AdminContext.jsx'
import { DoctorContext } from './context/DoctorContext.jsx'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import { Route, Routes } from 'react-router-dom'
import AddDoctor from './pages/Admin/AddDoctor.jsx'
import DoctorsList from './pages/Admin/DoctorsList.jsx'
import AllAppointments from './pages/Admin/AllAppointments.jsx'
import Dashboard from './pages/Admin/Dashboard.jsx'
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx'
import DoctorAppointments from './pages/Doctor/DoctorAppointment.jsx'
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx'

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/* Admin routes */}
          <Route path='/' element={aToken ? <Dashboard /> : <DoctorDashboard />} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />

          {/* Doctor routes */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App