import { Rocket, Trophy, Users } from "lucide-react" 

const features = [
    { icon: Rocket, title: "Learn by Doing", desc: "Hands-on projects and real-world challenges" },
    { icon: Trophy, title: "Earn Rewards", desc: "Level up and unlock achievements" },
    { icon: Users, title: "Join Community", desc: "Connect with fellow developers" },
]

const Features = () => {
    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((item, i) => (
                    <div
                        key={i}
                        className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 text-left"
                    >
                        <item.icon className="w-10 h-10 mb-4 text-green-400" /> 
                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Features
