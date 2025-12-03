'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex items-center justify-between h-20 sm:h-24">
                    {/* Spacer for mobile to center logo */}
                    <div className="md:hidden w-10"></div>

                    {/* Centered Logo */}
                    <Link href="/" className="flex items-center justify-center flex-1 md:flex-none">
                        <Image
                            src="/logo-new.png"
                            alt="Perambur Srinivasa"
                            width={280}
                            height={100}
                            className="h-16 sm:h-20 w-auto object-contain"
                            priority
                            unoptimized
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/reviews/new" className="btn-primary">
                            Feedback and Complaint Form
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <Link href="/reviews/new" className="block px-4 py-2 text-orange-600 font-medium hover:bg-orange-50 rounded-lg">
                            Feedback and Complaint Form
                        </Link>
                    </div>
                )}
            </div>
        </header>
    )
}
