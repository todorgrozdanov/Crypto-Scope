import {Link} from "react-router-dom";
import {useEffect, useMemo, useState, useTransition} from "react";
import type {CryptoDTO} from "../intefaces.ts";
import {ChevronUp, ChevronDown, Minus} from "lucide-react";
import {useGlobalContext} from "../GlobalContext.tsx";

type SentimentDTO = {
    date: string;
    url: string;
    title: string;
    body: string;
    sentiment: number;
    finbertSentiment: string;
};

export default function Home() {
    const {allCryptos, loading} = useGlobalContext();
    const [sortBy, setSortBy] = useState<
        'priceNow' | 'volume' | 'marketCap' | 'percentChangeYesterday' | 'percentChangeWeek' | 'percentChangeMonth'
    >('marketCap');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [isSortingPending, startTransition] = useTransition();

    const [news, setNews] = useState<SentimentDTO[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);

    /* ---------- FETCH NEWS ---------- */
    useEffect(() => {
        fetch("https://das-backend-8080.azurewebsites.net/api/sentiment")
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                return res.json();
            })
            .then(data => setNews(data.slice(0, 6))) // лимитирање на фронт
            .catch(err => {
                console.error("Failed to load sentiment news:", err);
                setNews([]);
            })
            .finally(() => setNewsLoading(false));
    }, []);

    const sortCryptos = (cryptos: CryptoDTO[], sortBy: keyof CryptoDTO, sortDirection: 'asc' | 'desc') => {
        return [...cryptos].sort((a, b) => {
            let aValue: number | string;
            let bValue: number | string;

            switch (sortBy) {
                case 'priceNow':
                    aValue = a.priceNow;
                    bValue = b.priceNow;
                    break;
                case 'volume':
                    aValue = a.volume;
                    bValue = b.volume;
                    break;
                case 'marketCap':
                    aValue = a.marketCap;
                    bValue = b.marketCap;
                    break;
                case 'percentChangeYesterday':
                    aValue = a.percentChangeYesterday;
                    bValue = b.percentChangeYesterday;
                    break;
                case 'percentChangeWeek':
                    aValue = a.percentChangeWeek;
                    bValue = b.percentChangeWeek;
                    break;
                case 'percentChangeMonth':
                    aValue = a.percentChangeMonth;
                    bValue = b.percentChangeMonth;
                    break;
                default:
                    return 0;
            }

            if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
            if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const handleSort = (newSortBy: keyof CryptoDTO) => {
        startTransition(() => {
            if (sortBy === newSortBy) {
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            } else {
                setSortBy(newSortBy as typeof sortBy);
                setSortDirection('desc');
            }
        });
    };

    const sortedCryptos = useMemo(() => {
        if (allCryptos.length === 0) return [];
        const res = sortCryptos(allCryptos, sortBy, sortDirection);
        return res
    }, [allCryptos, sortBy, sortDirection]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div
                        className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading market data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-cyan-50/30">
            {/* hero section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"></div>
                <div className="absolute inset-0 opacity-30">
                    <div
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[140px] animate-pulse"></div>
                    <div
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[140px] animate-pulse delay-700"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28">
                    <div className="text-center space-y-6">
                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                            Unlock Your<br/>
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                Crypto Potential
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Real-time market data, advanced analytics, and intelligent predictions all in one place
                        </p>
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <button
                                className="px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold hover:shadow-2xl hover:shadow-white/20 transition-all">
                                Get Started
                            </button>
                            <button
                                className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* market stats */}
            <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Total Market Cap</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {sortedCryptos.reduce((acc, curr) => acc + curr.marketCap, 0).toLocaleString("de-DE", {maximumFractionDigits: 0})}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">24h Trading Vol</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {sortedCryptos.reduce((acc, curr) => acc + curr.volume, 0).toLocaleString("de-DE", {maximumFractionDigits: 0})}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Bitcoin Dominance</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {((sortedCryptos.find(c => c.coinGeckoId === "bitcoin")?.marketCap || 0) / sortedCryptos.reduce((acc, curr) => acc + curr.volume, 0)).toLocaleString("de-DE", {minimumFractionDigits: 2, maximumFractionDigits: 2})}%
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Avg 24h Change</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {(sortedCryptos.reduce((acc, curr) => acc + curr.percentChangeYesterday, 0) / sortedCryptos.length).toLocaleString("de-DE", {minimumFractionDigits: 2, maximumFractionDigits: 2})}%
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* cards */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-6 mb-12">

                    <div
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">📈 Trending</h3>
                            <span
                                className="text-xs font-medium text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">Hot</span>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-4">
                                {
                                    [...sortedCryptos].sort((a, b) => b.volume - a.volume).slice(0, 5).map(c => (
                                        <div key={c.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src={c.imageUrl} className="h-6 w-6 rounded-full"/>
                                                <p className="font-medium text-gray-900">{c.name}</p>
                                            </div>
                                            <span
                                                className="text-sm font-semibold text-cyan-700">{Number(c.volume).toLocaleString("de-DE", {maximumFractionDigits: 0})}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">🔥 Top Gainers</h3>
                            <span
                                className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">24h</span>
                        </div>
                        <div className="space-y-4">
                            {
                                [...sortedCryptos].sort((a, b) => b.percentChangeYesterday - a.percentChangeYesterday).slice(0, 5).map(c => (
                                    <div key={c.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img src={c.imageUrl} className="h-6 w-6 rounded-full"/>
                                            <p className="font-medium text-gray-900">{c.name}</p>
                                        </div>
                                        <span
                                            className="text-sm font-semibold text-green-700">{Number(c.percentChangeYesterday).toLocaleString("de-DE", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}%</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">❌ Top Losers</h3>
                            <span
                                className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">24h</span>
                        </div>
                        <div className="space-y-4">
                            {
                                [...sortedCryptos].sort((a, b) => a.percentChangeYesterday - b.percentChangeYesterday).slice(0, 5).map(c => (
                                    <div key={c.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img src={c.imageUrl} className="h-6 w-6 rounded-full"/>
                                            <p className="font-medium text-gray-900">{c.name}</p>
                                        </div>
                                        <span
                                            className="text-sm font-semibold text-red-700">{Number(c.percentChangeYesterday).toLocaleString("de-DE", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}%</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600
                                    rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">

                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold">💎 Market Summary</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="text-cyan-100 text-sm mb-1">Total Assets</p>
                                <p className="text-3xl font-bold">{sortedCryptos.length}</p>
                            </div>

                            <div>
                                <p className="text-cyan-100 text-sm mb-1">Total Market Cap</p>
                            </div>
                        </div>
                    </div>


                    <div className="col-span-8 mb-14">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            📰 Latest Crypto News
                        </h2>

                        {newsLoading ? (
                            <div className="grid grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-44 bg-gray-100 rounded-2xl animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-6">
                                {news.map((n, i) => {
                                    const sentimentColor =
                                        n.finbertSentiment === "positive"
                                            ? "text-green-600"
                                            : n.finbertSentiment === "negative"
                                                ? "text-red-600"
                                                : "text-gray-500";

                                    const borderColor =
                                        n.finbertSentiment === "positive"
                                            ? "border-green-500"
                                            : n.finbertSentiment === "negative"
                                                ? "border-red-500"
                                                : "border-gray-300";

                                    return (
                                        <a
                                            key={i}
                                            href={n.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`bg-white rounded-2xl shadow-lg border-l-4 ${borderColor}
                                    p-5 hover:shadow-xl transition flex flex-col`}
                                        >
                                            <h4 className="font-semibold mb-2 line-clamp-2">
                                                {n.title}
                                            </h4>

                                            <p className="text-sm text-gray-600 line-clamp-4 flex-1">
                                                {n.body}...
                                            </p>

                                            <div className="mt-4 flex items-center justify-between">
                            <span className={`text-xs font-semibold ${sentimentColor}`}>
                                {n.finbertSentiment.toUpperCase()}
                            </span>

                                                <span className="text-xs text-gray-400">
                                {new Date(n.date).toLocaleDateString("de-DE")}
                            </span>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>


                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Market Overview</h2>
                        <div className="flex items-center gap-2">
                            <div
                                className="px-4 py-2 text-sm font-medium text-cyan-600 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors">
                                All Assets
                            </div>

                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <button className="cursor-pointer" onClick={() => handleSort('priceNow')}>
                                        Price
                                        {sortBy === 'priceNow' ? sortDirection === 'asc' ? (
                                            <ChevronUp className="inline-block w-3 h-3 ml-1"/>) : (
                                            <ChevronDown className="inline-block w-3 h-3 ml-1"/>) : (
                                            <Minus className="inline-block w-3 h-3 ml-1"/>)}
                                    </button>
                                </th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <button className="cursor-pointer"
                                            onClick={() => handleSort('percentChangeYesterday')}>
                                        24h %
                                        {sortBy === 'percentChangeYesterday' ? sortDirection === 'asc' ? (
                                            <ChevronUp className="inline-block w-3 h-3 ml-1"/>) : (
                                            <ChevronDown className="inline-block w-3 h-3 ml-1"/>) : (
                                            <Minus className="inline-block w-3 h-3 ml-1"/>)}
                                    </button>
                                </th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <button className="cursor-pointer" onClick={() => handleSort('percentChangeWeek')}>
                                        7d %
                                        {sortBy === 'percentChangeWeek' ? sortDirection === 'asc' ? (
                                            <ChevronUp className="inline-block w-3 h-3 ml-1"/>) : (
                                            <ChevronDown className="inline-block w-3 h-3 ml-1"/>) : (
                                            <Minus className="inline-block w-3 h-3 ml-1"/>)}
                                    </button>
                                </th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <button className="cursor-pointer" onClick={() => handleSort('percentChangeMonth')}>
                                        1m %
                                        {sortBy === 'percentChangeMonth' ? sortDirection === 'asc' ? (
                                            <ChevronUp className="inline-block w-3 h-3 ml-1"/>) : (
                                            <ChevronDown className="inline-block w-3 h-3 ml-1"/>) : (
                                            <Minus className="inline-block w-3 h-3 ml-1"/>)}
                                    </button>
                                </th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <button className="cursor-pointer" onClick={() => handleSort('volume')}>
                                        Volume
                                        {sortBy === 'volume' ? sortDirection === 'asc' ? (
                                            <ChevronUp className="inline-block w-3 h-3 ml-1"/>) : (
                                            <ChevronDown className="inline-block w-3 h-3 ml-1"/>) : (
                                            <Minus className="inline-block w-3 h-3 ml-1"/>)}
                                    </button>
                                </th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <button className="cursor-pointer" onClick={() => handleSort('marketCap')}>
                                        Market Cap
                                        {sortBy === 'marketCap' ? sortDirection === 'asc' ? (
                                            <ChevronUp className="inline-block w-3 h-3 ml-1"/>) : (
                                            <ChevronDown className="inline-block w-3 h-3 ml-1"/>) : (
                                            <Minus className="inline-block w-3 h-3 ml-1"/>)}
                                    </button>
                                </th>
                                {/*<th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last 7 Days</th>*/}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {sortedCryptos.map((c, index) => isSortingPending ? (
                                <tr className="animate-pulse">
                                    <td className="px-6 py-5">
                                        <div className="h-4 bg-gray-200 rounded w-6"></div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                            <div>
                                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="h-4 bg-gray-200 rounded w-12 ml-auto"></div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="h-4 bg-gray-200 rounded w-12 ml-auto"></div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="h-4 bg-gray-200 rounded w-12 ml-auto"></div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="h-4 bg-gray-200 rounded w-12 ml-auto"></div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                                    </td>
                                </tr>
                            ) : (
                                <tr
                                    key={c.id}
                                    className="hover:bg-gray-50 transition-colors group"
                                >
                                    <td className="px-6 py-5 text-sm font-medium text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-5">
                                        <Link
                                            to={`/crypto/${c.coinGeckoId}`}
                                            className="flex items-center gap-3 group-hover:text-cyan-600 transition-colors"
                                        >
                                            <div className="relative">
                                                <img src={c.imageUrl} className="h-8 aspect-square"/>
                                                <div
                                                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{c.name}</p>
                                                <p className="text-xs text-gray-500 uppercase">{c.ticker}</p>
                                            </div>
                                        </Link>
                                    </td>
                                    {/*PRICE*/}
                                    <td className="px-6 py-5 text-right">
                                        {Number(c.priceNow).toLocaleString("de-DE")}
                                    </td>
                                    {/*24%*/}
                                    <td className="px-6 py-5 text-right">
                                            <span
                                                className={`${Number(c.percentChangeYesterday) > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                                                inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-semibold`}>
                                                <svg
                                                    className={`${c.percentChangeYesterday < 0 && "rotate-180"} w-3 h-3`}
                                                    fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                                {Number(c.percentChangeYesterday).toLocaleString("de-DE", {
                                                    minimumFractionDigits: 1,
                                                    maximumFractionDigits: 2
                                                })}
                                            </span>
                                    </td>
                                    {/*7D%*/}
                                    <td className="px-6 py-5 text-right">
                                            <span
                                                className={`${Number(c.percentChangeWeek) > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                                                inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-semibold`}>
                                                <svg className={`${c.percentChangeWeek < 0 && "rotate-180"} w-3 h-3`}
                                                     fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                                {Number(c.percentChangeWeek).toLocaleString("de-DE", {
                                                    minimumFractionDigits: 1,
                                                    maximumFractionDigits: 2
                                                })}
                                            </span>
                                    </td>
                                    {/*1M%*/}
                                    <td className="px-6 py-5 text-right">
                                            <span
                                                className={`${Number(c.percentChangeMonth) > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                                                inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-semibold`}>
                                                <svg className={`${c.percentChangeMonth < 0 && "rotate-180"} w-3 h-3`}
                                                     fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                                {Number(c.percentChangeMonth).toLocaleString("de-DE", {
                                                    minimumFractionDigits: 1,
                                                    maximumFractionDigits: 2
                                                })}
                                            </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        {Number(c.volume).toLocaleString("de-DE", {maximumFractionDigits: 0})}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        {Number(c.marketCap).toLocaleString("de-DE", {maximumFractionDigits: 0})}
                                    </td>
                                    {/*<td className="px-6 py-5">*/}
                                    {/*    <div className="flex items-center justify-end gap-2">*/}
                                    {/*        <svg width="100" height="40" viewBox="0 0 100 40"*/}
                                    {/*             className="text-green-500">*/}
                                    {/*            <defs>*/}
                                    {/*                <linearGradient id={`gradient-${c.id}`} x1="0%" y1="0%" x2="0%"*/}
                                    {/*                                y2="100%">*/}
                                    {/*                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>*/}
                                    {/*                    <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>*/}
                                    {/*                </linearGradient>*/}
                                    {/*            </defs>*/}
                                    {/*            <path*/}
                                    {/*                d="M0,30 L20,25 L40,28 L60,20 L80,22 L100,10"*/}
                                    {/*                fill="none"*/}
                                    {/*                stroke="currentColor"*/}
                                    {/*                strokeWidth="2"*/}
                                    {/*                strokeLinecap="round"*/}
                                    {/*            />*/}
                                    {/*            <path*/}
                                    {/*                d="M0,30 L20,25 L40,28 L60,20 L80,22 L100,10 L100,40 L0,40 Z"*/}
                                    {/*                fill={`url(#gradient-${c.id})`}*/}
                                    {/*            />*/}
                                    {/*        </svg>*/}
                                    {/*    </div>*/}
                                    {/*</td>*/}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    )
}
