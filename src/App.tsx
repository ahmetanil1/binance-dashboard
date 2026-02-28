import { lazy, Suspense, useEffect, useState } from "react";
import { useBinanceSocket } from "@/hooks/useBinanceSocket";
import { formatDuration } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfigStatus, ConnectionStatus } from "./types";
import { Loader } from "lucide-react";

// Bileşenleri Lazy Load (Tembel yükleme) ile tanımlıyoruz
const LiveChart = lazy(() =>
  import("@/components/LiveChart").then((module) => ({
    default: module.LiveChart,
  })),
);

const TradeList = lazy(() =>
  import("@/components/TradeList").then((module) => ({
    default: module.TradeList,
  })),
);

const STATUS_CONFIG: Record<ConnectionStatus, ConfigStatus> = {
  connected: {
    text: "Connected",
    badgeClass: "text-green-500 border-green-500/20 bg-green-500/10 ",
    dotClass: "bg-green-500",
  },
  connecting: {
    text: "Connecting",
    badgeClass: "text-yellow-500 border-yellow-500/20 bg-yellow-500/10 ",
    dotClass: "bg-yellow-500",
  },
  disconnected: {
    text: "Disconnected",
    badgeClass: "text-red-500 border-red-500/20 bg-red-500/10 ",
    dotClass: "bg-red-500",
  },
};

function App() {
  const {
    status,
    currentPrice,
    initialPrice,
    percentageChange,
    trades,
    chartData,
  } = useBinanceSocket();

  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSessionTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const isPositive = percentageChange >= 0;
  const currentStatusConfig = STATUS_CONFIG[status];

  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 p-6 font-sans">
      {/* App Shell: Header her zaman görünür kalır (UX Standardı) */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            BTC/USDT
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Badge variant="outline" className={currentStatusConfig.badgeClass}>
              <div
                className={`w-2 h-2 rounded-full mr-2 ${currentStatusConfig.dotClass}`}
              ></div>
              {currentStatusConfig.text}
            </Badge>  
          </div>
        </div>
        <div className="flex gap-8 text-right">
          <div>
            <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold">
              Session Duration
            </div>
            <div className="font-mono font-bold text-lg">
              {formatDuration(sessionTime)}
            </div>
          </div>
        </div>
      </header>

      {/* Tüm içerik grid yapısını tek bir Suspense içine alıyoruz */}
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] w-full">
            <Loader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-[#16181c] border-slate-800 rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-200">
                    Initial Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-slate-200 font-bold font-mono">
                    $
                    {initialPrice.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#16181c] border-slate-800 rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-200">
                    Current Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-slate-200 font-bold font-mono">
                    $
                    {currentPrice.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#16181c] border-slate-800 rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-200">
                    Percentage Change
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-3xl font-bold font-mono ${isPositive ? "text-green-500" : "text-red-500"}`}
                  >
                    {isPositive ? "+" : ""}
                    {percentageChange.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            <LiveChart data={chartData} />
          </div>

          <div className="lg:col-span-1 h-166">
            <TradeList trades={trades} />
          </div>
        </div>
      </Suspense>
    </div>
  );
}

export default App;
