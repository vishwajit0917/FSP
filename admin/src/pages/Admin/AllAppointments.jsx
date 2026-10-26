
import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const AllAppointments = () => {

  const { aToken, appointments, getAllAppointments } = useContext(AdminContext)

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

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>

        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b font-medium'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Status</p>
        </div>

        {appointments.map((item, index) => {

          // Cancelled appointments should remain Cancelled
          // Completed appointments should show Paid
          // Otherwise, check the actual payment status
          const paymentStatus = item.cancelled
            ? 'Cancelled'
            : item.isCompleted
              ? 'Paid'
              : item.payment
                ? 'Paid'
                : 'Pending'

          return (
            <div
              className='grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center gap-1 py-3 px-6 border-b text-gray-600 hover:bg-gray-50'
              key={item._id || index}
            >
              <p className='hidden sm:block'>{index + 1}</p>

              <div className='flex items-center gap-2'>
                <img
                  className='w-8 h-8 rounded-full object-cover'
                  src={item.userData?.image}
                  alt=""
                />
                <p>{item.userData?.name}</p>
              </div>

              <p className='hidden sm:block'>
                {calculateAge(item.userData?.dob)}
              </p>

              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>

              <div className='flex items-center gap-2'>
                <img
                  className='w-8 h-8 rounded-full object-cover bg-gray-200'
                  src={item.docData?.image}
                  alt=""
                />
                <p>{item.docData?.name}</p>
              </div>

              <p>₹{item.amount}</p>

              <p className={
                paymentStatus === 'Cancelled'
                  ? 'text-red-500'
                  : paymentStatus === 'Paid'
                    ? 'text-green-600'
                    : 'text-gray-500'
              }>
                {paymentStatus}
              </p>
            </div>
          )
        })}

      </div>
    </div>
  )
}

export default AllAppointments