
export interface CryptoDTO {
    id: number;
    name: string;
    coinGeckoId: string;
    ticker: string;
    imageUrl: string;

    priceNow: number;
    ath: number;
    percentChangeYesterday: number;
    percentChangeWeek: number;
    percentChangeMonth: number;
    volume: number;
    marketCap: number;
}

export interface CryptoDetailedDto extends CryptoDTO {
    marketCapRank: number;
    circulatingSupply: number;
    ohlcvmWeek: CryptoOHLCVM[];
    ohlcvmMonth: CryptoOHLCVM[];
    ohlcvmHalfYear: CryptoOHLCVM[];
    ohlcvmYear: CryptoOHLCVM[];
    ohlcvmTenYears: CryptoOHLCVM[];
    ohlcvmAll: CryptoOHLCVM[];
}

export interface CryptoOHLCVM {
    date: string;
    open: number;
    high: number;
    low:number;
    close: number;
    volume: number;

    rsi: number;
    macd: number;
    adx: number;
    cci: number;
    stoch: number;
    sma_20: number;
    sma_50: number;
    ema_20: number;
    ema_50: number;
    wma_20: number;
    wma_50: number;
    vma_20: number;
    vma_50: number;
    bb_lower: number;
    bb_middle: number;
    bb_upper: number;
}

export interface Sentiment {
    date: string;
    url: string;
    title: string;
    body: string;
    sentiment: number;
    finbert_sentiment: number;
}