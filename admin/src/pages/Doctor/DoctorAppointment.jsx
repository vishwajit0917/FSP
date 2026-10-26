import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'

const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const slotDateFormat = (slotDate) => {
  const [day, month, year] = slotDate.split('_')
  return `${day} ${months[Number(month)]} ${year}`
}

const calculateAge = (dob) => {
  const birth = new Date(dob)
  if (isNaN(birth)) return 'N/A'
  return new Date().getFullYear() - birth.getFullYear()
}

const DoctorAppointment = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b font-medium'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.length === 0 && (
          <p className='px-6 py-4 text-gray-400'>No appointments yet</p>
        )}

        {appointments.map((item, index) => (
          <div className='grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center gap-1 py-3 px-6 border-b text-gray-600 hover:bg-gray-50' key={index}>
            <p className='hidden sm:block'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 h-8 rounded-full object-cover bg-gray-200' src={item.userData?.image} alt="" />
              <p>{item.userData?.name}</p>
            </div>
            <p className='text-xs border border-primary px-2 rounded-full w-fit'>
              {item.payment ? 'Online' : 'CASH'}
            </p>
            <p className='hidden sm:block'>{calculateAge(item.userData?.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p>₹{item.amount}</p>
            {item.cancelled ? (
              <p className='text-red-400 text-xs font-medium'>Cancelled</p>
            ) : item.isCompleted ? (
              <p className='text-green-500 text-xs font-medium'>Completed</p>
            ) : (
              <div className='flex gap-2'>
                <button onClick={() => cancelAppointment(item._id)} className='text-xs text-red-500 border border-red-300 px-2 py-1 rounded hover:bg-red-500 hover:text-white transition-all'>Cancel</button>
                <button onClick={() => completeAppointment(item._id)} className='text-xs text-green-600 border border-green-300 px-2 py-1 rounded hover:bg-green-500 hover:text-white transition-all'>Done</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorAppointment