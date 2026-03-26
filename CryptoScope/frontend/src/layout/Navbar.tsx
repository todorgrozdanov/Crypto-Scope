import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {useGlobalContext} from "../GlobalContext.tsx";

interface Crypto {
    id: number;
    name: string;
    ticker: string;
    coinGeckoId: string;
}

export default function Navbar() {
    const {allCryptos} = useGlobalContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [filtered, setFiltered] = useState<Crypto[]>([]);
    const [focusedIndex, setFocusedIndex] = useState(-1); // for keyboard navigation
    const navigate = useNavigate();


    useEffect(() => {
        if (searchQuery.trim() === "") {
            //eslint-disable-next-line react-hooks/set-state-in-effect
            setFiltered([]);
            setFocusedIndex(-1);
            return;
        }

        const results = allCryptos.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.ticker.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFiltered(results);
        setFocusedIndex(0); // auto-focus first element
    }, [searchQuery, allCryptos]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (filtered.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex((prev) => (prev + 1) % filtered.length);
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
        }

        if (e.key === "Enter" && focusedIndex >= 0) {
            const selected = filtered[focusedIndex];
            navigate(`/crypto/${selected.coinGeckoId}`);
            setSearchQuery("");
            setFiltered([]);
        }
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link to="/" className="text-3xl font-bold tracking-tight">
                            Crypto<span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Scope</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-8">

                        </nav>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search crypto..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-64 pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-xl outline-none
                                       focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                        />

                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>

                        {/*DROPDOWN */}
                        {filtered.length > 0 && (
                            <div className="absolute mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto z-50">
                                {filtered.map((c, idx) => (
                                    <div
                                        key={c.id}
                                        onClick={() => {
                                            navigate(`/crypto/${c.coinGeckoId}`);
                                            setSearchQuery("");
                                            setFiltered([]);
                                        }}
                                        tabIndex={0}
                                        className={`px-4 py-2 cursor-pointer grid grid-cols-[1fr_auto] 
                                            ${idx === focusedIndex ? "bg-gray-100" : "hover:bg-gray-50"}`}
                                    >
                                        <span>{c.name}</span>
                                        <span className="text-gray-500">{c.ticker.toUpperCase()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
