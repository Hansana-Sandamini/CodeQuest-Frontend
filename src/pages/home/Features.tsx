import { Rocket, Trophy, Users } from "lucide-react" 

const features = [
    { icon: Rocket, title: "Learn by Doing", desc: "Hands-on projects and real-world challenges" },
    { icon: Trophy, title: "Earn Rewards", desc: "Level up and unlock achievements" },
    { icon: Users, title: "Join Community", desc: "Connect with fellow developers" },
]

const Features = () => {
    return (
        <section className="py-12 sm:py-16 md:py-20 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {features.map((item, i) => (
                    <div
                        key={i}
                        className="bg-gray-800/30 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 text-left"
                    >
                        <item.icon className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-green-400" /> 
                        <h3 className="font-bold text-base sm:text-lg mb-2">{item.title}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Features
