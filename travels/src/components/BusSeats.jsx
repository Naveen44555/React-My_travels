import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Busseats = ({token}) => {
    const [bus, setBus] = useState (null)
    const [seats, setSeats] = useState([]) //data multiple coming

    const {busId} =useParams()
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchBusDetails = async()=>{
            try{
                const response = await axios(`http://127.0.0.1:8000/api/buses/${busId}/`)
            setBus(response.data)
            setSeats(response.data.seats || [])
            }

            catch (error){
                console.log("error in fetching details")
             }
        }
        fetchBusDetails()
    },[busId])
    
    const handleBook = async (seatId) => {

    if (!token) {``
        alert("Please login for booking your seat")
        navigate('/login')
        return
    }

    try {
      const response =  await axios.post("http://127.0.0.1:8000/api/booking/",
            { seat:seatId },
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


  return (
    <div>
        {bus &&(
                <div>
                     <div>{bus.bus_name} </div>
                     <div>{bus.number} </div>
                     <div>{bus.origin} </div>
                     <div>{bus.destination} </div>
                     <div>{bus.start_time} </div>
                     <div>{bus.reach_time} </div>                           
                </div>
               
        )}
        <div>
           {seats.map((seat)=>{
    return(
        <div key={seat.id}>
            <button onClick={()=>handleBook(seat.id)} style={{color:seat.is_booked? "red":"green"}}>
                seat Number {seat.seat_number}
            </button>
        </div>
    )
})}

        </div>
      
    </div>
  )
}
export default Busseats
