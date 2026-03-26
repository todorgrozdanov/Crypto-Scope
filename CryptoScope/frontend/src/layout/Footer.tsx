import {Link} from "react-router-dom";

export default function Footer() {

    return (
        <footer className="mt-auto bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    <div className="lg:col-span-2">
                        <Link to="/" className="inline-block text-3xl font-bold mb-4">
                            Crypto<span
                            className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Scope</span>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Your ultimate platform for real-time cryptocurrency tracking, advanced market analytics, and
                            intelligent price predictions.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                               className="w-10 h-10 bg-white/10 hover:bg-cyan-500 rounded-full flex items-center justify-center transition-all hover:scale-110">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                                </svg>
                            </a>
                            <a href="https://discord.com" target="_blank" rel="noopener noreferrer"
                               className="w-10 h-10 bg-white/10 hover:bg-cyan-500 rounded-full flex items-center justify-center transition-all hover:scale-110">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                </svg>
                            </a>
                            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer"
                               className="w-10 h-10 bg-white/10 hover:bg-cyan-500 rounded-full flex items-center justify-center transition-all hover:scale-110">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                                </svg>
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                               className="w-10 h-10 bg-white/10 hover:bg-cyan-500 rounded-full flex items-center justify-center transition-all hover:scale-110">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors">About
                                Us</Link></li>
                            <li><Link to="/"
                                      className="text-gray-400 hover:text-cyan-400 transition-colors">Careers</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors">Help
                                Center</Link></li>
                            <li><Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact
                                Us</Link></li>
                            <li><Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors">FAQ</Link>
                            </li>
                        </ul>
                    </div>
                </div>


                <div className="pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © 2025 CryptoScope. All rights reserved.
                        </p>
                        <div className="flex flex-wrap gap-6 text-sm">
                            <Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy
                                Policy</Link>
                            <Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms of
                                Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}