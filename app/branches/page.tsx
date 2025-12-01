'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

export default function BranchesPage() {
    const [branches, setBranches] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const data = await api.getBranches()
                setBranches(data)
            } catch (error) {
                console.error('Error fetching branches:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBranches()
    }, [])

    if (loading) {
        return (
            <div className="container-custom py-12">
                <div className="spinner w-12 h-12 border-4 border-gray-200 border-t-orange-600 rounded-full mx-auto"></div>
            </div>
        )
    }

    return (
        <div className="container-custom py-12 fade-in">
            <h1 className="mb-4">Our Branches</h1>
            <p className="text-gray-600 mb-8">
                Find a Perambur Srinivasa branch near you. We operate 24+ locations across Chennai, Tiruvallur, and Tirupati.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {branches.map((branch) => (
                    <div key={branch.id} className="card p-6">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-2xl font-semibold mb-1">{branch.name}</h3>
                                <p className="text-gray-600">{branch.city}, {branch.state}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">
                                    ⭐ {branch.averageRating?.toFixed(1) || 'N/A'} ({branch._count?.reviews || 0} reviews)
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4 text-sm">
                            <p className="flex items-start gap-2">
                                <span>📍</span>
                                <span>{branch.address}</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <span>📞</span>
                                <a href={`tel:${branch.phone}`} className="text-orange-600 hover:underline">
                                    {branch.phone}
                                </a>
                            </p>
                            {branch.workingHours && (
                                <p className="flex items-center gap-2">
                                    <span>🕒</span>
                                    <span>{branch.workingHours}</span>
                                </p>
                            )}
                        </div>

                        {branch.mapLink && (
                            <div className="flex gap-2">
                                <a
                                    href={branch.mapLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary text-sm"
                                >
                                    View on Map
                                </a>
                                <Link
                                    href={`/branches/${branch.id}/reviews`}
                                    className="btn-primary text-sm"
                                >
                                    View Reviews
                                </Link>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
