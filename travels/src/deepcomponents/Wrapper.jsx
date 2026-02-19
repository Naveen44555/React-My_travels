import React,{useState} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bus, LogOut, User, Ticket } from 'lucide-react'


const Wrapper = ({ token, handleLogout, children }) => {
    const location = useLocation()
   const [logoutMessage, setLogoutMessage] = useState("")
   const [menuOpen, setMenuOpen] = useState(false)


   const logout = () => {
    handleLogout()
   setLogoutMessage("You are logged out successfully")
setTimeout(() => setLogoutMessage(""), 2000)
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

      {/* Left Side (Mobile Menu + Logo) */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Bus className="h-8 w-8 text-indigo-600" />
          <span className="font-bold text-gray-900">BusTravels</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      {/* Right Side (Logout always visible) */}
<div className="flex items-center gap-3">

  {/* Desktop Links */}
  <div className="hidden md:flex items-center gap-4">
<Link
  to="/"
  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
    ${isActive('/')
      ? 'bg-indigo-500 text-white'
      : 'text-gray-700 hover:bg-gray-100'
    }`}
>
  Home
</Link>


    {token && (
      <Link
  to="/my-bookings"
  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
    ${isActive('/my-bookings')
      ? 'bg-indigo-600 text-white'
      : 'text-gray-700 hover:bg-gray-100'
    }`}
>
  My Bookings
</Link>

    )}

  </div>

  {/* Logout / Login Button (Visible on all screens) */}
  {token ? (
    <button
      onClick={logout}
      className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg text-sm"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  ) : (
    <Link to="/login">
      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
        Login
      </button>
    </Link>
  )}

</div>

    </div>
  </div>
</nav>

                
                {/* Mobile Dropdown */}
{menuOpen && (
    <div className="md:hidden fixed top-16 left-0 w-full bg-white shadow-lg px-4 py-4 space-y-3 z-50">

        <Link
            to="/"
            className={`block px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200
                ${isActive('/')
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 shadow-sm hover:bg-indigo-50 hover:border-indigo-400'
                }`}
            onClick={() => setMenuOpen(false)}
        >
            Home
        </Link>

        {token && (
            <Link
                to="/my-bookings"
                className={`block px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200
                    ${isActive('/my-bookings')
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 shadow-sm hover:bg-indigo-50 hover:border-indigo-400'
                    }`}
                onClick={() => setMenuOpen(false)}
            >
                My Bookings
            </Link>
        )}
    </div>
)}

            {logoutMessage && (
                <div className="fixed top-20 right-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    {logoutMessage}
                </div>
            )}

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