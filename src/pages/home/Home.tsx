import About from "./About"
import Contact from "./Contact"
import Features from "./Features"
import Hero from "./Hero"
import HomeFooter from "./HomeFooter"

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
            {/* Hero Section */}
            <section id="home">  
                <Hero />
            </section>

            {/* Features */}
            <Features />

            {/* About Section */}
            <section id="about" className="py-24">
                <About />
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24">
                <Contact />
            </section>

            <HomeFooter />
        </div>
    )
}

export default Home
