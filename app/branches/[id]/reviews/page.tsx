'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Review {
    id: string
    overallRating: number
    tasteRating?: number
    serviceRating?: number
    ambienceRating?: number
    cleanlinessRating?: number
    valueRating?: number
    reviewText: string
    visitType: string
    tableNumber?: string
    guestName?: string
    guestPhone?: string
    staffReply?: string
    staffReplyAt?: string
    createdAt: string
    user?: {
        name: string
    }
}

interface Branch {
    id: string
    name: string
    address: string
    city: string
    state: string
}

export default function BranchReviewsPage() {
    const params = useParams()
    const branchId = params.id as string

    const [branch, setBranch] = useState<Branch | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [branchId])

    const fetchData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

            // Fetch branch details
            const branchRes = await fetch(`${apiUrl}/api/branches/${branchId}`)
            const branchData = await branchRes.json()

            if (branchData.success) {
                setBranch(branchData.data)
            }

            // Fetch reviews for this branch
            const reviewsRes = await fetch(`${apiUrl}/api/reviews?branchId=${branchId}`)
            const reviewsData = await reviewsRes.json()

            if (reviewsData.success) {
                setReviews(reviewsData.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getRatingEmoji = (rating: number) => {
        switch (rating) {
            case 1: return '😠'
            case 2: return '☹️'
            case 3: return '😐'
            case 4: return '🙂'
            case 5: return '😍'
            default: return '⭐'
        }
    }

    if (loading) {
        return (
            <div className="container-custom py-12">
                <div className="spinner w-12 h-12 border-4 border-gray-200 border-t-orange-600 rounded-full mx-auto"></div>
            </div>
        )
    }

    if (!branch) {
        return (
            <div className="container-custom py-12">
                <p className="text-center text-gray-600">Branch not found</p>
            </div>
        )
    }

    return (
        <div className="container-custom py-12 fade-in">
            <div className="mb-8">
                <Link href="/branches" className="text-orange-600 hover:underline mb-4 inline-block">
                    ← Back to Branches
                </Link>
                <h1 className="mb-2">{branch.name} - Reviews</h1>
                <p className="text-gray-600">{branch.address}, {branch.city}, {branch.state}</p>
                <p className="text-sm text-gray-500 mt-2">{reviews.length} total reviews</p>
            </div>

            <div className="mb-6">
                <Link href={`/reviews/new?branchId=${branchId}`} className="btn-primary">
                    Write a Review
                </Link>
            </div>

            {reviews.length === 0 ? (
                <div className="card p-12 text-center">
                    <p className="text-gray-500 text-lg mb-4">No reviews yet for this branch</p>
                    <Link href={`/reviews/new?branchId=${branchId}`} className="btn-primary inline-block">
                        Be the first to review!
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="card p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-lg">
                                            {review.guestName || review.user?.name || 'Anonymous'}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${review.visitType === 'DINE_IN' ? 'bg-blue-100 text-blue-800' :
                                                review.visitType === 'TAKEAWAY' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {review.visitType === 'DINE_IN' ? '🍽️ Dine-in' :
                                                review.visitType === 'TAKEAWAY' ? '🥡 Takeaway' :
                                                    '🛵 Delivery'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        {review.tableNumber && ` • Table: ${review.tableNumber}`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                    <span className="text-2xl">{getRatingEmoji(review.overallRating)}</span>
                                    <span className="font-bold text-gray-900">{review.overallRating}/5</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-gray-700 whitespace-pre-wrap">{review.reviewText}</p>
                            </div>

                            {(review.tasteRating || review.serviceRating || review.ambienceRating ||
                                review.cleanlinessRating || review.valueRating) && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        {review.tasteRating && <div>Taste: {review.tasteRating}/5</div>}
                                        {review.serviceRating && <div>Service: {review.serviceRating}/5</div>}
                                        {review.ambienceRating && <div>Ambience: {review.ambienceRating}/5</div>}
                                        {review.cleanlinessRating && <div>Cleanliness: {review.cleanlinessRating}/5</div>}
                                        {review.valueRating && <div>Value: {review.valueRating}/5</div>}
                                    </div>
                                )}

                            {review.staffReply && (
                                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mt-4">
                                    <p className="text-sm font-semibold text-orange-900 mb-1">Response from Perambur Srinivasa:</p>
                                    <p className="text-orange-800">{review.staffReply}</p>
                                    {review.staffReplyAt && (
                                        <p className="text-xs text-orange-600 mt-2">
                                            Replied on {new Date(review.staffReplyAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
