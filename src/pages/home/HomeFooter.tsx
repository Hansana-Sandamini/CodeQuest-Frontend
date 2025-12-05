import { Link } from "react-router-dom"

const HomeFooter = () => {
    return (
        <footer className="bg-gray-900/50 border-t border-gray-800 py-16 mt-24">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">

                {/* Logo + Description */}
                <div>
                    <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                        <div className="w-12 h-12 bg-linear-to-r from-green-600 to-blue-500 rounded-xl flex items-center justify-center">
                            <span className="text-2xl font-bold">⚡</span>
                        </div>
                        <span className="text-2xl font-bold bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            CodeQuest
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                    Level up your coding skills through epic challenges and real projects.
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><Link to="/quests" className="hover:text-green-400 transition">Quests</Link></li>
                        <li><Link to="/leaderboard" className="hover:text-green-400 transition">Leaderboard</Link></li>
                        <li><Link to="/about" className="hover:text-green-400 transition">About</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold text-white mb-4">Community</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-green-400 transition">Discord</a></li>
                        <li><a href="#" className="hover:text-green-400 transition">Twitter</a></li>
                        <li><a href="#" className="hover:text-green-400 transition">GitHub</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold text-white mb-4">Stay Updated</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Get the latest quests in your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-xs mx-auto md:mx-0">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-green-500 focus:outline-none text-sm"
                        />
                        <button className="px-6 py-3 bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl font-medium transition text-sm">
                            Subscribe
                        </button>
                    </div>
                </div>

            </div>

            {/* Bottom copyright */}
            <div className="mt-12 text-center text-gray-500 text-sm border-t border-gray-800 pt-8">
                © {new Date().getFullYear()} CodeQuest. Made with ❤️ and lots of Lightning
            </div>
        </footer>
    )
}

export default HomeFooter
