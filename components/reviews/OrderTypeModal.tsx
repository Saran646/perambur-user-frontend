'use client'

interface OrderTypeModalProps {
    isOpen: boolean
    onSelect: (type: string) => void
}

export default function OrderTypeModal({ isOpen, onSelect }: OrderTypeModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100 relative z-[10000]">
                <h2 className="text-2xl font-bold text-center mb-2">How did you order?</h2>
                <p className="text-gray-600 text-center mb-8">
                    Please select your order type to help us ask the right questions.
                </p>

                <div className="grid grid-cols-1 gap-4">
                    <button
                        onClick={() => onSelect('DINE_IN')}
                        className="group relative p-4 border-2 border-orange-100 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all text-left"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">🍽️</span>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-orange-700">
                                    Dine in
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Eating at the restaurant
                                </p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => onSelect('DELIVERY')}
                        className="group relative p-4 border-2 border-orange-100 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all text-left"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">🛵</span>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-orange-700">
                                    Online Delivery
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Ordered via Swiggy, Zomato, or Direct
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
