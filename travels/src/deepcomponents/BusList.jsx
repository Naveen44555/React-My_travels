import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { 
    Bus, 
    MapPin, 
    Clock, 
    ArrowRight, 
    Search, 
    Filter,
    Calendar,
    Users,
    X,
    ChevronDown,
    Star
} from 'lucide-react'

const BusList = () => {
    const [buses, setBuses] = useState([])
    const [filteredBuses, setFilteredBuses] = useState([])
    const [loading, setLoading] = useState(true)
    const [showFilters, setShowFilters] = useState(false)
    
    // Search filters state
    const [filters, setFilters] = useState({
        from: '',
        to: '',
        date: '',
        passengers: 1,
        busType: 'all', // all, ac, non-ac, sleeper, seater
        departureTime: 'all', // all, morning, afternoon, evening, night
        sortBy: 'departure' // departure, price, duration, rating
    })

    // Unique locations for dropdown
    const [locations, setLocations] = useState([])
    const [suggestions, setSuggestions] = useState({
        from: [],
        to: []
    })

    const navigate = useNavigate()

    useEffect(() => {
        const fetchbuses = async () => {
            try {
                const response = await axios.get("https://travels-app-djangrf-main.onrender.com/api/buses")
                setBuses(response.data)
                setFilteredBuses(response.data)
                
                // Extract unique locations
                const uniqueLocations = [...new Set(response.data.flatMap(bus => [bus.origin, bus.destination]))]
                setLocations(uniqueLocations)
                
                setLoading(false)
            } catch (error) {
                console.log("error in fetching buses", error)
                setLoading(false)
            }
        }
        fetchbuses()
    }, [])

    // Handle input change for from/to fields with suggestions
    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({ ...prev, [name]: value }))

        // Show suggestions
        if (name === 'from' || name === 'to') {
            const filtered = locations.filter(loc => 
                loc.toLowerCase().includes(value.toLowerCase())
            )
            setSuggestions(prev => ({ ...prev, [name]: filtered }))
        }
    }

    // Select suggestion
    const selectSuggestion = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }))
        setSuggestions(prev => ({ ...prev, [field]: [] }))
    }

    // Clear filters
    const clearFilters = () => {
        setFilters({
            from: '',
            to: '',
            date: '',
            passengers: 1,
            busType: 'all',
            departureTime: 'all',
            sortBy: 'departure'
        })
        setFilteredBuses(buses)
    }

    // Apply filters
    const applyFilters = () => {
        let result = [...buses]

        // Filter by from location
        if (filters.from) {
            result = result.filter(bus => 
                bus.origin.toLowerCase().includes(filters.from.toLowerCase())
            )
        }

        // Filter by to location
        if (filters.to) {
            result = result.filter(bus => 
                bus.destination.toLowerCase().includes(filters.to.toLowerCase())
            )
        }

        // Filter by bus type (you'll need to add bus_type field to your API)
        if (filters.busType !== 'all') {
            result = result.filter(bus => 
                bus.bus_type?.toLowerCase() === filters.busType.toLowerCase()
            )
        }

        // Filter by departure time
        if (filters.departureTime !== 'all') {
            result = result.filter(bus => {
                const hour = parseInt(bus.start_time?.split(':')[0] || '0')
                
                switch(filters.departureTime) {
                    case 'morning': return hour >= 5 && hour < 12
                    case 'afternoon': return hour >= 12 && hour < 17
                    case 'evening': return hour >= 17 && hour < 21
                    case 'night': return hour >= 21 || hour < 5
                    default: return true
                }
            })
        }

        // Apply sorting
        result = sortBuses(result, filters.sortBy)

        setFilteredBuses(result)
    }

    // Sort buses
    const sortBuses = (busesToSort, sortBy) => {
        switch(sortBy) {
            case 'departure':
                return [...busesToSort].sort((a, b) => 
                    (a.start_time || '').localeCompare(b.start_time || '')
                )
            case 'price':
                return [...busesToSort].sort((a, b) => 
                    (a.price || 0) - (b.price || 0)
                )
            case 'duration':
                return [...busesToSort].sort((a, b) => {
                    const durationA = calculateDuration(a.start_time, a.reach_time)
                    const durationB = calculateDuration(b.start_time, b.reach_time)
                    return durationA - durationB
                })
            case 'rating':
                return [...busesToSort].sort((a, b) => 
                    (b.rating || 0) - (a.rating || 0)
                )
            default:
                return busesToSort
        }
    }

    // Calculate journey duration
    const calculateDuration = (start, end) => {
        if (!start || !end) return 0
        const startHour = parseInt(start.split(':')[0])
        const startMin = parseInt(start.split(':')[1])
        const endHour = parseInt(end.split(':')[0])
        const endMin = parseInt(end.split(':')[1])
        
        let duration = (endHour * 60 + endMin) - (startHour * 60 + startMin)
        if (duration < 0) duration += 24 * 60 // Overnight journey
        return duration
    }

    // Format duration
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours}h ${mins}m`
    }

    // Handle search submit
    const handleSearch = (e) => {
        e.preventDefault()
        applyFilters()
    }

    const handleViewSeats = (id) => {
        navigate(`/bus/${id}`)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Search */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-center mb-4">
                        Find Your Perfect Journey
                    </h1>
                    <p className="text-center text-indigo-100 mb-8">
                        Search buses by route, date, and more
                    </p>

                    {/* Main Search Form */}
                    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* From */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    From
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="from"
                                        value={filters.from}
                                        onChange={handleFilterChange}
                                        placeholder="Leaving from"
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                    {suggestions.from.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                            {suggestions.from.map(loc => (
                                                <div
                                                    key={loc}
                                                    onClick={() => selectSuggestion('from', loc)}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                                                >
                                                    {loc}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* To */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    To
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="to"
                                        value={filters.to}
                                        onChange={handleFilterChange}
                                        placeholder="Going to"
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                    {suggestions.to.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                            {suggestions.to.map(loc => (
                                                <div
                                                    key={loc}
                                                    onClick={() => selectSuggestion('to', loc)}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                                                >
                                                    {loc}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Journey
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="date"
                                        name="date"
                                        value={filters.date}
                                        onChange={handleFilterChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Passengers */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Passengers
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <select
                                        name="passengers"
                                        value={filters.passengers}
                                        onChange={handleFilterChange}
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 appearance-none"
                                    >
                                        {[1,2,3,4,5,6].map(num => (
                                            <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="mt-4 flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                            >
                                <Search className="h-5 w-5" />
                                Search Buses
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium flex items-center gap-2"
                            >
                                <Filter className="h-5 w-5" />
                                Filters
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                                <X className="h-4 w-4" />
                                Clear all
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Bus Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bus Type
                                </label>
                                <select
                                    name="busType"
                                    value={filters.busType}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="all">All Types</option>
                                    <option value="ac">AC</option>
                                    <option value="non-ac">Non-AC</option>
                                    <option value="sleeper">Sleeper</option>
                                    <option value="seater">Seater</option>
                                </select>
                            </div>


                            {/* Departure Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Departure Time
                                </label>
                                <select
                                    name="departureTime"
                                    value={filters.departureTime}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="all">Any Time</option>
                                    <option value="morning">Morning (5AM - 12PM)</option>
                                    <option value="afternoon">Afternoon (12PM - 5PM)</option>
                                    <option value="evening">Evening (5PM - 9PM)</option>
                                    <option value="night">Night (9PM - 5AM)</option>
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort By
                                </label>
                                <select
                                    name="sortBy"
                                    value={filters.sortBy}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="departure">Departure Time</option>
                                    <option value="price">Price: Low to High</option>
                                    <option value="duration">Duration: Shortest First</option>
                                    <option value="rating">Rating: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Apply Filters Button */}
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={applyFilters}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Available Buses
                        {filters.from && filters.to && (
                            <span className="text-lg font-normal text-gray-600 ml-2">
                                from {filters.from} to {filters.to}
                            </span>
                        )}
                    </h2>
                    <p className="text-gray-600">
                        {filteredBuses.length} bus{filteredBuses.length !== 1 ? 'es' : ''} found
                    </p>
                </div>

               {/* Bus Cards */}
                
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {filteredBuses.map((item) => {
                        const duration = calculateDuration(item.start_time, item.reach_time)
                        
                        return (

             <div key={item.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between h-[280px]">
    {/* Top Section */}
    <div className="flex justify-between items-start">

        {/* Left: Logo + Name */}
        <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
                <Bus className="h-6 w-6 text-indigo-600" />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900">
                    {item.bus_name}
                </h3>
                <p className="text-sm text-gray-500">
                    Bus No: {item.number}
                </p>
            </div>
        </div>

        {/* Available Badge */}
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Available
        </span>
    </div>

    {/* Middle Section */}
    <div className="flex justify-between items-center mt-4">

        <div>
            <p className="text-xs text-gray-500">From</p>
            <p className="font-medium">{item.origin}</p>
            <p className="text-sm text-gray-600">{item.start_time}</p>
        </div>

         <div className="text-right">
            <p className="text-xs text-gray-500">To</p>
            <p className="font-medium">{item.destination}</p>
            <p className="text-sm text-gray-600">{item.reach_time}</p>
        </div>

        {/* Duration in Middle */}
        <div className="text-center">
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-base font-bold text-red-500">
                {formatDuration(
                    calculateDuration(item.start_time, item.reach_time)
                )}
            </p>
            <ArrowRight className="h-4 w-4 text-gray-400 mx-auto mt-1" />
        </div>

       
    </div>

    {/* Bottom Section */}
    <button
        onClick={() => handleViewSeats(item.id)}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2"
    >
        View Seats
        <ArrowRight className="h-4 w-4" />
    </button>

</div>

    
                        )
                    })}
                </div>

                {/* No Results */}
                {filteredBuses.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-md">
                        <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Buses Found</h3>
                        <p className="text-gray-600 mb-4">
                            {filters.from && filters.to 
                                ? `No buses available from ${filters.from} to ${filters.to}`
                                : 'Try adjusting your search filters'}
                        </p>
                        <button
                            onClick={clearFilters}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BusList