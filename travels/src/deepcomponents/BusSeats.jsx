import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { Bus, ArrowLeft, Clock, MapPin, Armchair as Chair } from 'lucide-react'

const Busseats = ({ token }) => {
    const [bus, setBus] = useState(null)
    const [seats, setSeats] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedSeat, setSelectedSeat] = useState(null)

    const { busId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBusDetails = async () => {
            try {
                const response = await axios(`https://travels-app-djangrf-main.onrender.com/api/buses/${busId}/`)
                console.log("Bus ID:", busId)

                setBus(response.data)
                setSeats(response.data.seats || [])
                setLoading(false)
            } catch (error) {
                console.log("error in fetching details")
                setLoading(false)
            }
        }
        fetchBusDetails()
    }, [busId])

    const handleBook = async (seatId) => {
        if (!token) {
            alert("Please login for booking your seat")
            navigate('/login')
            return
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/booking/",
                { seat: seatId },
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )
            alert("Booking successful")
            setSeats((prevSeats) =>
                prevSeats.map((seat) =>
                    seat.id === seatId
                        ? { ...seat, is_booked: true } : seat
                )
            )
        } catch (error) {
            alert(error.response?.data?.error || "Booking failed")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-0 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
         <button
    onClick={() => navigate('/')}
    className="group flex items-center border border-indigo-600 text-indigo-600 px-3 py-3 rounded-lg transition-all duration-300 hover:bg-indigo-600 hover:text-white hover:-translate-y-1 hover:shadow-lg mb-2">
    <ArrowLeft className="h-5 w-5 mr-1 transition-transform duration-300 group-hover:-translate-x-1" />
    Back to Buses List
</button>

                {bus && (
                    <>
                        {/* Bus Details Card */}
                        <div className="bg-white rounded-xl shadow-lg p-5 mb-3">
                            <div className="flex justify-between items-start mb-2">

                                {/* Left Side */}
                                <div className="flex items-center gap-3">
                                    <Bus className="h-8 w-8 text-indigo-600" />
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {bus.bus_name}
                                    </h1>
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                                        {bus.number}
                                    </span>
                                </div>

                                {/* Right Side - Ticket Cost */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Ticket Cost</p>
                                    <p className="font-bold text-purple-600 text-xl">
                                        ₹{bus.price}
                                    </p>
                                </div>

                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="h-5 w-5 text-green-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">From</p>
                                        <p className="font-medium">{bus.origin}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="h-5 w-5 text-red-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">To</p>
                                        <p className="font-medium">{bus.destination}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="h-5 w-5 text-blue-500" />
                                    <div>

                                        <p className="text-sm text-gray-500">Departure - Arrival</p>
                                        <p className="font-medium">{bus.start_time} - {bus.reach_time}</p>
                                    </div>
                                </div>
                        

                            </div>
                            
                        </div>

                        {/* Seat Selection */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Chair className="h-6 w-6 text-indigo-600" />
                                Select Your Seat
                            </h2>

                            {/* Seat Legend */}
                            <div className="flex gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-green-500 rounded-lg"></div>
                                    <span className="text-sm text-gray-600">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-red-500 rounded-lg"></div>
                                    <span className="text-sm text-gray-600">Booked</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-indigo-600 rounded-lg"></div>
                                    <span className="text-sm text-gray-600">Selected</span>
                                </div>
                            </div>

                            {/* Seat Grid */}
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                {seats.map((seat) => (
                                    <button
                                  key={seat.id}
                                        onClick={() => !seat.is_booked && handleBook(seat.id)}
                                        onMouseEnter={() => !seat.is_booked && setSelectedSeat(seat.id)}
                                        onMouseLeave={() => setSelectedSeat(null)}
                                        disabled={seat.is_booked}
                                        className={`
                                            relative p-3 rounded-lg text-sm font-medium transition-all duration-200
                                            ${seat.is_booked 
                                                ? 'bg-red-500 text-white cursor-not-allowed opacity-75' 
                                                : selectedSeat === seat.id
                                                    ? 'bg-indigo-600 text-white transform scale-105 shadow-lg'
                                                    : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-md'
                                            }
                                        `} >
                                        <Chair className="h-4 w-4 mx-auto mb-1" />
                                        {seat.seat_number}
                                    </button>
                                ))}
                            </div>

                            {/* Booking Info */}
                            <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
                                <p className="text-sm text-indigo-800">
                                    <span className="font-medium">Note:</span> Click on an available seat to book it. 
                                    You need to be logged in to book a seat.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Busseats