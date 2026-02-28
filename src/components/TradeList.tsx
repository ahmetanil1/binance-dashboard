import { BinanceTrade } from "@/types";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/utils/formatters";

interface TradeListProps {
  trades: BinanceTrade[];
}

export function TradeList({ trades }: TradeListProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden border-slate-800 bg-[#16181c]">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <h3 className="text-slate-200 font-medium text-sm uppercase tracking-wider">
            Live Trade History
          </h3>
        </div>
        <Badge
          variant="outline"
          className="text-green-500 border-green-500/20 bg-green-500/10 animate-pulse"
        >
          STREAMING
        </Badge>
      </CardHeader>

      <div className="grid grid-cols-3 px-6 py-3 text-xs text-slate-500 font-semibold border-b border-slate-800/50 uppercase">
        <span className="text-left">Time</span>
        <span className="text-right">Price (USDT)</span>
        <span className="text-right">Qty (BTC)</span>
      </div>

      <CardContent className="flex-1 p-0 overflow-hidden bg-[#16181c]">
        <ScrollArea className="h-full w-full px-6">
          <div className="py-4 space-y-2">
            {trades.map((trade, index) => (
              <div
                key={index}
                className="grid grid-cols-3 text-sm font-mono items-center"
              >
                <span className="text-slate-400 text-left">
                  {formatTime(trade.time)}
                </span>
                <span
                  className={`text-right ${trade.isBuyerMaker ? "text-red-500" : "text-green-500"}`}
                >
                  {trade.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-slate-300 text-right">
                  {trade.quantity.toFixed(5)}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
