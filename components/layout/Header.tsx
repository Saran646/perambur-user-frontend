'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex items-center justify-center h-28 sm:h-32 py-4">
                    {/* Centered Logo - Bigger and Clearer */}
                    <Link href="/" className="flex items-center justify-center">
                        <Image
                            src="/logo-new.png"
                            alt="Perambur Srinivasa"
                            width={450}
                            height={160}
                            className="h-24 sm:h-28 w-auto object-contain"
                            priority
                            unoptimized
                        />
                    </Link>
                </div>
            </div>
        </header>
    )
}
