import { Link } from "react-router-dom"
import Button from "../../components/Button"

const Hero = () => {
    return (
        <section className="flex items-center justify-center px-4 py-12 sm:py-16 md:py-20 lg:py-24 lg:py-32">
            <div className="text-center max-w-4xl">
                <div className="mb-6 sm:mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-600 to-blue-500 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-2xl shadow-purple-500/20">
                        <span className="text-xl sm:text-2xl font-bold">⚡</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4 sm:mb-6">
                        CodeQuest
                    </h1>
                </div>

                <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
                    Embark on your coding adventure! Master new skills, solve challenges, and join a community of passionate developers.
                </p>
                                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                    <Link to="/register">
                        <Button className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base w-full sm:w-auto">
                            Start Your Journey
                        </Button>
                    </Link>
                    <Link to="/about">
                        <button className="border border-gray-600 hover:border-green-500 text-gray-300 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-gray-800/50 w-full sm:w-auto text-sm sm:text-base">
                            Learn More
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Hero
