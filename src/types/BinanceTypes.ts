export interface BinancePayload {
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  T: number; // Trade time
  m: boolean; // Is the buyer the market maker?
}

export interface BinanceTrade {
  id: number;
  time: number;
  price: number;
  quantity: number;
  isBuyerMaker: boolean;
}

export interface ChartData {
  time: string;
  price: number;
}

export type ConnectionStatus = "connected" | "disconnected" | "connecting";

export interface ConfigStatus {
  text: string;
  badgeClass: string;
  dotClass: string;
}
