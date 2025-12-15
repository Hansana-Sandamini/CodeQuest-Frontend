import { ContactIcon } from "lucide-react"
import Button from "../../components/Button"

const Contact = () => {
    return (
        <section className="py-24 px-4">
            <div className="max-w-2xl mx-auto text-center">

                <div className="text-center mb-8">
                    <ContactIcon className="w-16 h-16 mx-auto text-green-400 mb-4" />
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        Get in Touch
                    </h2>
                </div>

                <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <form className="space-y-6">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full px-6 py-4 bg-gray-900/50 border border-gray-600 rounded-xl focus:border-green-500 focus:outline-none transition text-white placeholder-gray-500"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full px-6 py-4 bg-gray-900/50 border border-gray-600 rounded-xl focus:border-green-500 focus:outline-none transition text-white placeholder-gray-500"
                        />
                        <textarea
                            rows={6}
                            placeholder="Your Message"
                            className="w-full px-6 py-4 bg-gray-900/50 border border-gray-600 rounded-xl focus:border-green-500 focus:outline-none transition resize-none text-white placeholder-gray-500"
                        />
                        <Button type="submit">Send Message</Button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Contact
