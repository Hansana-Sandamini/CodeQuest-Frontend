const Home = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 to-black text-white flex items-center justify-center px-4">
            <div className="text-center max-w-4xl">
                <div className="mb-8">
                    <div className="w-20 h-20 bg-linear-to-r from-green-600 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-purple-500/20">
                        <span className="text-2xl font-bold">⚡</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6">
                        CodeQuest
                    </h1>
                </div>
                
                <p className="text-gray-300 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                    Embark on your coding adventure! Master new skills, solve challenges, and join a community of passionate developers.
                </p>
                
                <div className="flex gap-4 justify-center flex-wrap">
                    <button className="bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                        Start Your Journey
                    </button>
                    <button className="border border-gray-600 hover:border-green-500 text-gray-300 hover:text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-gray-800/50">
                        Learn More
                    </button>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {[
                        { icon: "🚀", title: "Learn by Doing", desc: "Hands-on projects and real-world challenges" },
                        { icon: "🏆", title: "Earn Rewards", desc: "Level up and unlock achievements" },
                        { icon: "👥", title: "Join Community", desc: "Connect with fellow developers" }
                    ].map((item, index) => (
                        <div key={index} className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300">
                            <div className="text-2xl mb-3">{item.icon}</div>
                            <h3 className="font-bold text-lg mb-2 text-white">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home
