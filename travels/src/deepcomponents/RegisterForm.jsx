import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Confetti from 'react-confetti'

  
const RegisterForm = () => {

    const navigate = useNavigate()
    const [showConfetti, setShowConfetti] = useState(false)
    const [form, setform] = useState({
        username: '', email: '', password: ''
    })

    const [message, setmessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handlechange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await axios.post("https://travels-app-djangrf-main.onrender.com/api/register/", form)
            setShowConfetti(true)
            setmessage('Registration successful. Redirecting to login...')

            setTimeout(() => {
                navigate('/login')
            }, 1500)

        } catch (error) {
            if (error.response?.data?.username) {
                setmessage("You already have an account. Please login.")
            } else {
                setmessage("Registration failed. Try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }   // ✅ IMPORTANT: This closing brace was missing

    return (
       
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
             {showConfetti && <Confetti numberOfPieces={250} recycle={false} />}
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                <div>
                    <div className="text-center mt-4">
    <button
        type="button"
        onClick={() => navigate('/login')}
        className="text-emerald-600 hover:underline text-sm font-medium"
    >
        ← Back to Login
    </button>
</div>

                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join us for a seamless travel experience
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}  autoComplete="off">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handlechange}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                                placeholder="Choose a username"
                                required  autoComplete="off"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handlechange}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your email"
                                required autoComplete='off'
                                
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handlechange}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                                placeholder="Create a password"
                                required autoComplete='new-password'
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Register'}
                        </button>
                    </div>

                    {message && (
                        <div className={`text-center p-3 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}
                    
                </form>
            </div>
        </div>
    )
}

export default RegisterForm
