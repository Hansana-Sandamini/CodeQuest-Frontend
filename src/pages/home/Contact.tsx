import { ContactIcon } from "lucide-react"
import Button from "../../components/Button"

const Contact = () => {
    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4">
            <div className="max-w-2xl mx-auto text-center">

                <div className="text-center mb-6 sm:mb-8">
                    <ContactIcon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto text-green-400 mb-3 sm:mb-4" />
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        Get in Touch
                    </h2>
                </div>

                <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl">
                    <form className="space-y-4 sm:space-y-6">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-900/50 border border-gray-600 rounded-xl focus:border-green-500 focus:outline-none transition text-white placeholder-gray-500 text-sm sm:text-base"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-900/50 border border-gray-600 rounded-xl focus:border-green-500 focus:outline-none transition text-white placeholder-gray-500 text-sm sm:text-base"
                        />
                        <textarea
                            rows={4}
                            placeholder="Your Message"
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-900/50 border border-gray-600 rounded-xl focus:border-green-500 focus:outline-none transition resize-none text-white placeholder-gray-500 text-sm sm:text-base"
                        />
                        <Button type="submit" className="py-3 sm:py-4 text-sm sm:text-base">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Contact
