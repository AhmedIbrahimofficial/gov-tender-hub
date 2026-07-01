/**
 * BriefingDashboard — Full-screen dark financial-style briefing chart.
 * Mimics the trading terminal dashboard from the reference image:
 * live ticking numbers, candlestick/bar charts, scrolling data tiles,
 * procurement KPI panels — all dark themed, numbers animate in real time.
 */
import { useState, useEffect, useRef } from "react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  LineChart, Line, ComposedChart, XAxis, YAxis, Tooltip, Cell,
} from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, Activity } from "lucide-react";

// ── Colour palette (matches reference image) ──────────────────────────────
const C = {
  green:  "#00e676", red: "#ff1744", teal: "#2563eb",
  amber: "#ffa726", blue: "#42a5f5", white: "#e8f0fe",
  bg0: "#050d1a", bg1: "#0a1628", bg2: "#0f1f3d", bg3: "#0d2545",
};

// ── Helpers ───────────────────────────────────────────────────────────────
function rand(min: number, max: number) { return min + Math.random() * (max - min); }
function genSeries(n: number, base: number, vol: number) {
  return Array.from({ length: n }, (_, i) => ({
    t: i, v: +(base + Math.sin(i * 0.4) * vol + rand(-vol * 0.3, vol * 0.3)).toFixed(2)
  }));
}
function genCandles(n: number, base: number, vol: number) {
  let price = base;
  return Array.from({ length: n }, (_, i) => {
    const open = price;
    const close = +(open + rand(-vol, vol)).toFixed(2);
    const high  = +(Math.max(open, close) + rand(0, vol * 0.5)).toFixed(2);
    const low   = +(Math.min(open, close) - rand(0, vol * 0.5)).toFixed(2);
    price = close;
    return { t: i, open, close, high, low, up: close >= open };
  });
}

// ── Static initial data ───────────────────────────────────────────────────
const INIT_MAIN = genSeries(80, 1.3748, 0.08);
const INIT_CANDLES = genCandles(40, 2.84, 0.04);
const INIT_RISK = genSeries(60, 420, 40);
const INIT_NOISE = genSeries(80, 180, 60);
const INIT_RENDITY = genSeries(60, 339, 30);

// ── Top ticker items ──────────────────────────────────────────────────────
const TICKER_ITEMS = [
  { label: "Nat. Spend YTD",  value: 2.84,  unit: "B",  dec: 2, base: 2.84,  vol: 0.002, up: true  },
  { label: "Compliance",      value: 94.2,  unit: "%",  dec: 1, base: 94.2,  vol: 0.1,   up: true  },
  { label: "Fraud Alerts",    value: 23,    unit: "",   dec: 0, base: 23,    vol: 0.4,   up: false },
  { label: "Active Tenders",  value: 1287,  unit: "",   dec: 0, base: 1287,  vol: 1,     up: true  },
  { label: "Budget Util",     value: 67.8,  unit: "%",  dec: 1, base: 67.8,  vol: 0.05,  up: true  },
  { label: "Savings YTD",     value: 184,   unit: "M",  dec: 0, base: 184,   vol: 0.3,   up: true  },
  { label: "Inflation",       value: 34.8,  unit: "%",  dec: 1, base: 34.8,  vol: 0.04,  up: false },
  { label: "Revenue YTD",     value: 18.2,  unit: "B",  dec: 1, base: 18.2,  vol: 0.01,  up: true  },
];

// ── Right-side price list ─────────────────────────────────────────────────
const RIGHT_ROWS = [
  { label: "Transport", value: 578, vol: 2 },
  { label: "Health",    value: 392, vol: 1.5 },
  { label: "Education", value: 291, vol: 1 },
  { label: "Energy",    value: 184, vol: 1.2 },
  { label: "Agri",      value: 312, vol: 2 },
  { label: "Water",     value: 318, vol: 3 },
  { label: "Defence",   value: 208, vol: 0.8 },
  { label: "ICT",       value: 98,  vol: 0.5 },
];

// ── Candlestick rendered as overlapping bars ──────────────────────────────
function CandleBar({ x, y, width, height, up }: { x?: number; y?: number; width?: number; height?: number; up?: boolean }) {
  const fill = up ? C.green : C.red;
  const absH = Math.max(Math.abs(height ?? 0), 2);
  return <rect x={x} y={y} width={Math.max(width ?? 4, 3)} height={absH} fill={fill} rx={1} />;
}

// ── Animated number hook ──────────────────────────────────────────────────
function useAnimatedValue(base: number, vol: number, interval = 1200) {
  const [val, setVal] = useState(base);
  const [dir, setDir] = useState<"up" | "down">("up");
  useEffect(() => {
    const t = setInterval(() => {
      const delta = rand(-vol, vol);
      setVal(v => {
        const n = +(v + delta).toFixed(2);
        setDir(n >= v ? "up" : "down");
        return n;
      });
    }, interval + rand(0, 400));
    return () => clearInterval(t);
  }, [base, vol, interval]);
  return { val, dir };
}

// ── Single live ticker cell ───────────────────────────────────────────────
function TickerCell({ item }: { item: typeof TICKER_ITEMS[0] }) {
  const { val, dir } = useAnimatedValue(item.base, item.vol, 1400);
  const up = dir === "up";
  return (
    <div className="flex flex-col items-center px-3 py-1.5 border-r border-white/8 min-w-[90px]">
      <div className="text-[9px] text-white/65 uppercase tracking-wider">{item.label}</div>
      <div className={`text-sm font-black font-mono transition-colors ${up ? "text-[#00e676]" : "text-[#ff1744]"}`}>
        {item.unit === "B" || item.unit === "M" ? `${val.toFixed(item.dec)}${item.unit}` : `${val.toFixed(item.dec)}${item.unit}`}
      </div>
      <div className={`text-[9px] flex items-center gap-0.5 ${up ? "text-[#00e676]" : "text-[#ff1744]"}`}>
        {up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
        {up ? "▲" : "▼"}{Math.abs(rand(0.01, 0.12)).toFixed(2)}%
      </div>
    </div>
  );
}

// ── Right price list row ──────────────────────────────────────────────────
function PriceRow({ row, rank }: { row: typeof RIGHT_ROWS[0]; rank: number }) {
  const { val, dir } = useAnimatedValue(row.value, row.vol, 1600);
  const up = dir === "up";
  const mini = genSeries(8, row.value, row.vol * 3);
  return (
    <div className="flex items-center gap-2 px-2 py-1 border-b border-white/5">
      <span className="text-[9px] text-white/55 w-3">{rank}</span>
      <span className="text-[10px] text-white/85 w-16 truncate">{row.label}</span>
      <div className="w-16 h-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mini}><Line dataKey="v" stroke={up ? C.green : C.red} strokeWidth={1} dot={false} /></LineChart>
        </ResponsiveContainer>
      </div>
      <span className={`text-xs font-bold font-mono ml-auto ${up ? "text-[#00e676]" : "text-[#ff1744]"}`}>
        {val.toFixed(0)}
      </span>
    </div>
  );
}

// ── Rolling chart with live data appending ────────────────────────────────
function LiveAreaChart({ color, baseData, vol, height = 80 }: { color: string; baseData: { t: number; v: number }[]; vol: number; height?: number }) {
  const [data, setData] = useState(baseData.slice(-30));
  const tRef = useRef(baseData.length);
  useEffect(() => {
    const id = setInterval(() => {
      setData(d => {
        const last = d[d.length - 1]?.v ?? 0;
        const next = { t: tRef.current++, v: +(last + rand(-vol, vol)).toFixed(2) };
        return [...d.slice(-29), next];
      });
    }, 900 + rand(0, 300));
    return () => clearInterval(id);
  }, [vol]);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`g${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5}
          fill={`url(#g${color.replace("#","")})`} dot={false} isAnimationActive={false} />
        <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid #ffffff15", fontSize: 10, color: "#fff" }}
          labelFormatter={() => ""} formatter={(v: number) => [v.toFixed(2), ""]} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function LiveBarChart({ color, baseData, vol, height = 70 }: { color: string; baseData: { t: number; v: number }[]; vol: number; height?: number }) {
  const [data, setData] = useState(baseData.slice(-25));
  const tRef = useRef(baseData.length);
  useEffect(() => {
    const id = setInterval(() => {
      setData(d => {
        const last = d[d.length - 1]?.v ?? 100;
        const next = { t: tRef.current++, v: Math.max(10, +(last + rand(-vol, vol)).toFixed(0)) };
        return [...d.slice(-24), next];
      });
    }, 700 + rand(0, 200));
    return () => clearInterval(id);
  }, [vol]);
  const max = Math.max(...data.map(d => d.v));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }} barCategoryGap={1}>
        <Bar dataKey="v" radius={[1,1,0,0]} isAnimationActive={false}>
          {data.map((d, i) => <Cell key={i} fill={d.v === max ? C.amber : color} />)}
        </Bar>
        <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid #ffffff15", fontSize: 10, color: "#fff" }}
          labelFormatter={() => ""} formatter={(v: number) => [v.toFixed(0), ""]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Candlestick chart (simulated via ComposedChart) ────────────────────────
function CandleChart({ baseData, height = 100 }: { baseData: ReturnType<typeof genCandles>; height?: number }) {
  const [data, setData] = useState(baseData.slice(-20));
  const priceRef = useRef(baseData[baseData.length - 1]?.close ?? 1);
  const tRef = useRef(baseData.length);
  useEffect(() => {
    const id = setInterval(() => {
      setData(d => {
        const price = priceRef.current;
        const vol = rand(0.01, 0.06);
        const open = price;
        const close = +(open + rand(-vol, vol)).toFixed(4);
        priceRef.current = close;
        return [...d.slice(-19), { t: tRef.current++, open, close, high: +(Math.max(open,close)+rand(0,vol*0.5)).toFixed(4), low: +(Math.min(open,close)-rand(0,vol*0.5)).toFixed(4), up: close >= open }];
      });
    }, 800);
    return () => clearInterval(id);
  }, []);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <XAxis dataKey="t" hide />
        <YAxis domain={["auto","auto"]} hide width={0} />
        <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid #ffffff15", fontSize: 10, color: "#fff" }}
          labelFormatter={() => ""} formatter={(v: number, n) => [v.toFixed(4), n]} />
        <Bar dataKey="close" shape={(props: Record<string,unknown>) => <CandleBar {...props as { x:number;y:number;width:number;height:number }} up={!!(props as { up?: boolean }).up} />} isAnimationActive={false}>
          {data.map((d,i) => <Cell key={i} fill={d.up ? C.green : C.red} />)}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────
export default function BriefingDashboard() {
  const mainSpend = useAnimatedValue(1.3748, 0.0012, 600);
  const spend2    = useAnimatedValue(0.8477, 0.0008, 700);
  const spend3    = useAnimatedValue(0.719,  0.001,  650);
  const bigNum    = useAnimatedValue(425,    2,      900);
  const bigNum2   = useAnimatedValue(339,    1.5,    1100);
  const pctA      = useAnimatedValue(26.1,   0.05,   1200);
  const pctB      = useAnimatedValue(452,    1,      800);
  // Scrolling tile state
  const [tileOffset, setTileOffset] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTileOffset(o => o + 1), 50);
    return () => clearInterval(id);
  }, []);

  const cardCls = "bg-[#0a1628] border border-white/8 rounded-none overflow-hidden flex flex-col";
  const titleCls = "text-[9px] font-bold text-white/65 uppercase tracking-widest px-3 pt-2 pb-1";

  return (
    <div className="flex flex-col h-full bg-[#050d1a] text-white overflow-hidden select-none" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace, sans-serif" }}>

      {/* ── Top ticker bar ──────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-[#0a1628] border-b border-white/10 flex items-center overflow-x-auto scrollbar-none">
        <div className="flex-shrink-0 px-3 py-1 flex items-center gap-1.5 border-r border-white/10">
          <span className="text-[10px] font-bold text-[#2563eb]">APPOIS</span>
          <span className="text-[8px] text-white/55">LIVE</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#00e676] animate-pulse" />
        </div>
        {TICKER_ITEMS.map((item, i) => <TickerCell key={i} item={item} />)}
      </div>

      {/* ── Main grid ───────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 gap-px bg-[#0d1829]">

        {/* Col 1 — area chart + big number */}
        <div className="flex flex-col gap-px" style={{ width: "16%" }}>
          <div className={`${cardCls} flex-1`}>
            <div className={titleCls}>Spend Flow</div>
            <div className="px-3 pb-1 flex-1 flex flex-col justify-between">
              <div className={`text-xl font-black font-mono ${mainSpend.dir==="up"?"text-[#00e676]":"text-[#ff1744]"}`}>
                {mainSpend.val.toFixed(4)}B
              </div>
              <div className="text-[9px] text-white/55">-{rand(0.1,0.2).toFixed(4)} demeter</div>
              <LiveAreaChart color={C.teal} baseData={INIT_MAIN} vol={0.003} height={60} />
            </div>
          </div>
          <div className={`${cardCls} flex-shrink-0 h-24`}>
            <div className={titleCls}>Budget Pool</div>
            <div className="px-3 py-1">
              <div className={`text-2xl font-black font-mono ${bigNum.dir==="up"?"text-[#00e676]":"text-[#ff1744]"}`}>
                ${bigNum.val.toFixed(0)}M
              </div>
              <LiveAreaChart color={C.green} baseData={genSeries(20, 425, 3)} vol={1} height={32} />
            </div>
          </div>
        </div>

        {/* Col 2 — 3 mini KPI boxes + candlestick */}
        <div className="flex flex-col gap-px" style={{ width: "28%" }}>
          <div className="flex gap-px flex-shrink-0">
            {[
              { label: "Supplier", val: spend2, suffix: "B" },
              { label: "Contracts", val: spend3, suffix: "B" },
            ].map((item, i) => (
              <div key={i} className={`${cardCls} flex-1 h-20`}>
                <div className={titleCls}>{item.label}</div>
                <div className="px-3">
                  <div className={`text-lg font-black font-mono ${item.val.dir==="up"?"text-[#00e676]":"text-[#ff1744]"}`}>
                    {item.val.val.toFixed(4)}{item.suffix}
                  </div>
                  <div className="flex gap-1 text-[9px] text-white/60 mt-0.5">
                    <span className="text-[#00e676]">+{rand(1,9).toFixed(0)}</span>
                    <span>Focus</span>
                    <span className="text-[#ff1744]">-{rand(0.5,2).toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2 text-[9px] mt-0.5">
                    <span className="text-white/50">Avg: <span className="text-white font-bold">{pctA.val.toFixed(1)}</span></span>
                    <span className="text-[#00e676]">{pctB.val.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className={`${cardCls} flex-1 h-20`}>
              <div className={titleCls}>Talliers</div>
              <div className="px-2 space-y-0.5">
                {[["Loss", 11.82, 0.04], ["Purch", "+21.68", 0], ["Top Q", "16.12", 0], ["Bal", "27.611", 0]].map(([l, v, vol], i) => {
                  const { val: lv, dir } = useAnimatedValue(parseFloat(String(v)) || 0, parseFloat(String(vol)) || 0.02, 1000 + i * 200);
                  return (
                    <div key={i} className="flex justify-between text-[9px]">
                      <span className="text-white/65">{l}</span>
                      <span className={dir==="up"?"text-[#00e676]":"text-[#ff1744]"}>{isNaN(parseFloat(String(v))) ? v : lv.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Candlestick / procurement flow */}
          <div className={`${cardCls} flex-1`}>
            <div className={titleCls}>Procurement Flow — Tender Cycle (Candle)</div>
            <div className="flex-1 px-2 pb-1">
              <CandleChart baseData={INIT_CANDLES} height={120} />
            </div>
          </div>
        </div>

        {/* Col 3 — Spend tracker + Risk chart */}
        <div className="flex flex-col gap-px" style={{ width: "28%" }}>
          <div className={`${cardCls} flex-shrink-0 h-24`}>
            <div className={`${titleCls} flex items-center justify-between pr-3`}>
              <span>Spend Tracker</span>
              <span className="text-[#00e676]">USD {(rand(1.70, 1.75)).toFixed(2)}B</span>
            </div>
            <div className="px-2 flex-1">
              <LiveAreaChart color={C.green} baseData={genSeries(30, 1.72, 0.01)} vol={0.005} height={50} />
            </div>
          </div>
          <div className={`${cardCls} flex-1`}>
            <div className={titleCls}>Risk Exposure — Rolling 60-day</div>
            <div className="flex-1 px-2 pb-1">
              <LiveBarChart color={C.red} baseData={INIT_RISK} vol={15} height={100} />
            </div>
          </div>
          <div className={`${cardCls} flex-shrink-0 h-20`}>
            <div className={titleCls}>Budget Absorption Trend</div>
            <div className="px-2">
              <LiveAreaChart color={C.amber} baseData={INIT_NOISE} vol={20} height={48} />
            </div>
          </div>
        </div>

        {/* Col 4 — Right price list + big value */}
        <div className="flex flex-col gap-px" style={{ width: "28%" }}>
          <div className={`${cardCls} flex-1`}>
            <div className={`${titleCls} flex items-center justify-between pr-3`}>
              <span>Ministry Spend (USD M)</span>
              <Activity className="h-3 w-3 text-white/55" />
            </div>
            <div className="flex-1">
              {RIGHT_ROWS.map((r, i) => <PriceRow key={i} row={r} rank={i+1} />)}
            </div>
          </div>
          <div className={`${cardCls} flex-shrink-0`}>
            <div className={titleCls}>Rendity Index</div>
            <div className="px-3 pb-1">
              <div className={`text-2xl font-black font-mono ${bigNum2.dir==="up"?"text-[#00e676]":"text-[#ff1744]"}`}>
                ${bigNum2.val.toFixed(0)}M
              </div>
              <div className="text-[9px] text-[#00e676]">+215A({(rand(7500,7600)).toFixed(0)})</div>
              <LiveAreaChart color={C.green} baseData={INIT_RENDITY} vol={5} height={40} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom scrolling tile bar ────────────────────────────────── */}
      <div className="flex-shrink-0 bg-[#0a1628] border-t border-white/10 overflow-hidden" style={{ height: 56 }}>
        <div className="flex items-center h-full"
          style={{ transform: `translateX(-${tileOffset % 600}px)`, transition: "none", width: "max-content" }}>
          {[...Array(3)].flatMap(() => [
            { label: "Noise",      color: C.teal,  data: INIT_NOISE  },
            { label: "Vol Index",  color: C.amber, data: INIT_RISK   },
            { label: "Cycle Time", color: C.green, data: INIT_MAIN   },
            { label: "Bid Rate",   color: C.red,   data: INIT_RENDITY},
          ]).map((tile, i) => (
            <div key={i} className="flex items-center gap-2 px-4 border-r border-white/8 h-full" style={{ minWidth: 160 }}>
              <div>                <div className="text-[8px] text-white/55 uppercase">{tile.label}</div>
                <div className={`text-xs font-bold font-mono ${i%2===0?"text-[#00e676]":"text-[#ff1744]"}`}>
                  {(tile.data[tile.data.length-1]?.v ?? 0).toFixed(2)}
                </div>
              </div>
              <div style={{ width: 80, height: 32 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tile.data.slice(-15)} margin={{ top: 1, right: 0, left: 0, bottom: 0 }}>
                    <Area type="monotone" dataKey="v" stroke={tile.color} strokeWidth={1}
                      fill={`${tile.color}22`} dot={false} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
