import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchCrypto} from "../api.ts";
import type {CryptoDetailedDto} from "../intefaces.ts";
import ReactApexChart from "react-apexcharts";
import type {ApexOptions} from "apexcharts";
import type {CryptoOHLCVM} from "../intefaces.ts";
import {ArrowDownUp, ArrowRight, Bot, TrendingDown, TrendingUp, TrendingUpDown, Zap} from "lucide-react";

type IndicatorKey =
    | "sma_20"
    | "sma_50"
    | "ema_20"
    | "ema_50"
    | "wma_20"
    | "wma_50"
    | "bb_upper"
    | "bb_middle"
    | "bb_lower"
    | "rsi"
    | "macd"
    | "stoch"
    | "adx"
    | "cci";

const INDICATORS: Record<IndicatorKey, {
    label: string;
    color: string;
    type: "overlay" | "sub";
}> = {
    sma_20: {label: "SMA 20", color: "#2563eb", type: "overlay"},
    sma_50: {label: "SMA 50", color: "#1e40af", type: "overlay"},
    ema_20: {label: "EMA 20", color: "#16a34a", type: "overlay"},
    ema_50: {label: "EMA 50", color: "#166534", type: "overlay"},
    wma_20: {label: "WMA 20", color: "#a83299", type: "overlay"},
    wma_50: {label: "WMA 50", color: "#702266", type: "overlay"},

    bb_upper: {label: "BB Upper", color: "#f97316", type: "overlay"},
    bb_middle: {label: "BB Middle", color: "#fb923c", type: "overlay"},
    bb_lower: {label: "BB Lower", color: "#e3a766", type: "overlay"},

    rsi: {label: "RSI", color: "#dc2626", type: "sub"},
    macd: {label: "MACD", color: "#0891b2", type: "sub"},
    stoch: {label: "Stochastic", color: "#9333ea", type: "sub"},
    adx: {label: "ADX", color: "#4b5563", type: "sub"},
    cci: {label: "CCI", color: "#ca8a04", type: "sub"},
};

export default function Crypto() {
    //#2
    const [selectedIndicators, setSelectedIndicators] = useState<IndicatorKey[]>([]);
    const {coinGeckoId} = useParams<{ coinGeckoId: string }>();
    const [crypto, setCrypto] = useState<CryptoDetailedDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState<"1W" | "1M" | "6M" | "1Y" | "10Y" | "ALL">("1M");
    const [predictionData, setPredictionData] = useState<{
        predictions: number[];
        dates: string[];
        confidence: number;
    } | null>(null);
    const [movementPrediction, setMovementPrediction] = useState<string>("");
    const [loadingPrediction, setLoadingPrediction] = useState(false);
    const [loadingMovementPrediction, setLoadingMovementPrediction] = useState(false);

    const [predictionHorizon, setPredictionHorizon] = useState<7 | 30>(7);

    //#3
    const toggleIndicator = (key: IndicatorKey) => {
        setSelectedIndicators(prev =>
            prev.includes(key)
                ? prev.filter(i => i !== key)
                : [...prev, key]
        );
    };


    const fetchPricePrediction = async () => {
        if (!coinGeckoId) return;
        setLoadingPrediction(true);

        try {
            const res = await fetch(`https://das-backend-8080.azurewebsites.net/api/prediction/${coinGeckoId}/lstm/predict?days=${predictionHorizon}`);
            const data = await res.json();
            console.log("Backend response:", data);

            if (Array.isArray(data) && data.length > 0) {
                const predictions = data.map((item: any) => item.predictedClose);
                const dates = data.map((item: any) => item.predictedDate);
                const avgConfidence =
                    data.reduce((sum: number, item: any) => sum + (item.confidence ?? 0), 0) / data.length;

                setPredictionData({
                    predictions,
                    dates,
                    confidence: avgConfidence,
                });
            } else {
                setPredictionData(null);
            }
        } catch (err) {
            console.error("Prediction fetch error:", err);
            setPredictionData(null);
        } finally {
            setLoadingPrediction(false);
        }
    };

    const fetchMovementPrediction = async () => {
        if (!coinGeckoId) return;
        setLoadingMovementPrediction(true);

        try {
            const res = await fetch(`https://das-backend-8080.azurewebsites.net/api/prediction/${coinGeckoId}/xgb/predict?days=${predictionHorizon}`);
            const data = await res.text();
            console.log("Backend response:", data);

            setMovementPrediction(data)
        } catch (err) {
            console.error("Prediction fetch error:", err);
            setMovementPrediction("");
        } finally {
            setLoadingMovementPrediction(false);
        }
    };


    useEffect(() => {
        console.log("Current predictionData state:", predictionData);
    }, [predictionData]);

    // Load crypto details
    useEffect(() => {
        if (!coinGeckoId) return;

        const loadData = async () => {
            try {
                const res = await fetchCrypto(coinGeckoId);
                console.log(res.data)
                setCrypto(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [coinGeckoId]);

    const ohlcvMapper = {
        "1W": crypto?.ohlcvmWeek,
        "1M": crypto?.ohlcvmMonth,
        "6M": crypto?.ohlcvmHalfYear,
        "1Y": crypto?.ohlcvmYear,
        "10Y": crypto?.ohlcvmTenYears,
        "ALL": crypto?.ohlcvmAll
    }

    // chart configuration
    const chartData = ohlcvMapper[timeframe]?.map((candle: CryptoOHLCVM) => ({
        x: new Date(candle.date).getTime(),
        y: [candle.open, candle.high, candle.low, candle.close] as [number, number, number, number]
    }));

    const chartSeries = [
        {
            name: "Price",
            data: chartData,
        }
    ];


    const chartOptions: ApexOptions = {
        chart: {
            type: 'candlestick',
            height: 380,
            toolbar: {show: false},
            background: 'transparent',
            zoom: {enabled: true}
        },
        title: {text: '', style: {fontSize: '0px'}},
        xaxis: {
            type: 'datetime',
            labels: {style: {colors: '#64748b'}}
        },
        yaxis: {
            tooltip: {enabled: true},
            labels: {style: {colors: '#64748b'}}
        },
        grid: {
            borderColor: '#f1f5f9',
            strokeDashArray: 3
        },
        tooltip: {
            theme: 'light',
            x: {format: 'dd MMM \'yy'}
        }
    };

    //#5
    const overlaySeries = selectedIndicators
        .filter(i => INDICATORS[i].type === "overlay")
        .map(i => ({
            name: INDICATORS[i].label,
            type: "line",
            data: ohlcvMapper[timeframe]?.map(c => ({
                x: new Date(c.date).getTime(),
                y: (c as any)[i]
            })),
            color: INDICATORS[i].color,
        }));

    //#6
    const mainChartSeries = [
        {
            name: "Price",
            type: "candlestick",
            data: chartData,
        },
        ...overlaySeries
    ];

    //#8
    const subChartSeries = selectedIndicators
        .filter(i => INDICATORS[i].type === "sub")
        .map(i => ({
            name: INDICATORS[i].label,
            data: ohlcvMapper[timeframe]?.map(c => ({
                x: new Date(c.date).getTime(),
                y: (c as any)[i]
            })),
            color: INDICATORS[i].color,
        }));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div
                        className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading crypto data...</p>
                </div>
            </div>
        );
    }

    if (!crypto) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Cryptocurrency not found</h2>
                    <Link to="/" className="text-cyan-600 hover:text-cyan-700 font-medium">
                        Back to home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-cyan-50/30">
            {/*breadcrumb*/}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-cyan-600 transition-colors font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                        </svg>
                        Back to Market Overview
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
                    <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <img src={crypto.imageUrl} className="w-1/5 aspect-square" alt='crypto logo'/>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                    {crypto.name}
                                    <span className="ml-3 text-xl font-medium text-gray-400 uppercase">
                                        {crypto.ticker}
                                    </span>
                                </h1>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-lg">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-gray-900 mb-2">
                                {crypto.priceNow.toLocaleString("de-DE")} <span className="font-medium">$</span>
                            </div>
                            <div
                                className={`${Number(crypto.percentChangeYesterday) > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg`}>
                                <svg
                                    className={`${crypto.percentChangeYesterday < 0 && "rotate-180"} w-4 h-4`}
                                    fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                          clipRule="evenodd"/>
                                </svg>
                                <span className="text-lg font-bold">
                                    {crypto.percentChangeYesterday.toLocaleString("de-DE", {maximumFractionDigits: 2})}%
                                </span>
                                <span className="text-sm font-medium opacity-75">(24h)</span>
                            </div>
                        </div>
                    </div>

                    {/* stats gridd */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-gray-500">Market Cap</p>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <p className="text-xl font-bold text-gray-900">
                                $ {crypto.marketCap.toLocaleString("de-DE", {maximumFractionDigits: 0})}
                                <span
                                    className="text-black/40 font-semibold text-base"> / #{crypto.marketCapRank}</span>
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-gray-500">24h Trading Vol</p>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <p className="text-xl font-bold text-gray-900">
                                $ {crypto.volume.toLocaleString("de-DE", {maximumFractionDigits: 0})}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-gray-500">Circulating Supply</p>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <p className="text-xl font-bold text-gray-900">
                                {crypto.circulatingSupply?.toLocaleString("de-DE", {maximumFractionDigits: 0})}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-gray-500">All Time High</p>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <p className="text-xl font-bold text-gray-900">
                                $ {crypto.ath.toLocaleString("de-DE", {maximumFractionDigits: 0})}
                                <span
                                    className="text-black/40 font-semibold text-base"> / {Math.abs((1 - crypto.priceNow / crypto.ath) * 100).toLocaleString("de-DE", {maximumFractionDigits: 2})} % {crypto.priceNow < crypto.ath ? "below" : "above"} ATH</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* chart */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Price Chart</h2>
                                <div className="flex items-center gap-2">
                                    {(["1W", "1M", "6M", "1Y", "10Y", "ALL"] as const).map((tf) => (
                                        <button
                                            key={tf}
                                            onClick={() => setTimeframe(tf)}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                                timeframe === tf
                                                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                                                    : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                        >
                                            {tf}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-[400px]">
                                {ohlcvMapper[timeframe]?.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                                        No price data available
                                    </div>
                                ) : (
                                    <ReactApexChart
                                        options={chartOptions}
                                        //#7
                                        series={mainChartSeries}
                                        type="candlestick"
                                        height="380"
                                    />
                                )}
                            </div>

                            {/*#4*/}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {Object.entries(INDICATORS).map(([key, cfg]) => (
                                    <button
                                        key={key}
                                        onClick={() => toggleIndicator(key as IndicatorKey)}
                                        className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition
                ${selectedIndicators.includes(key as IndicatorKey)
                                            ? "bg-cyan-500 text-white border-cyan-500"
                                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                                        }`}
                                    >
                                        {cfg.label}
                                    </button>
                                ))}
                            </div>

                        </div>
                        {subChartSeries.length > 0 && (
                            <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                                <ReactApexChart
                                    type="line"
                                    height={250}
                                    series={subChartSeries}
                                    options={{
                                        chart: {toolbar: {show: false}},
                                        xaxis: {type: "datetime"},
                                        stroke: {width: 2},
                                        tooltip: {shared: true}
                                    }}
                                />
                            </div>
                        )}

                        {/* stats*/}
                        <div className="grid md:grid-cols-3 gap-6 mt-6">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">24h
                                        Change</h3>
                                    <div
                                        className={`${crypto.percentChangeYesterday >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}
                                        w-10 h-10 rounded-lg flex items-center justify-center`}>
                                        <svg className={`${crypto.percentChangeYesterday < 0 && "rotate-180"} w-5 h-5`}
                                             fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                </div>
                                <p className={`text-2xl font-bold ${crypto.percentChangeYesterday >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {crypto.percentChangeYesterday.toLocaleString("de-DE", {maximumFractionDigits: 2})}%
                                </p>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">7d
                                        Change</h3>
                                    <div
                                        className={`${crypto.percentChangeWeek >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}
                                        w-10 h-10 rounded-lg flex items-center justify-center`}>
                                        <svg className={`${crypto.percentChangeWeek < 0 && "rotate-180"} w-5 h-5`}
                                             fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                </div>
                                <p className={`text-2xl font-bold ${crypto.percentChangeWeek >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {crypto.percentChangeWeek.toLocaleString("de-DE", {maximumFractionDigits: 2})}%
                                </p>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">30d
                                        Change</h3>
                                    <div
                                        className={`${crypto.percentChangeMonth >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}
                                        w-10 h-10 rounded-lg flex items-center justify-center`}>
                                        <svg className={`${crypto.percentChangeMonth < 0 && "rotate-180"} w-5 h-5`}
                                             fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                </div>
                                <p className={`text-2xl font-bold ${crypto.percentChangeMonth >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {crypto.percentChangeMonth.toLocaleString("de-DE", {maximumFractionDigits: 2})}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* sidebar */}
                    <div className="space-y-6">
                        {/* ai*/}
                        <div
                            className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20">
                                <div
                                    className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 rounded-full blur-3xl"></div>
                                <div
                                    className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div
                                        className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                        <Zap />
                                    </div>
                                    <h3 className="text-lg font-bold">ML Price Prediction</h3>
                                    <div className="flex items-center justify-between ml-auto">
                                        <div className="flex gap-1 text-xs bg-white/10 rounded-lg p-1">
                                            {[7, 30].map((d) => (
                                                <button
                                                    key={d}
                                                    onClick={() => setPredictionHorizon(d as 7 | 30)}
                                                    className={`px-2 py-0.5 rounded-md font-semibold ${
                                                        predictionHorizon === d
                                                            ? "bg-white text-slate-900"
                                                            : "text-cyan-100 hover:bg-white/20"
                                                    }`}
                                                >
                                                    {d}d
                                                </button>
                                            ))}
                                        </div>
                                    </div>


                                </div>

                                {predictionData ? (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-cyan-200 text-sm mb-2">Predicted Price
                                                (Next {predictionHorizon} Days)</p>
                                            <p className="text-3xl font-bold">
                                                $ {predictionData.predictions[0]?.toLocaleString("de-DE", {maximumFractionDigits: 2})}
                                            </p>
                                            <div className="mt-3">
                                                <p className="text-cyan-200 text-xs mb-1">Next {predictionHorizon} days</p>
                                                <ul className="space-y-1 text-xs">
                                                    {predictionData.predictions.map((price, idx) => (
                                                        <li key={idx} className="flex justify-between">
                                                            <span className="text-cyan-100">
                                                              {new Date(predictionData.dates[idx]).toLocaleDateString("en-US", {
                                                                  month: "short",
                                                                  day: "numeric",
                                                              })}
                                                            </span>
                                                            <span className="font-semibold text-green-400">
                                                              {price.toLocaleString("en-US", {
                                                                  style: "currency",
                                                                  currency: "USD",
                                                                  maximumFractionDigits: 2,
                                                              })}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-white/20">
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-cyan-200">Confidence</span>
                                                <span
                                                    className="font-bold">{(predictionData.confidence * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-cyan-400 to-green-400 rounded-full"
                                                    style={{width: `${(predictionData.confidence * 100).toFixed(0)}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={fetchPricePrediction}
                                            disabled={loadingPrediction}
                                            className="w-full mt-4 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg font-semibold transition-all"
                                        >
                                            {loadingPrediction ? "Predicting..." : "Generate New Prediction"}
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-cyan-100 text-sm mb-6">
                                            Use our advanced machine learning model to predict the next price
                                        </p>
                                        {/* Predict button here */}
                                        <button
                                            onClick={fetchPricePrediction}
                                            disabled={loadingPrediction}
                                            className={`w-full px-6 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                                                ${loadingPrediction ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-white text-gray-900 hover:shadow-2xl hover:shadow-white/20"}
                                            `}
                                        >
                                            {loadingPrediction ? "Predicting..." : (
                                                <>
                                                    <Bot />
                                                    Predict Price
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div
                            className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20">
                                <div
                                    className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 rounded-full blur-3xl"></div>
                                <div
                                    className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div
                                        className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                        <ArrowDownUp />
                                    </div>
                                    <h3 className="text-lg font-bold">Movement Prediction</h3>
                                </div>

                                <div>
                                    <p className="text-cyan-100 text-sm mb-6">
                                        Use our advanced machine learning model to predict the next movement
                                    </p>
                                    {/* Predict button here */}
                                    <button
                                        onClick={fetchMovementPrediction}
                                        disabled={loadingMovementPrediction}
                                        className={`w-full px-6 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                                                ${loadingMovementPrediction ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-white text-gray-900 hover:shadow-2xl hover:shadow-white/20"}
                                            `}
                                    >
                                        {loadingMovementPrediction ? "Predicting..." : (
                                            <>
                                                <Bot />
                                                Predict Movement
                                            </>
                                        )}
                                    </button>
                                </div>
                                {movementPrediction && (
                                    <div className="mt-6 p-4 bg-white/10 rounded-lg">
                                        <h4 className="text-lg font-semibold mb-4">Prediction Result:</h4>
                                        <p className="text-xl font-bold flex items-center gap-4">
                                            {movementPrediction.charAt(0).toUpperCase() + movementPrediction.slice(1)}
                                            {
                                                movementPrediction === 'negative' ? (
                                                    <TrendingDown />
                                                ) : movementPrediction === 'neutral' ? (
                                                    <TrendingUpDown />
                                                ) : (
                                                    <TrendingUp />
                                                )
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}
