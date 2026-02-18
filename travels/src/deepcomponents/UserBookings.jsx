import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Calendar, Bus, MapPin, Clock, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const UserBookings = ({ token, userId }) => {
    const [bookings, setBookings] = useState([])
    const [bookingError, setBookingError] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBookings = async () => {
            if (!token || !userId) {
                setLoading(false)
                return
            }

            try {
                const response = await axios.get(`https://travels-app-djangrf-main.onrender.com/api/user/${userId}/bookings/`,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    }
                )
                setBookings(response.data)
                setLoading(false)
            } catch (error) {
                console.log("Fetching details failed", error)
                setBookingError(error.response?.data?.message || "Failed to fetch bookings")
                setLoading(false)
            }
        }
        fetchBookings()
    }, [userId, token])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (!token || !userId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Logged In</h2>
                    <p className="text-gray-600 mb-4">Please login to view your bookings</p>
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                        <Calendar className="h-8 w-8 text-indigo-600" />
                        My Bookings
                    </h1>
                    <p className="mt-2 text-gray-600">View all your bus ticket bookings</p>
                </div>

                {bookingError && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        {bookingError}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
                        <p className="text-gray-600 mb-6">You haven't made any bus bookings yet.</p>
                        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            Browse Buses
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-100 p-3 rounded-lg">
                                                <Bus className="h-6 w-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{item.bus?.bus_name}</h3>
                                                <p className="text-sm text-gray-500">Bus Number: {item.bus?.number}</p>
                                            </div>
                                        </div>
                                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                            Confirmed Ticket
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="h-4 w-4 text-green-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">From</p>
                                                <p className="text-sm font-medium">{item.bus?.origin}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="h-4 w-4 text-red-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">To</p>
                                                <p className="text-sm font-medium">{item.bus?.destination}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="h-4 w-4 text-blue-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">Departure</p>
                                                <p className="text-sm font-medium">{item.bus?.start_time}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 mt-2">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Seat Number</p>
                                                    <p className="text-lg font-bold text-indigo-600">Seat {item.seat?.seat_number}</p>
                                                </div>
                                                <div className="h-8 w-px bg-gray-300"></div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Booking Time</p>
                                                    <p className="text-sm font-medium">{new Date(item.booking_time).toLocaleString()}</p>
                                                </div>
                                            </div>
                                           <button
    type="button"
    onClick={() => navigate(`/bus/${item.bus.id}`)}
    className="px-4 py-2 border border-red-600 text-blue-600 rounded-lg hover:bg-yellow-50 transition-all duration-200 text-sm font-medium hover:-translate-y-1 hover:shadow-md">Available Ticket
</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserBookings