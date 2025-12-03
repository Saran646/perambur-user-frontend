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

    const [formData, setFormData] = useState({
        branchId: branchIdParam || '',
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        overallRating: 0,
        tasteRating: 0,
        serviceRating: 0,
        ambienceRating: 0,
        cleanlinessRating: 0,
        valueRating: 0,
        visitType: 'TAKEAWAY',
        reviewText: '',
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
            } else {
                console.error('Branches data is not an array:', data)
                setBranches([])
            }
        } catch (err) {
            console.error('Failed to fetch branches:', err)
            setBranches([]) // Set empty array on error
        }
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

        if (formData.overallRating <= 3 && !formData.reviewText.trim()) {
            setError('Please describe your grievance (required for 1-3 star ratings)')
            setLoading(false)
            return
        }

        try {
            await api.submitReview(formData)
            setSuccess(true)
            setTimeout(() => {
                router.push(`/branches`)
            }, 2000)
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
                        <p className="text-gray-600">Thank you for sharing your experience with us! 🙏</p>
                        <div className="mt-4 text-4xl">🍛 🍕 🍜 🥘 🍱</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
            {/* Food Icons Background Decoration */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="text-9xl absolute top-10 left-10 transform rotate-12">🍛</div>
                <div className="text-8xl absolute top-40 right-20 transform -rotate-12">🍕</div>
                <div className="text-7xl absolute bottom-20 left-1/4 transform rotate-45">🍜</div>
                <div className="text-9xl absolute bottom-40 right-10 transform -rotate-45">🥘</div>
                <div className="text-8xl absolute top-1/2 left-10 transform rotate-12">🍱</div>
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
                            {formData.visitType === 'DELIVERY' ? '🛵 Delivery' : '🍽️ Dine-in / Takeaway'} (Change)
                        </button>
                    </div>

                    {formData.visitType !== 'DELIVERY' && (
                        <div className="flex justify-center mb-8">
                            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, visitType: 'DINE_IN' })}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${formData.visitType === 'DINE_IN'
                                        ? 'bg-white text-orange-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    🍽️ Dine-in
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, visitType: 'TAKEAWAY' })}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${formData.visitType === 'TAKEAWAY'
                                        ? 'bg-white text-orange-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    🥡 Takeaway
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-md">
                            <span className="font-semibold">⚠️ {error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-orange-500 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 border-4 border-orange-600 ring-2 ring-orange-400 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b-2 border-orange-400 pb-6">
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-semibold mb-2 text-white flex items-center gap-2">
                                    <span>👤</span> Your Details
                                </h3>
                                <p className="text-sm text-orange-100 mb-4">Please provide your details to help us reach out.</p>
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
                                <label className="block text-sm font-medium mb-2 text-white">Phone *</label>
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
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2 text-white">Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={formData.guestEmail}
                                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Select Branch *</label>
                            <select
                                className="input-field"
                                value={formData.branchId}
                                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                                required
                            >
                                <option value="">Choose a branch...</option>
                                {branches.map(branch => (
                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                ))}
                            </select>
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

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">Overall Rating *</label>
                            <div className="flex flex-col gap-1 sm:gap-2">
                                <div className="flex justify-center sm:justify-start">
                                    <EmojiRating
                                        rating={formData.overallRating}
                                        onChange={(rating) => setFormData({ ...formData, overallRating: rating })}
                                        size="lg"
                                    />
                                </div>
                                <div className="flex justify-center sm:justify-start gap-2 sm:gap-6 text-[10px] sm:text-sm text-gray-600 font-medium">
                                    <span className="text-center w-[42px] sm:w-16">Angry</span>
                                    <span className="text-center w-[42px] sm:w-16">Sad</span>
                                    <span className="text-center w-[42px] sm:w-16">OK</span>
                                    <span className="text-center w-[42px] sm:w-16">Good</span>
                                    <span className="text-center w-[42px] sm:w-16">Love it</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">Detailed Ratings (Optional)</label>
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

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {formData.overallRating > 0 && formData.overallRating <= 3
                                    ? 'What went wrong? (Required) *'
                                    : 'Your Review (Optional)'}
                            </label>
                            <textarea
                                className={`textarea-field ${formData.overallRating > 0 && formData.overallRating <= 3 ? 'border-red-300 focus:border-red-500' : ''}`}
                                rows={6}
                                value={formData.reviewText}
                                onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                                placeholder={formData.overallRating > 0 && formData.overallRating <= 3
                                    ? "Please tell us about your grievance so we can improve..."
                                    : "Share your experience..."}
                                required={formData.overallRating > 0 && formData.overallRating <= 3}
                            />
                            {formData.overallRating > 0 && formData.overallRating <= 3 && (
                                <p className="text-xs text-red-600 mt-1">
                                    * Grievance details are mandatory for low ratings.
                                </p>
                            )}
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
