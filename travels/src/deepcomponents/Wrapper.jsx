import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bus, LogOut, User, Ticket } from 'lucide-react'

const Wrapper = ({ token, handleLogout, children }) => {
    const location = useLocation()
    
    const logout = () => {
        handleLogout()
    }

    const isActive = (path) => {
        return location.pathname === path
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <Bus className="h-8 w-8 text-indigo-600" />
                            <span className="text-xl font-bold text-gray-900">BusTravels</span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                    ${isActive('/') 
                                        ? 'bg-indigo-100 text-indigo-700' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                Home
                            </Link>
                            
                            {token ? (
                                <>
                                    <Link
                                        to="/my-bookings"
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                            ${isActive('/my-bookings') 
                                                ? 'bg-indigo-100 text-indigo-700' 
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Ticket className="h-4 w-4" />
                                        My Bookings
                                    </Link>
                                    
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/login">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium">
                                        <User className="h-4 w-4" />
                                        Login
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="py-6">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-gray-500 text-sm">
                        © 2024 BusTravels. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Wrapper