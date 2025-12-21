import { Laptop, Rocket, Sword } from "lucide-react"

const About = () => {
    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent text-center mb-8 sm:mb-12 md:mb-16">
                    About CodeQuest
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <div className="space-y-4 sm:space-y-6 text-gray-300">
                        <p className="text-base sm:text-lg leading-relaxed">
                            CodeQuest is more than just a learning platform — it's an <span className="text-green-400 font-semibold">adventure</span> designed to make you a better developer.
                        </p>
                        <p className="text-base sm:text-lg leading-relaxed">
                            We believe the best way to master programming is by <strong>solving real challenges</strong>, building projects, and collaborating with others.
                        </p>
                        <p className="text-base sm:text-lg leading-relaxed">
                            From bite-sized exercises to full-stack quests, every step earns you XP, badges, and unlocks new worlds of knowledge.
                        </p>

                        <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-10">
                            {["10K+", "50K+", "300+"].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${i === 0 ? "text-green-400" : i === 1 ? "text-blue-400" : "text-purple-400"}`}>
                                    {stat}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                    {i === 0 ? "Active Quests" : i === 1 ? "Developers" : "Challenges"}
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center mt-8 lg:mt-0">
                        <div className="relative w-full max-w-md">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-3xl blur-3xl -z-10"></div>
                            <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-3xl p-6 sm:p-8 md:p-12 text-center">
                                <div className="flex justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                                    <Rocket className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-green-400" />
                                    <Sword className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-blue-400" />
                                    <Laptop className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-purple-400" />
                                </div>
                                <p className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                                    Turn Code into an Epic Journey
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
