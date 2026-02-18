import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



const LoginForm = ({ onlogin }) => {
    const navigate = useNavigate()
    const [form, setform] = useState({
        username: '', password: ''
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
            const response = await axios.post("https://travels-app-djangrf-main.onrender.com/api/login/", form)
            setmessage('Login success')
            if (onlogin) {
                onlogin(response.data.token, response.data.user_id)
            }
            navigate('/')
        } catch (error) {
            setmessage("Login failed")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                <div>
    <h2 className="text-center text-3xl font-extrabold text-gray-900">
        Login Form
    </h2>

                    <div className="flex mt-6 bg-gray-100 rounded-lg p-1">
                        <button className="flex-1 py-2 rounded-lg bg-indigo-600 text-white font-medium">
                            Login
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/register/')}
                            className="flex-1 py-2 rounded-lg text-gray-600 font-medium"
                        >
                            Signup
                        </button>
                    </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your username"
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
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your password"
                                required autoComplete='new-password'
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Log In'}
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

export default LoginForm