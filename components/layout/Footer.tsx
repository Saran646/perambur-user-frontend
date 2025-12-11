import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-16">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Perambur Srinivasa</h3>
                        <p className="text-sm mb-4">
                            Serving authentic South Indian sweets and snacks since our inception.
                            Now operating 24+ branches across Chennai, Tiruvallur, and Tirupati.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/reviews/new" className="hover:text-orange-400 transition-colors">Feedback Form</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Policies</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-orange-400 transition-colors">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-2 text-sm">
                            <li>📞 +91 92824 45577</li>
                            <li>📞 +91 78239 99177</li>
                            <li>✉️ info@perambursrinivasa.com</li>
                            <li className="pt-2">
                                <p className="font-medium">Main Branch:</p>
                                <p>No 23/16 Perambur High Road,</p>
                                <p>Perambur, Chennai - 600011</p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-6">
                    <div className="text-center text-sm mb-3">
                        <p>&copy; {new Date().getFullYear()} Perambur Srinivasa. All rights reserved.</p>
                    </div>

                    {/* SEO-Optimized Developer Credit */}
                    <div className="text-center text-xs text-gray-500 space-y-1">
                        <p>
                            Website developed by{' '}
                            <a
                                href="mailto:rsttechnologies25@gmail.com"
                                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                                rel="nofollow"
                                itemProp="creator"
                                itemScope
                                itemType="https://schema.org/Organization"
                            >
                                <span itemProp="name">RST Technologies</span>
                                <meta itemProp="telephone" content="+91-9566261950" />
                                <meta itemProp="email" content="rsttechnologies25@gmail.com" />
                                <meta itemProp="areaServed" content="Tamil Nadu, Bangalore" />
                                <meta itemProp="description" content="Custom software development company specializing in web applications, restaurant management systems, and full-stack development services in Tamil Nadu and Bangalore" />
                            </a>
                        </p>
                        <p className="text-gray-600">
                            <span className="inline-block">Custom Software Development</span>
                            {' • '}
                            <span className="inline-block">Tamil Nadu & Bangalore</span>
                            {' • '}
                            <a href="tel:+919566261950" className="hover:text-orange-400 transition-colors">+91 95662 61950</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
