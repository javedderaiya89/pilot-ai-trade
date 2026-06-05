// Realistic sample market data for TradePilot AI demo
export type Trend = "up" | "down";

export interface IndexQuote {
  symbol: string;
  name: string;
  ltp: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  ltp: number;
  changePct: number;
  volume: number;
  rsi: number;
  macd: "bullish" | "bearish" | "neutral";
}

export interface AISignal {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  entry: number;
  stopLoss: number;
  target1: number;
  target2: number;
  target3: number;
  confidence: number;
  rr: number;
  tradeType: "Intraday" | "Swing" | "Positional";
  timeframe: string;
  reason: string;
}

export interface OptionRow {
  strike: number;
  callOI: number;
  callOIChange: number;
  callLTP: number;
  callVolume: number;
  putOI: number;
  putOIChange: number;
  putLTP: number;
  putVolume: number;
}

export interface Position {
  id: string;
  symbol: string;
  type: "LONG" | "SHORT";
  instrument: "EQ" | "CE" | "PE" | "FUT";
  qty: number;
  avgPrice: number;
  ltp: number;
  pnl: number;
  pnlPct: number;
  openedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  symbol: string;
  contract?: string;
  entry: number;
  exit: number;
  sl: number;
  target: number;
  qty: number;
  pnl: number;
  notes: string;
  psychology: string;
  tag: "Win" | "Loss" | "BE";
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: "Global" | "Indian" | "Company" | "Sector";
  sentiment: "Positive" | "Neutral" | "Negative";
  summary: string;
  symbols: string[];
}

export const indices: IndexQuote[] = [
  { symbol: "NIFTY", name: "NIFTY 50", ltp: 24812.45, change: 142.30, changePct: 0.58, high: 24856.10, low: 24612.20, open: 24670.00, prevClose: 24670.15 },
  { symbol: "BANKNIFTY", name: "NIFTY BANK", ltp: 53420.80, change: -210.45, changePct: -0.39, high: 53710.50, low: 53310.20, open: 53631.25, prevClose: 53631.25 },
  { symbol: "FINNIFTY", name: "NIFTY FIN SERVICE", ltp: 24165.30, change: 88.20, changePct: 0.37, high: 24210.40, low: 24050.10, open: 24077.10, prevClose: 24077.10 },
  { symbol: "SENSEX", name: "BSE SENSEX", ltp: 81245.60, change: 412.80, changePct: 0.51, high: 81380.20, low: 80812.40, open: 80832.80, prevClose: 80832.80 },
];

const sectors = ["IT", "Banking", "Auto", "Pharma", "FMCG", "Metals", "Energy", "Realty"];
const names: [string, string, string][] = [
  ["RELIANCE", "Reliance Industries", "Energy"],
  ["TCS", "Tata Consultancy Services", "IT"],
  ["INFY", "Infosys", "IT"],
  ["HDFCBANK", "HDFC Bank", "Banking"],
  ["ICICIBANK", "ICICI Bank", "Banking"],
  ["SBIN", "State Bank of India", "Banking"],
  ["AXISBANK", "Axis Bank", "Banking"],
  ["KOTAKBANK", "Kotak Mahindra Bank", "Banking"],
  ["LT", "Larsen & Toubro", "Infra"],
  ["BHARTIARTL", "Bharti Airtel", "Telecom"],
  ["ITC", "ITC Limited", "FMCG"],
  ["HINDUNILVR", "Hindustan Unilever", "FMCG"],
  ["MARUTI", "Maruti Suzuki", "Auto"],
  ["M&M", "Mahindra & Mahindra", "Auto"],
  ["TATAMOTORS", "Tata Motors", "Auto"],
  ["BAJFINANCE", "Bajaj Finance", "Finance"],
  ["ADANIENT", "Adani Enterprises", "Conglomerate"],
  ["ADANIPORTS", "Adani Ports", "Infra"],
  ["ASIANPAINT", "Asian Paints", "Consumer"],
  ["WIPRO", "Wipro", "IT"],
  ["HCLTECH", "HCL Technologies", "IT"],
  ["SUNPHARMA", "Sun Pharma", "Pharma"],
  ["DRREDDY", "Dr Reddy's Labs", "Pharma"],
  ["CIPLA", "Cipla", "Pharma"],
  ["JSWSTEEL", "JSW Steel", "Metals"],
  ["TATASTEEL", "Tata Steel", "Metals"],
  ["HINDALCO", "Hindalco Industries", "Metals"],
  ["ONGC", "ONGC", "Energy"],
  ["NTPC", "NTPC", "Energy"],
  ["POWERGRID", "Power Grid Corp", "Energy"],
];

// Seeded pseudo-random for stable data across renders
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const stocks: Stock[] = names.map(([sym, name, sec], i) => {
  const r = seeded(i + 7);
  const base = 200 + r() * 4800;
  const chg = (r() - 0.5) * 6;
  return {
    symbol: sym,
    name,
    sector: sec,
    ltp: +base.toFixed(2),
    changePct: +chg.toFixed(2),
    volume: Math.floor(r() * 9_000_000 + 200_000),
    rsi: +(20 + r() * 70).toFixed(1),
    macd: r() > 0.6 ? "bullish" : r() > 0.3 ? "bearish" : "neutral",
  };
});

export const topGainers = [...stocks].sort((a, b) => b.changePct - a.changePct).slice(0, 6);
export const topLosers = [...stocks].sort((a, b) => a.changePct - b.changePct).slice(0, 6);
export const mostActive = [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 6);

export const aiSignals: AISignal[] = [
  { id: "s1", symbol: "RELIANCE", type: "BUY", entry: 2945.20, stopLoss: 2898.00, target1: 2980, target2: 3025, target3: 3080, confidence: 87, rr: 2.8, tradeType: "Swing", timeframe: "1D", reason: "Breakout from 50DMA with rising volume; RSI 62" },
  { id: "s2", symbol: "HDFCBANK", type: "BUY", entry: 1712.50, stopLoss: 1688.00, target1: 1735, target2: 1760, target3: 1795, confidence: 81, rr: 2.4, tradeType: "Intraday", timeframe: "15m", reason: "Bullish engulfing at support; MACD crossover" },
  { id: "s3", symbol: "TATASTEEL", type: "SELL", entry: 152.40, stopLoss: 156.80, target1: 148, target2: 144, target3: 140, confidence: 76, rr: 2.1, tradeType: "Swing", timeframe: "1D", reason: "Lower highs forming; rejected at supply zone" },
  { id: "s4", symbol: "INFY", type: "BUY", entry: 1820.00, stopLoss: 1794.00, target1: 1850, target2: 1880, target3: 1915, confidence: 92, rr: 3.2, tradeType: "Positional", timeframe: "1W", reason: "Cup & handle breakout; sector momentum strong" },
  { id: "s5", symbol: "BANKNIFTY", type: "SELL", entry: 53450, stopLoss: 53680, target1: 53200, target2: 52950, target3: 52600, confidence: 73, rr: 2.0, tradeType: "Intraday", timeframe: "5m", reason: "PCR turning bearish; Max Pain shifted lower" },
  { id: "s6", symbol: "MARUTI", type: "BUY", entry: 12480, stopLoss: 12320, target1: 12640, target2: 12800, target3: 13050, confidence: 84, rr: 2.6, tradeType: "Swing", timeframe: "1D", reason: "Auto sales beat; EMA20 reclaimed" },
  { id: "s7", symbol: "ADANIENT", type: "BUY", entry: 2640, stopLoss: 2590, target1: 2700, target2: 2760, target3: 2840, confidence: 68, rr: 1.9, tradeType: "Intraday", timeframe: "15m", reason: "Volume spike on news flow" },
  { id: "s8", symbol: "SUNPHARMA", type: "BUY", entry: 1782, stopLoss: 1758, target1: 1810, target2: 1840, target3: 1880, confidence: 79, rr: 2.3, tradeType: "Swing", timeframe: "1D", reason: "Pharma rotation; defensive bid" },
];

export function buildOptionChain(spot: number, step: number): OptionRow[] {
  const atm = Math.round(spot / step) * step;
  const rows: OptionRow[] = [];
  for (let i = -6; i <= 6; i++) {
    const strike = atm + i * step;
    const r = seeded(strike);
    const callOI = Math.floor((r() * 8 + 1) * 100000);
    const putOI = Math.floor((r() * 8 + 1) * 100000);
    rows.push({
      strike,
      callOI,
      callOIChange: Math.floor((r() - 0.4) * 50000),
      callLTP: +Math.max(1, (spot - strike) + r() * 80).toFixed(2),
      callVolume: Math.floor(r() * 200000),
      putOI,
      putOIChange: Math.floor((r() - 0.4) * 50000),
      putLTP: +Math.max(1, (strike - spot) + r() * 80).toFixed(2),
      putVolume: Math.floor(r() * 200000),
    });
  }
  return rows;
}

export const positions: Position[] = [
  { id: "p1", symbol: "RELIANCE", type: "LONG", instrument: "EQ", qty: 25, avgPrice: 2918.40, ltp: 2945.20, pnl: 670, pnlPct: 0.92, openedAt: "2025-06-03 09:42" },
  { id: "p2", symbol: "NIFTY 24800 CE", type: "LONG", instrument: "CE", qty: 75, avgPrice: 142.50, ltp: 168.20, pnl: 1927.50, pnlPct: 18.03, openedAt: "2025-06-04 10:15" },
  { id: "p3", symbol: "BANKNIFTY 53500 PE", type: "LONG", instrument: "PE", qty: 30, avgPrice: 188.00, ltp: 162.40, pnl: -768, pnlPct: -13.61, openedAt: "2025-06-05 09:30" },
  { id: "p4", symbol: "TCS", type: "LONG", instrument: "EQ", qty: 10, avgPrice: 3845.00, ltp: 3892.10, pnl: 471, pnlPct: 1.22, openedAt: "2025-06-02 11:20" },
];

export const closedPositions: Position[] = [
  { id: "c1", symbol: "INFY", type: "LONG", instrument: "EQ", qty: 20, avgPrice: 1782.00, ltp: 1820.00, pnl: 760, pnlPct: 2.13, openedAt: "2025-05-28" },
  { id: "c2", symbol: "BANKNIFTY 53000 CE", type: "LONG", instrument: "CE", qty: 60, avgPrice: 210.00, ltp: 175.00, pnl: -2100, pnlPct: -16.67, openedAt: "2025-05-29" },
  { id: "c3", symbol: "HDFCBANK", type: "LONG", instrument: "EQ", qty: 15, avgPrice: 1688.00, ltp: 1712.50, pnl: 367.5, pnlPct: 1.45, openedAt: "2025-05-30" },
  { id: "c4", symbol: "MARUTI", type: "LONG", instrument: "EQ", qty: 5, avgPrice: 12340, ltp: 12480, pnl: 700, pnlPct: 1.13, openedAt: "2025-05-31" },
];

export const journal: JournalEntry[] = [
  { id: "j1", date: "2025-06-04", symbol: "NIFTY", contract: "NIFTY 24800 CE", entry: 142.5, exit: 168.2, sl: 128, target: 175, qty: 75, pnl: 1927.5, notes: "Bought after retest of VWAP", psychology: "Patient, waited for confirmation.", tag: "Win" },
  { id: "j2", date: "2025-06-03", symbol: "TCS", entry: 3845, exit: 3892, sl: 3820, target: 3900, qty: 10, pnl: 470, notes: "Sector momentum trade", psychology: "Trailed stop properly.", tag: "Win" },
  { id: "j3", date: "2025-06-02", symbol: "TATASTEEL", entry: 156, exit: 152.4, sl: 158, target: 148, qty: 100, pnl: -360, notes: "Stopped out on reversal", psychology: "Took loss without revenge trade.", tag: "Loss" },
  { id: "j4", date: "2025-05-30", symbol: "HDFCBANK", entry: 1688, exit: 1712.5, sl: 1672, target: 1720, qty: 15, pnl: 367.5, notes: "Bullish engulfing setup", psychology: "Stuck to plan.", tag: "Win" },
];

export const news: NewsItem[] = [
  { id: "n1", title: "RBI keeps repo rate unchanged at 6.50%, maintains 'withdrawal of accommodation' stance", source: "Mint", time: "2h ago", category: "Indian", sentiment: "Neutral", summary: "MPC voted 4-2 to hold; growth forecast raised to 7.2%.", symbols: ["HDFCBANK","SBIN","BANKNIFTY"] },
  { id: "n2", title: "Reliance Jio adds 2.1M subscribers in May, leading telecom market", source: "Economic Times", time: "4h ago", category: "Company", sentiment: "Positive", summary: "ARPU expansion expected to continue post-tariff hike.", symbols: ["RELIANCE","BHARTIARTL"] },
  { id: "n3", title: "US CPI prints at 3.2%, slightly below estimates; Dow futures rally", source: "Reuters", time: "5h ago", category: "Global", sentiment: "Positive", summary: "Soft inflation revives rate-cut hopes for Sept FOMC.", symbols: ["NIFTY","SENSEX"] },
  { id: "n4", title: "Auto sector posts strongest monthly sales in three years", source: "Business Standard", time: "6h ago", category: "Sector", sentiment: "Positive", summary: "Maruti, M&M, Tata Motors all report double-digit YoY growth.", symbols: ["MARUTI","TATAMOTORS","M&M"] },
  { id: "n5", title: "Adani Group denies fresh allegations, stock under pressure", source: "Bloomberg", time: "7h ago", category: "Company", sentiment: "Negative", summary: "Group issues clarification; analysts flag governance risk.", symbols: ["ADANIENT","ADANIPORTS"] },
  { id: "n6", title: "Crude oil dips below $78 on demand concerns", source: "CNBC", time: "8h ago", category: "Global", sentiment: "Neutral", summary: "Supports India's import bill; OMC margins to widen.", symbols: ["ONGC","RELIANCE"] },
];

export const equityCurve = Array.from({ length: 40 }, (_, i) => {
  const r = seeded(i + 11)();
  const base = 100000 + i * 850 + Math.sin(i / 4) * 1800 + (r - 0.5) * 1200;
  return { day: i + 1, equity: +base.toFixed(0) };
});

export const monthlyPerf = [
  { month: "Jan", pnl: 8420 },
  { month: "Feb", pnl: -3120 },
  { month: "Mar", pnl: 12480 },
  { month: "Apr", pnl: 6210 },
  { month: "May", pnl: 14230 },
  { month: "Jun", pnl: 3825 },
];

export const sentiment = {
  score: 64, // 0-100
  label: "Bullish" as const,
  advances: 1820,
  declines: 1140,
  unchanged: 142,
};

export function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);
}
