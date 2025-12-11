import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'Perambur Srinivasa - South Indian Sweets & Snacks | 24+ Branches',
  description: 'Authentic South Indian sweets and snacks since 1981. Visit our 24+ branches across Chennai, Tiruvallur, and Tirupati. Share your feedback and help us serve you better.',
  keywords: ['South Indian sweets', 'Chennai sweets', 'Perambur Srinivasa', 'Indian snacks', 'Tamil Nadu sweets', 'restaurant feedback', 'customer reviews'],
  authors: [{ name: 'RST Technologies', url: 'mailto:rsttechnologies25@gmail.com' }],
  creator: 'RST Technologies',
  publisher: 'Perambur Srinivasa',
  metadataBase: new URL('https://perambursrinivasa.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://perambursrinivasa.com',
    title: 'Perambur Srinivasa - Authentic South Indian Sweets & Snacks',
    description: 'Share your dining experience at Perambur Srinivasa. 24+ branches serving authentic South Indian sweets and snacks since 1981.',
    siteName: 'Perambur Srinivasa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perambur Srinivasa - South Indian Sweets & Snacks',
    description: 'Authentic South Indian sweets and snacks since 1981. 24+ branches across Chennai, Tiruvallur, and Tirupati.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token_here', // Add when you verify in Search Console
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-LTK7GCR3NZ`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LTK7GCR3NZ', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable}`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
