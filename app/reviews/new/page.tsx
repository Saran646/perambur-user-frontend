'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import EmojiRating from '@/components/ui/EmojiRating'
import Link from 'next/link'
import OrderTypeModal from '@/components/reviews/OrderTypeModal'
import { api } from '@/lib/api'

interface Branch {
    id: string
    name: string
    mapLink?: string  // Google Maps URL
    latitude?: number
    longitude?: number
}

function ReviewForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const branchIdParam = searchParams.get('branchId')

    const [branches, setBranches] = useState<Branch[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [showOrderTypeModal, setShowOrderTypeModal] = useState(true)
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [nearestBranchName, setNearestBranchName] = useState('')
    const [branchSearch, setBranchSearch] = useState('')
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    const [formData, setFormData] = useState({
        branchId: branchIdParam || '',
        guestName: '',
        visitDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        guestEmail: '',
        guestPhone: '',
        overallRating: 0,
        tasteRating: 0,
        serviceRating: 0,
        ambienceRating: 0,
        cleanlinessRating: 0,
        valueRating: 0,
        visitType: 'TAKEAWAY',
        whatLiked: '',
        whatImprove: '',
        wouldRecommend: '',
        tableNumber: '',
    })

    useEffect(() => {
        fetchBranches()

        // Check localStorage for stored visit type
        const storedVisitType = localStorage.getItem('visitType')
        if (storedVisitType) {
            setFormData(prev => ({ ...prev, visitType: storedVisitType }))
            setShowOrderTypeModal(false) // Don't show modal if preference exists
        } else {
            setShowOrderTypeModal(true) // Show modal only if no preference stored
        }
    }, [])

    const fetchBranches = async () => {
        try {
            const data = await api.getBranches()
            // Ensure data is an array
            if (Array.isArray(data)) {
                setBranches(data)
                // After fetching branches, try to get user location
                getUserLocation(data)
            } else {
                console.error('Branches data is not an array:', data)
                setBranches([])
            }
        } catch (err) {
            console.error('Failed to fetch branches:', err)
            setBranches([]) // Set empty array on error
        }
    }

    // Calculate distance between two coordinates using Haversine formula
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371 // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }

    // Extract coordinates from Google Maps URL
    const extractCoordsFromMapLink = (mapLink: string): { lat: number, lng: number } | null => {
        if (!mapLink) return null

        // Pattern 1: @lat,lng in URL (most common)
        const atPattern = /@(-?\d+\.\d+),(-?\d+\.\d+)/
        const atMatch = mapLink.match(atPattern)
        if (atMatch) {
            return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }
        }

        // Pattern 2: ?q=lat,lng or &q=lat,lng
        const qPattern = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/
        const qMatch = mapLink.match(qPattern)
        if (qMatch) {
            return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) }
        }

        // Pattern 3: /place/lat,lng or ll=lat,lng
        const placePattern = /(?:\/place\/|ll=)(-?\d+\.\d+),(-?\d+\.\d+)/
        const placeMatch = mapLink.match(placePattern)
        if (placeMatch) {
            return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) }
        }

        return null
    }

    // Get user location and find nearest branch
    const getUserLocation = (branchList: Branch[]) => {
        if (!navigator.geolocation) {
            console.log('Geolocation not supported')
            return
        }

        setLocationStatus('loading')

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude
                const userLon = position.coords.longitude

                // Find branches with coordinates (from mapLink or direct lat/lng)
                const branchesWithCoords = branchList.map(b => {
                    // Try to get coords from mapLink first, then fall back to direct coords
                    if (b.mapLink) {
                        const coords = extractCoordsFromMapLink(b.mapLink)
                        if (coords) {
                            return { ...b, latitude: coords.lat, longitude: coords.lng }
                        }
                    }
                    return b
                }).filter(b => b.latitude && b.longitude)

                if (branchesWithCoords.length === 0) {
                    setLocationStatus('error')
                    return
                }

                // Find nearest branch
                let nearestBranch = branchesWithCoords[0]
                let minDistance = calculateDistance(
                    userLat, userLon,
                    nearestBranch.latitude!, nearestBranch.longitude!
                )

                branchesWithCoords.forEach(branch => {
                    const distance = calculateDistance(
                        userLat, userLon,
                        branch.latitude!, branch.longitude!
                    )
                    if (distance < minDistance) {
                        minDistance = distance
                        nearestBranch = branch
                    }
                })

                // Auto-select nearest branch if no branch already selected
                if (!formData.branchId) {
                    setFormData(prev => ({ ...prev, branchId: nearestBranch.id }))
                    setNearestBranchName(nearestBranch.name)
                    setBranchSearch(nearestBranch.name)
                }
                setLocationStatus('success')
            },
            (error) => {
                console.log('Geolocation error:', error.message)
                setLocationStatus('error')
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        )
    }

    const handleOrderTypeSelect = (type: string) => {
        setFormData(prev => ({ ...prev, visitType: type }))
        localStorage.setItem('visitType', type)
        setShowOrderTypeModal(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (!formData.branchId) {
            setError('Please select a branch')
            setLoading(false)
            return
        }

        if (formData.overallRating === 0) {
            setError('Please provide an overall rating')
            setLoading(false)
            return
        }

        if (!formData.guestPhone) {
            setError('Please provide your phone number')
            setLoading(false)
            return
        }

        try {
            await api.submitReview(formData)
            setSuccess(true)
            // Removed auto-redirect to /branches which was causing 404
            // User can now click "Go to Dashboard" button manually
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.')
            setLoading(false)
        }
    }

    const getQuestionLabel = (key: string) => {
        const isDelivery = formData.visitType === 'DELIVERY'

        switch (key) {
            case 'serviceRating':
                return isDelivery ? 'Delivery Time & Service' : 'Service'
            case 'ambienceRating':
                return isDelivery ? 'Packaging Quality' : 'Ambience & Atmosphere'
            case 'cleanlinessRating':
                return isDelivery ? 'Food Hygiene' : 'Cleanliness'
            default:
                return key.replace('Rating', '')
        }
    }


    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12">
                <div className="container-custom">
                    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 text-center border-4 border-orange-200">
                        <div className="text-6xl mb-4 animate-bounce">✅🍽️</div>
                        <h2 className="text-2xl font-bold mb-2 text-orange-900">Review Submitted!</h2>
                        <p className="text-gray-600 mb-6">Thank you for sharing your experience with us! 🙏</p>
                        <div className="mb-6 text-4xl">🍛 🍕 🍜 🥘 🍱</div>
                        <Link href="/" className="btn-primary text-lg px-8 py-3 inline-block">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 relative overflow-hidden">
            {/* Animated Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Floating circles */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>

                {/* Food Icons */}
                <div className="text-9xl absolute top-10 left-10 transform rotate-12 opacity-10">🍛</div>
                <div className="text-8xl absolute top-40 right-20 transform -rotate-12 opacity-10">🍕</div>
                <div className="text-7xl absolute bottom-20 left-1/4 transform rotate-45 opacity-10">🍜</div>
                <div className="text-9xl absolute bottom-40 right-10 transform -rotate-45 opacity-10">🥘</div>
                <div className="text-8xl absolute top-1/2 left-10 transform rotate-12 opacity-10">🍱</div>
            </div>

            <OrderTypeModal
                isOpen={showOrderTypeModal}
                onSelect={handleOrderTypeSelect}
            />

            <div className="container-custom py-12 relative z-10">
                <div className={`max-w-3xl mx-auto transition-opacity duration-300 ${showOrderTypeModal ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="mb-2 text-orange-900 flex items-center gap-2">
                                <span className="text-4xl">📝</span>
                                Feedback Form
                            </h1>
                            <p className="text-gray-600">Share your delicious experience! 🍴</p>
                        </div>
                        <button
                            onClick={() => setShowOrderTypeModal(true)}
                            className="text-sm text-orange-600 font-medium hover:underline bg-orange-100 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                        >
                            {formData.visitType === 'DELIVERY' ? '🛵 Online Delivery' :
                                formData.visitType === 'TAKEAWAY' ? '🥡 Takeaway' :
                                    '🍽️ Dine in'} (Change)
                        </button>
                    </div>



                    {error && (
                        <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-md">
                            <span className="font-semibold">⚠️ {error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 border-4 border-orange-500 ring-4 ring-orange-200 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b-2 border-orange-100 pb-6">
                            <div className="md:col-span-2 bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
                                <h3 className="text-lg font-semibold mb-2 text-orange-900 flex items-center gap-2">
                                    <span>👤</span> Your Details
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">Please provide your details to help us reach out.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Name *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.guestName}
                                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Phone *</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    value={formData.guestPhone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '')
                                        if (value.length <= 10) {
                                            setFormData({ ...formData, guestPhone: value })
                                        }
                                    }}
                                    placeholder="10-digit mobile number"
                                    required
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    minLength={10}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Visit Date *</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={formData.visitDate}
                                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                                    max={new Date().toISOString().split('T')[0]} // Can't select future dates
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={formData.guestEmail}
                                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                Select Branch *
                                {locationStatus === 'loading' && (
                                    <span className="text-xs text-orange-600 animate-pulse">📍 Detecting location...</span>
                                )}
                                {locationStatus === 'success' && nearestBranchName && (
                                    <span className="text-xs text-green-600">✅ Nearest: {nearestBranchName}</span>
                                )}
                            </label>

                            <input
                                type="text"
                                className={`input-field ${locationStatus === 'success' && nearestBranchName ? 'border-green-400 ring-2 ring-green-100' : ''}`}
                                placeholder="Search for a branch..."
                                value={branchSearch}
                                onChange={(e) => {
                                    setBranchSearch(e.target.value)
                                    setFormData({ ...formData, branchId: '' }) // Clear selection while searching
                                    if (nearestBranchName) setNearestBranchName('')
                                }}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay to allow click
                                required={!formData.branchId}
                            />

                            {isSearchFocused && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-orange-200 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                                    {branches
                                        .filter(branch => {
                                            if (!branchSearch) return true
                                            const search = branchSearch.toLowerCase()
                                            const words = branch.name.toLowerCase().split(' ')
                                            // Match if search matches start of word 1 or word 2
                                            return words[0]?.startsWith(search) || words[1]?.startsWith(search)
                                        })
                                        .map(branch => (
                                            <button
                                                key={branch.id}
                                                type="button"
                                                className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors border-b border-orange-50 last:border-0"
                                                onClick={() => {
                                                    setFormData({ ...formData, branchId: branch.id })
                                                    setBranchSearch(branch.name)
                                                    setIsSearchFocused(false)
                                                }}
                                            >
                                                <div className="font-medium text-gray-900">{branch.name}</div>
                                                {branch.mapLink && <div className="text-xs text-gray-500">📍 View on map</div>}
                                            </button>
                                        ))
                                    }
                                    {branches.filter(branch => {
                                        if (!branchSearch) return true
                                        const search = branchSearch.toLowerCase()
                                        const words = branch.name.toLowerCase().split(' ')
                                        return words[0]?.startsWith(search) || words[1]?.startsWith(search)
                                    }).length === 0 && (
                                        <div className="px-4 py-3 text-sm text-gray-500 italic">No matching branches found...</div>
                                    )}
                                </div>
                            )}

                            {locationStatus === 'error' && (
                                <p className="text-xs text-gray-500 mt-1">📍 Unable to detect location. Please search manually.</p>
                            )}
                        </div>

                        {formData.visitType === 'DINE_IN' && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <label className="block text-sm font-medium mb-2">Table Number</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.tableNumber || ''}
                                    onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                                    placeholder="Enter your table number (e.g. T-12)"
                                />
                            </div>
                        )}

                        <input type="hidden" name="visitType" value={formData.visitType} />

                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
                            <label className="block text-sm font-medium mb-2 text-orange-900">Overall Rating *</label>
                            <div className="flex flex-col gap-1 sm:gap-2">
                                <div className="flex justify-center sm:justify-start">
                                    <EmojiRating
                                        rating={formData.overallRating}
                                        onChange={(rating) => setFormData({ ...formData, overallRating: rating })}
                                        size="lg"
                                    />
                                </div>
                                <div className="flex justify-center sm:justify-start gap-2 sm:gap-6 text-[10px] sm:text-sm text-gray-600 font-medium">
                                    <span className="text-center w-[42px] sm:w-16">Love it</span>
                                    <span className="text-center w-[42px] sm:w-16">Good</span>
                                    <span className="text-center w-[42px] sm:w-16">Average</span>
                                    <span className="text-center w-[42px] sm:w-16">Poor</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3">Detailed Ratings (Optional)</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                {[
                                    { key: 'serviceRating', label: getQuestionLabel('serviceRating') },
                                    { key: 'tasteRating', label: 'Taste Quality' },
                                    { key: 'ambienceRating', label: getQuestionLabel('ambienceRating') },
                                    { key: 'cleanlinessRating', label: getQuestionLabel('cleanlinessRating') },
                                    { key: 'valueRating', label: 'Value for Money' },
                                ].map(({ key, label }) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">{label}:</span>
                                        <EmojiRating
                                            rating={formData[key as keyof typeof formData] as number}
                                            onChange={(rating) => setFormData({ ...formData, [key]: rating })}
                                            size="sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* New Structured Feedback Questions */}
                        <div className="space-y-4 bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-orange-900">
                                    What did you like the most?
                                </label>
                                <textarea
                                    className="textarea-field"
                                    rows={4}
                                    value={formData.whatLiked}
                                    onChange={(e) => setFormData({ ...formData, whatLiked: e.target.value })}
                                    placeholder="Tell us what you enjoyed about your experience..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-orange-900">
                                    What can we improve?
                                </label>
                                <textarea
                                    className="textarea-field"
                                    rows={4}
                                    value={formData.whatImprove}
                                    onChange={(e) => setFormData({ ...formData, whatImprove: e.target.value })}
                                    placeholder="Help us serve you better by sharing areas where we can improve..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-3 text-orange-900">
                                    Would you recommend our restaurant to others? *
                                </label>
                                <div className="flex gap-4 flex-wrap">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="wouldRecommend"
                                            value="Yes"
                                            checked={formData.wouldRecommend === 'Yes'}
                                            onChange={(e) => setFormData({ ...formData, wouldRecommend: e.target.value })}
                                            className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                                            required
                                        />
                                        <span className="text-sm font-medium">Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="wouldRecommend"
                                            value="No"
                                            checked={formData.wouldRecommend === 'No'}
                                            onChange={(e) => setFormData({ ...formData, wouldRecommend: e.target.value })}
                                            className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                                        />
                                        <span className="text-sm font-medium">No</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="wouldRecommend"
                                            value="Maybe"
                                            checked={formData.wouldRecommend === 'Maybe'}
                                            onChange={(e) => setFormData({ ...formData, wouldRecommend: e.target.value })}
                                            className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                                        />
                                        <span className="text-sm font-medium">Maybe</span>
                                    </label>
                                </div>
                            </div>

                            {/* Thank You Message */}
                            <div className="mt-4 p-4 bg-white rounded-lg border-2 border-orange-300 text-center">
                                <p className="text-orange-900 font-semibold mb-1">Thank you for dining with us.</p>
                                <p className="text-sm text-gray-600">Your feedback helps us serve you better.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit Review'}
                            </button>
                            <Link href="/" className="btn-outline flex-1 text-center">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function NewReviewPage() {
    return (
        <Suspense fallback={<div className="container-custom py-12 text-center">Loading...</div>}>
            <ReviewForm />
        </Suspense>
    )
}
