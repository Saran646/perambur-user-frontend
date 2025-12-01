'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const CATEGORIES = ['SWEETS', 'SNACKS', 'SAVOURIES', 'COOKIES', 'PODI', 'THOKKU', 'PICKLE', 'GIFT_HAMPER']

export default function MenuPage() {
    const [dishes, setDishes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>('')

    useEffect(() => {
        loadMenu()
    }, [selectedCategory])

    const loadMenu = async () => {
        try {
            const result = await api.getMenus(selectedCategory || undefined)
            if (result.success) {
                setDishes(result.data)
            }
        } catch (error) {
            console.error('Failed to load menu:', error)
        } finally {
            setLoading(false)
        }
    }

    const groupedDishes = dishes.reduce((acc, dish) => {
        if (!acc[dish.category]) {
            acc[dish.category] = []
        }
        acc[dish.category].push(dish)
        return acc
    }, {} as Record<string, any[]>)

    if (loading) {
        return (
            <div className="container-custom py-12">
                <div className="spinner w-12 h-12 border-4 border-gray-200 border-t-orange-600 rounded-full mx-auto"></div>
            </div>
        )
    }

    return (
        <div className="container-custom py-12 fade-in">
            <h1 className="mb-4">Our Menu</h1>
            <p className="text-gray-600 mb-8">
                Explore our wide range of traditional sweets, snacks, and more.
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
                <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-lg ${!selectedCategory ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                    All
                </button>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg ${selectedCategory === cat ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        {cat.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Menu Items */}
            <div className="space-y-12">
                {Object.entries(groupedDishes).map(([category, items]) => (
                    <div key={category}>
                        <h2 className="text-2xl font-bold mb-6 text-orange-900 border-b-2 border-orange-200 pb-2">
                            {category.replace('_', ' ')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((dish: any) => (
                                <div key={dish.id} className="card p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg">{dish.name}</h3>
                                        <span className="text-orange-600 font-bold">₹{dish.price}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{dish.description}</p>
                                    {dish.branch && (
                                        <p className="text-xs text-gray-500 mt-2">📍 {dish.branch.name}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {dishes.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No items found in this category.</p>
                </div>
            )}
        </div>
    )
}
