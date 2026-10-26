import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body

    const docData = await doctorModel.findById(docId)
    if (!docData) {
      return res.json({ success: false, message: 'Doctor not found' })
    }

    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
    res.json({ success: true, message: 'Availability changed' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email'])
    res.json({ success: true, doctors })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// api for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.json({ success: false, message: 'Missing details' })
    }

    const doctor = await doctorModel.findOne({ email })

    if (!doctor) {
      return res.json({ success: false, message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, doctor.password)

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// doctor's own appointments
const appointmentsDoctor = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ docId: req.docId })
    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// mark appointment completed
const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData || appointmentData.docId !== req.docId || appointmentData.cancelled) {
      return res.json({ success: false, message: 'Mark failed' })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
    res.json({ success: true, message: 'Appointment Completed' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// cancel appointment (doctor side)
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData || appointmentData.docId !== req.docId) {
      return res.json({ success: false, message: 'Cancellation failed' })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    // release the slot
    const { docId, slotDate, slotTime } = appointmentData
    const doctorData = await doctorModel.findById(docId)
    if (doctorData) {
      const slots_booked = doctorData.slots_booked || {}
      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime)
      }
      await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    }

    res.json({ success: true, message: 'Appointment Cancelled' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// dashboard data
const doctorDashboard = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ docId: req.docId })

    let earnings = 0
    appointments.forEach((item) => {
      if (!item.cancelled && (item.isCompleted || item.payment)) {
        earnings += item.amount
      }
    })

    const activeAppointments = appointments.filter((item) => !item.cancelled)
    const patients = new Set(activeAppointments.map((item) => item.userId))

    const dashData = {
      earnings,
      appointments: activeAppointments.length,
      patients: patients.size,
      latestAppointments: [...appointments].reverse().slice(0, 5),
    }

    res.json({ success: true, dashData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// doctor profile
const doctorProfile = async (req, res) => {
  try {
    const profileData = await doctorModel.findById(req.docId).select('-password')
    res.json({ success: true, profileData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// update doctor profile (fees, address, availability)
const updateDoctorProfile = async (req, res) => {
  try {
    const { fees, address, available } = req.body
    const update = {}
    if (fees !== undefined) update.fees = fees
    if (address !== undefined) update.address = address
    if (available !== undefined) update.available = available

    await doctorModel.findByIdAndUpdate(req.docId, update)
    res.json({ success: true, message: 'Profile Updated' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export {
  doctorList,
  changeAvailability,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile
}