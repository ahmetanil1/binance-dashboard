import { useState, useEffect, useRef } from "react";
import { BinancePayload, BinanceTrade, ChartData } from "@/types";
import { formatTime } from "@/utils/formatters";
import { BINANCE_WS_URL, RECONNECT_DELAY } from "@/config";
import { ConnectionStatus } from "@/types";

export const useBinanceSocket = () => {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [initialPrice, setInitialPrice] = useState(0);
  const [trades, setTrades] = useState<BinanceTrade[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const tradesBuffer = useRef<BinanceTrade[]>([]);
  const latestPriceRef = useRef(0);
  const initialPriceRef = useRef(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const connectWS = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN || !navigator.onLine)
        return;

      const ws = new WebSocket(BINANCE_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("connected"); // Başarıyla bağlandı
        tradesBuffer.current = [];
        initialPriceRef.current = 0;
        latestPriceRef.current = 0;
      };

      ws.onclose = () => {
        wsRef.current = null;

        // Cihazda internet varsa sunucu bizi atmıştır, tekrar deniyoruz.
        if (navigator.onLine) {
          setStatus("connecting"); // Bağlantı koptu, tekrar bağlanmaya çalışıyor
          reconnectTimerRef.current = setTimeout(connectWS, RECONNECT_DELAY);
        } else {
          // İnternet tamamen yoksa direkt koptu diyoruz.
          setStatus("disconnected");
        }
      };

      ws.onmessage = (event) => {
        const data: BinancePayload = JSON.parse(event.data);
        const price = parseFloat(data.p);
        const quantity = parseFloat(data.q);

        const newTrade: BinanceTrade = {
          id: data.t,
          time: data.T,
          price,
          quantity,
          isBuyerMaker: data.m,
        };

        if (initialPriceRef.current === 0) {
          initialPriceRef.current = price;
        }
        latestPriceRef.current = price;

        tradesBuffer.current = [newTrade, ...tradesBuffer.current].slice(0, 50);
      };
    };

    connectWS();

    const handleOffline = () => {
      setStatus("disconnected");
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };

    const handleOnline = () => {
      setStatus("connecting"); // İnternet geri geldi, bağlanmaya çalışıyor
      connectWS();
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    const intervalId = setInterval(() => {
      if (tradesBuffer.current.length > 0) {
        setTrades([...tradesBuffer.current]);
        setCurrentPrice(latestPriceRef.current);

        setInitialPrice((prev) =>
          prev === 0 ? initialPriceRef.current : prev,
        );

        const latestTrade = tradesBuffer.current[0];
        const timeString = formatTime(latestTrade.time);

        setChartData((prev) => {
          const newData = [
            ...prev,
            { time: timeString, price: latestPriceRef.current },
          ];
          return newData.slice(-100);
        });
      }
    }, 1000);

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      clearInterval(intervalId);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const priceChange = currentPrice - initialPrice;
  const percentageChange =
    initialPrice > 0 ? (priceChange / initialPrice) * 100 : 0;

  return {
    status, // isConnected yerine dışarıya status veriyoruz
    currentPrice,
    initialPrice,
    percentageChange,
    trades,
    chartData,
  };
};
