# 🚀 Real-Time Crypto Dashboard (LTTB Optimized)

Bu proje, Binance WebSocket API üzerinden gelen yüksek frekanslı verileri, istemci tarafında (client-side) donma yaşatmadan işleyen ve görselleştiren ileri düzey bir dashboard uygulamasıdır.

---

## 🇺🇸 English Summary

A high-performance trading dashboard focused on memory management and rendering efficiency. It features a custom **LTTB (Largest-Triangle-Three-Buckets)** downsampling algorithm to visualize massive datasets (10k+ points) while maintaining a smooth 60 FPS.

### 🛠 Tech Stack & Engineering Focus

| Technology          | Core Implementation                                            |
| :------------------ | :------------------------------------------------------------- |
| **React 19**        | Concurrent rendering and custom hooks for data orchestration.  |
| **TypeScript**      | Strict type definitions for WebSocket payloads and chart data. |
| **Tailwind CSS v4** | Latest zero-runtime CSS engine for maximum performance.        |
| **Recharts 2.15.1** | Customized with SVG filters and monotone interpolation.        |

### 🏗 Key Architectural Decisions

#### 1. Performance: The LTTB Downsampling

- **Problem:** Rendering 10,000+ points crashes the browser DOM and spikes CPU usage.
- **Solution:** Implemented the LTTB algorithm to reduce 10,000 raw points to just 500 "smart points".
- **Impact:** Maintained visual extrema (peaks/dips) while reducing DOM nodes by 95%.

#### 2. Data Strategy: Buffer-Throttling Pattern

- **Ingestion:** Incoming messages (up to 50/sec) are pushed to a non-reactive `useRef` buffer.
- **Flush:** A 500ms interval synchronizes the buffer to the UI state.
- **Benefit:** Prevents "Main Thread Blocking" and ensures a consistent frame rate.

#### 3. UX: Interactive Navigation (Pan & Zoom)

- **Live Mode:** Default state where the chart auto-scrolls with incoming trades.
- **History Mode:** Drag-to-move (panning) and mouse-wheel (zooming) functionality.
- **Go Live:** Intelligent auto-scroll locking that allows history inspection without stopping background data ingestion.

---

## 🇹🇷 Türkçe Özet

Yüksek frekanslı borsa verilerini yönetmek için tasarlanmış, bellek optimizasyonu ve render verimliliği odaklı bir dashboard projesidir.

**Öne Çıkan Teknik Özellikler:**

- **LTTB Algoritması:** 10.000 veri noktasını, görsel karakteristiği bozmadan 500 noktaya indirgeyerek CPU yükünü minimize eder.
- **Hibrit Veri Akışı:** WebSocket verilerini `useRef` ile tamponlayarak saniyede 50+ güncellemenin UI'ı kilitlemesini engeller.
- **Dinamik Navigasyon:** Geçmişe dönük inceleme (Pan) ve yakınlaşma (Zoom) özellikleriyle profesyonel trading deneyimi sunar.
- **Oturum Takibi:** Bağlantı anındaki fiyatı baz alarak anlık kâr/zarar (Session Performance) hesaplaması yapar.
