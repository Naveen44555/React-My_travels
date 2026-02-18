import React, { useState , useEffect } from 'react'
import axios from 'axios'


const UserBookings = ({token, userId}) => {
    const [bookings, setBookings] = useState([])
    const [bookingError, setBookingError]  = useState(null)
useEffect (()=> {
    const fetchBookings = async ()=>{
        if (!token || !userId){
            return 
        }  
        try{
            const response = await axios.get(`http://127.0.0.1:8000/api/user/${userId}/bookings/`,
               {
                     headers:{
                        Authorization : `Token ${token}`
                    }
                }
            )
            console.log("Booking data =", response.data)
            setBookings(response.data)
            console.log("checking for user bookings =",response.data)
        }
        catch (error){
                console.log("Fetching details failed",error)
                setBookingError(
                    error.response?. data?. message
                )
          }
    }
    fetchBookings()
},[userId, token])
  return (
    <div>
         {bookingError && <p>{bookingError}</p>}

      {bookings.map((item)=>{
        return(
           <div key={item.id}>
        <div>User: {item.user}</div>
        <div>Bus: {item.bus?.bus_name}</div>
        <div>Bus Number: {item.bus?.number}</div>
        <div>Seat: {item.seat?.seat_number}</div>
        <div>Booking Time: {item.booking_time}</div>
        <hr />
      </div>
        )
      })}
    </div>
  )
}

export default UserBookings
