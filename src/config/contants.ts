export const BINANCE_WS_URL =
  import.meta.env.VITE_WS_URL ||
  "wss://stream.binance.com:9443/ws/btcusdt@trade";

export const RECONNECT_DELAY = 3000;