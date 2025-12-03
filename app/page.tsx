import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative bg-orange-900 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
          <div className="container-custom relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading leading-tight">
              Authentic South Indian <br />
              <span className="text-yellow-400">Sweets & Savouries</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-orange-100 max-w-2xl mx-auto">
              Serving tradition since 1981. Experience the divine taste of pure ghee sweets and crispy snacks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/reviews/new" className="btn-primary text-lg px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-orange-900 border-none">
                Feedback and Complaint Form
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6 rounded-xl bg-orange-50">
                <div className="text-4xl mb-4">🍯</div>
                <h3 className="text-xl font-bold mb-2">Pure Ghee Sweets</h3>
                <p className="text-gray-600">Made with 100% pure ghee and premium ingredients for that authentic taste.</p>
              </div>
              <div className="p-6 rounded-xl bg-orange-50">
                <div className="text-4xl mb-4">🌶️</div>
                <h3 className="text-xl font-bold mb-2">Traditional Snacks</h3>
                <p className="text-gray-600">Crispy murukku, mixture, and savouries made from generations-old recipes.</p>
              </div>
              <div className="p-6 rounded-xl bg-orange-50">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-xl font-bold mb-2">Gift Hampers</h3>
                <p className="text-gray-600">Perfectly curated sweet boxes for weddings, festivals, and special occasions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-orange-600 text-white text-center">
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Have you visited us recently?</h2>
            <p className="text-xl mb-8 opacity-90">Share your experience and help us serve you better.</p>
            <Link href="/reviews/new" className="btn-secondary text-lg px-8 py-3 bg-white text-orange-600 hover:bg-gray-100 border-none">
              Feedback and Complaint Form
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

