import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const slotDateFormat = (slotDate) => {
  const [day, month, year] = slotDate.split('_')
  return `${day} ${months[Number(month)]} ${year}`
}

const StatCard = ({ icon, value, label }) => (
  <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded border border-gray-100 cursor-pointer hover:scale-105 transition-all'>
    <div className='bg-indigo-50 rounded p-2'>
      <img className='w-12' src={icon} alt="" />
    </div>
    <div>
      <p className='text-xl font-semibold text-gray-600'>{value}</p>
      <p className='text-gray-400'>{label}</p>
    </div>
  </div>
)

const Dashboard = () => {
  const { aToken, dashData, getDashData, cancelAppointment } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  if (!dashData) return <p className='m-5'></p>

  return (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <StatCard icon={assets.doctor_icon} value={dashData.doctors} label='Doctors' />
        <StatCard icon={assets.appointments_icon} value={dashData.appointments} label='Appointments' />
        <StatCard icon={assets.patients_icon} value={dashData.patients} label='Patients' />
      </div>

      <div className='bg-white mt-10 rounded border'>
        <div className='flex items-center gap-2.5 px-4 py-4 border-b'>
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div>
          {dashData.latestAppointments.length === 0 && (
            <p className='px-6 py-4 text-gray-400 text-sm'>
              No bookings yet
            </p>
          )}

          {dashData.latestAppointments.map((item, index) => (
            <div
              className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100'
              key={item._id || index}
            >
              <img
                className='rounded-full w-10 h-10 object-cover bg-gray-200'
                src={item.docData?.image}
                alt=""
              />

              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>
                  {item.docData?.name}
                </p>
                <p className='text-gray-600'>
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>
              </div>

              {item.cancelled ? (
                <p className='text-red-400 text-xs font-medium'>
                  Cancelled
                </p>
              ) : item.isCompleted ? (
                <p className='text-green-600 text-xs font-medium'>
                  Completed
                </p>
              ) : (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className='text-xs text-red-500 border border-red-300 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition-all'
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
