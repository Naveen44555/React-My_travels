import React, { useState } from 'react'
import RegisterForm from './deepcomponents/RegisterForm'
import {Routes,Route} from 'react-router-dom'
import BusList from './deepcomponents/BusList'
import Busseats from './deepcomponents/BusSeats'
import UserBookings from './deepcomponents/UserBookings'
import Wrapper from './deepcomponents/Wrapper'
import LoginForm from './deepcomponents/Loginform'

import ProtectedRoute from './deepcomponents/ProtectedRoute'
import Confetti from 'react-confetti'


const App = () => {
   const[token, setToken] = useState(localStorage.getItem('token'))
    const [userId, setuserId] = useState(localStorage.getItem('userId'))
    const [showWelcome, setShowWelcome] = useState(false)

  // const handlelogin = (token, userId) =>{
  //   localStorage.setItem('token',token)  //token save in localstorage
  //   localStorage.setItem('userId',userId)
  // }

  // const handleLogout=()=>{
  //     localStorage.removeItem('token')
  //     localStorage.removeItem('userId')
  // }

  const handlelogin = (newToken, newUserId) =>{
    localStorage.setItem('token', newToken)
    localStorage.setItem('userId', newUserId)
    setToken(newToken)
    setuserId(newUserId)

      setShowWelcome(true)
       setTimeout(() => {
        setShowWelcome(false)
    }, 4000)
}

const handleLogout = () =>{
    localStorage.removeItem('token')
    localStorage.removeItem('userId')

    setToken(null)
    setuserId(null)
}
  return(
    <div>
      {/* <Wrapper handleLogout = {handleLogout} token={token}>
     <Routes>
      <Route path='/' element={<BusList />} />
      <Route path ='/register' element={<RegisterForm />}/>
      <Route path='/login' element = {<LoginForm onlogin = {handlelogin}/>} />
      <Route path='/login' element = {<LoginForm onlogin = {handlelogin}/>} />
      <Route path='/bus/:busId' element = {<Busseats token={token}/>} />
      <Route path='/my-bookings' element ={<UserBookings token={token} userId={userId}/>} />
     </Routes>
      </Wrapper> */}

  {showWelcome && (
  <>
    <Confetti
  numberOfPieces={350}
  recycle={false}
  width={window.innerWidth}
  height={window.innerHeight}
  style={{ position: "fixed", top: 0, left: 0, zIndex: 1 }}
/>

   <div className="fixed top-10 left-0 right-0 flex justify-center z-[9999] px-4">
  <div className="animate-slideDown
  bg-gradient-to-r from-yellow-400 to-red-500 
  text-white rounded-2xl shadow-2xl 
  px-6 py-4 text-center w-full max-w-md">

    <h2 className="text-lg sm:text-xl font-bold">
      🎉 Welcome to Bus App!
    </h2>

    <p className="text-sm mt-1">
      🚍✨ Plan It, Book It, Go Ahead ✨🚍
    </p>

  </div>
</div>


  </>
)}  

      <Wrapper handleLogout = {handleLogout} token={token}>
     <Routes>
       <Route path='/' element={
      <ProtectedRoute token={token}>
        <BusList />
      </ProtectedRoute>} />

          <Route path ='/register' element={<RegisterForm />}/>
     <Route path='/login' element={<LoginForm onlogin={handlelogin} />} />
     {/* <Route path='/bus/:busId' element={token ? <Busseats token={token}/> : <LoginForm onlogin={handlelogin} />} /> */}
       
       <Route path='/bus/:busId' element={<ProtectedRoute token={token}><Busseats token={token}/></ProtectedRoute>} />
  
    <Route path='/my-bookings' element={<ProtectedRoute token={token}><UserBookings token={token} userId={userId}/></ProtectedRoute>} />
     
     </Routes>
      </Wrapper>
    
    </div>
  )
}
export default App
