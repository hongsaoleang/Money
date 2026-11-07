import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  Activity, 
  BarChart3, 
  Calendar, 
  ChevronDown, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { getProductSpecs } from '../utils/productSpecs';

const TIMEFRAMES = ['30D', '90D', '6M', '1Y'];
const METRICS = [
  { id: 'price', label: 'Price Trend', unit: '$', icon: DollarSign },
  { id: 'stock', label: 'Stock Level', unit: 'units', icon: Package },
  { id: 'demand', label: 'Market Demand', unit: '%', icon: Activity },
];

const ProductGraphDashboard = ({ products = [] }) => {
  const [selectedProductId, setSelectedProductId] = useState(
    products.length > 0 ? products[0].id : 'all'
  );
  const [activeMetric, setActiveMetric] = useState('price');
  const [activeTimeframe, setActiveTimeframe] = useState('6M');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Current selected product object
  const currentProduct = useMemo(() => {
    if (selectedProductId === 'all') return null;
    return products.find(p => p.id === Number(selectedProductId)) || products[0] || null;
  }, [products, selectedProductId]);

  const currentSpecs = useMemo(() => {
    return currentProduct ? getProductSpecs(currentProduct) : null;
  }, [currentProduct]);

  // Generate realistic, consistent timeline points based on product price/stock
  const graphData = useMemo(() => {
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const basePrice = currentProduct ? parseFloat(currentProduct.price) : 550;
    const baseStock = currentProduct ? (currentProduct.stockQuantity || 25) : 40;

    return months.map((month, idx) => {
      // Deterministic slight fluctuations based on index & product ID
      const variance = Math.sin(idx * 1.3 + (currentProduct ? currentProduct.id : 1)) * 0.12;
      const priceVal = Math.max(20, Math.round((basePrice * (1 + variance - (0.05 * (3 - idx) / 3))) * 100) / 100);
      const stockVal = Math.max(5, Math.round(baseStock + Math.cos(idx * 1.5) * 12));
      const demandVal = Math.min(99, Math.max(70, Math.round(85 + Math.sin(idx * 1.8) * 12)));

      let value = priceVal;
      let label = `$${priceVal.toFixed(2)}`;
      if (activeMetric === 'stock') {
        value = stockVal;
        label = `${stockVal} Units`;
      } else if (activeMetric === 'demand') {
        value = demandVal;
        label = `${demandVal}% Demand`;
      }

      return {
        month,
        value,
        label,
        priceVal,
        stockVal,
        demandVal,
        date: `2026 ${month} 15`,
      };
    });
  }, [currentProduct, activeMetric]);

  // SVG Geometry Calculation (width: 760, height: 220)
  const svgWidth = 760;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 30;

  const { points, pathD, areaD, minVal, maxVal } = useMemo(() => {
    if (graphData.length === 0) return { points: [], pathD: '', areaD: '', minVal: 0, maxVal: 100 };

    const values = graphData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    // Add 10% breathing room to min and max
    const range = (max - min) || 1;
    const paddedMin = Math.max(0, min - range * 0.15);
    const paddedMax = max + range * 0.15;
    const spread = (paddedMax - paddedMin) || 1;

    const computedPoints = graphData.map((d, i) => {
      const x = paddingX + (i / (graphData.length - 1)) * (svgWidth - paddingX * 2);
      const y = svgHeight - paddingY - ((d.value - paddedMin) / spread) * (svgHeight - paddingY * 2);
      return { ...d, x, y };
    });

    // Build smooth cubic Bézier curve
    let dStr = `M ${computedPoints[0].x} ${computedPoints[0].y}`;
    for (let i = 0; i < computedPoints.length - 1; i++) {
      const p0 = computedPoints[i];
      const p1 = computedPoints[i + 1];
      const cx = (p0.x + p1.x) / 2;
      dStr += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    // Area path (closed at the bottom)
    const lastP = computedPoints[computedPoints.length - 1];
    const firstP = computedPoints[0];
    const aStr = `${dStr} L ${lastP.x} ${svgHeight - paddingY} L ${firstP.x} ${svgHeight - paddingY} Z`;

    return {
      points: computedPoints,
      pathD: dStr,
      areaD: aStr,
      minVal: paddedMin,
      maxVal: paddedMax,
    };
  }, [graphData]);

  // Overall metric change from first to last point
  const trendPercent = useMemo(() => {
    if (graphData.length < 2) return '+0.0%';
    const first = graphData[0].value;
    const last = graphData[graphData.length - 1].value;
    const diff = ((last - first) / (first || 1)) * 100;
    return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
  }, [graphData]);

  const isPositive = !trendPercent.startsWith('-');

  return (
    <div className="product-dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header-row">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="section-badge">
              <BarChart3 size={13} className="text-indigo-400" /> Product Intelligence
            </span>
            <span className="live-telemetry-badge">
              <span className="pulse-dot green" /> Live Telemetry
            </span>
          </div>
          <h2 className="dashboard-main-title">
            Product <span className="gradient-text">Analytics</span> &amp; Market Trends
          </h2>
          <p className="dashboard-sub-title">
            Real-time price trajectory, inventory stock curve, and demand monitoring.
          </p>
        </div>

        {/* Product Selector Dropdown */}
        <div className="dashboard-selector-wrap">
          <label className="selector-label">Select Hardware Item:</label>
          <div className="selector-box">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="product-select-dropdown"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (${parseFloat(p.price).toFixed(2)})
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="dropdown-caret" />
          </div>
        </div>
      </div>

      {/* KPI Stats Cards Row */}
      <div className="dashboard-kpi-grid">
        <div className="kpi-glass-card">
          <div className="kpi-icon-wrap price">
            <DollarSign size={18} />
          </div>
          <div className="kpi-content">
            <span className="kpi-lbl">Current Price</span>
            <div className="flex items-baseline gap-2">
              <span className="kpi-val">
                ${currentProduct ? parseFloat(currentProduct.price).toFixed(2) : '550.00'}
              </span>
              <span className={`kpi-trend ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {trendPercent}
              </span>
            </div>
            <span className="kpi-sub">30-day index volatility</span>
          </div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-icon-wrap stock">
            <Package size={18} />
          </div>
          <div className="kpi-content">
            <span className="kpi-lbl">Stock Units Available</span>
            <div className="flex items-baseline gap-2">
              <span className="kpi-val">
                {currentProduct ? currentProduct.stockQuantity : 40} Units
              </span>
              <span className="kpi-status in-stock">Verified</span>
            </div>
            <span className="kpi-sub">Audited warehouse inventory</span>
          </div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-icon-wrap demand">
            <Activity size={18} />
          </div>
          <div className="kpi-content">
            <span className="kpi-lbl">Demand Velocity</span>
            <div className="flex items-baseline gap-2">
              <span className="kpi-val">
                {currentSpecs?.demandRating || '94% High Demand'}
              </span>
            </div>
            <span className="kpi-sub">Consumer engagement score</span>
          </div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-icon-wrap spec">
            <ShieldCheck size={18} />
          </div>
          <div className="kpi-content">
            <span className="kpi-lbl">Hardware Specification</span>
            <div className="flex items-baseline gap-2">
              <span className="kpi-val text-sm">
                {currentSpecs?.spec1 || 'Aerospace Grade'}
              </span>
            </div>
            <span className="kpi-sub">Origin: {currentProduct?.originCountry || 'Imported'}</span>
          </div>
        </div>
      </div>

      {/* Main Graph Card */}
      <div className="dashboard-graph-card">
        {/* Graph Controls Toolbar */}
        <div className="graph-toolbar">
          <div className="metric-switch-pills">
            {METRICS.map(m => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  className={`metric-pill ${activeMetric === m.id ? 'active' : ''}`}
                  onClick={() => setActiveMetric(m.id)}
                >
                  <Icon size={14} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          <div className="timeframe-switch-pills">
            {TIMEFRAMES.map(tf => (
              <button
                key={tf}
                className={`time-pill ${activeTimeframe === tf ? 'active' : ''}`}
                onClick={() => setActiveTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Interactive Line Chart */}
        <div className="svg-chart-container">
          <svg 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
            className="line-graph-svg"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Gradient for area fill under the curve */}
              <linearGradient id="curveAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
              </linearGradient>

              {/* Gradient for the neon line stroke */}
              <linearGradient id="curveLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="45%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              {/* Glowing filter for data points */}
              <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#38bdf8" floodOpacity="0.75" />
              </filter>
            </defs>

            {/* Horizontal Reference Grid Lines */}
            {[0.25, 0.5, 0.75].map((ratio, idx) => {
              const y = paddingY + ratio * (svgHeight - paddingY * 2);
              return (
                <line
                  key={idx}
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              );
            })}

            {/* Gradient Area Fill */}
            {areaD && (
              <path 
                d={areaD} 
                fill="url(#curveAreaGrad)" 
              />
            )}

            {/* Neon Glowing Line Curve */}
            {pathD && (
              <path 
                d={pathD} 
                fill="none" 
                stroke="url(#curveLineGrad)" 
                strokeWidth="3.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            )}

            {/* Data Point Nodes with Hover Interactivity */}
            {points.map((pt, i) => (
              <g 
                key={i} 
                className="graph-point-group"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Hit area */}
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r="18" 
                  fill="transparent" 
                  style={{ cursor: 'pointer' }}
                />
                {/* Outer halo */}
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={hoveredPoint?.month === pt.month ? 7 : 4.5} 
                  fill="#0f172a"
                  stroke="#38bdf8" 
                  strokeWidth="2.5"
                  filter="url(#glowFilter)"
                  style={{ transition: 'all 0.15s ease' }}
                />
                {/* Inner dot */}
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r="2" 
                  fill="#ffffff" 
                />
              </g>
            ))}

            {/* X-Axis Month Labels */}
            {points.map((pt, i) => (
              <text
                key={i}
                x={pt.x}
                y={svgHeight - 8}
                textAnchor="middle"
                fontSize="11"
                fill={hoveredPoint?.month === pt.month ? '#ffffff' : '#64748b'}
                fontWeight={hoveredPoint?.month === pt.month ? '700' : '500'}
                style={{ transition: 'fill 0.15s ease' }}
              >
                {pt.month}
              </text>
            ))}
          </svg>

          {/* Interactive Floating Tooltip */}
          {hoveredPoint && (
            <div 
              className="graph-floating-tooltip"
              style={{
                left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                top: `${(hoveredPoint.y / svgHeight) * 100}%`,
              }}
            >
              <div className="tooltip-date">{hoveredPoint.date}</div>
              <div className="tooltip-val">{hoveredPoint.label}</div>
              <div className="tooltip-item">{currentProduct?.name || 'Selected Product'}</div>
            </div>
          )}
        </div>

        {/* Graph Footer Summary */}
        <div className="graph-footer-summary">
          <div className="flex items-center gap-2">
            <span className="summary-dot" />
            <span className="summary-text">
              Showing active curve for <strong>{currentProduct?.name || 'All Hardware'}</strong>
            </span>
          </div>
          <div className="summary-specs-chips">
            {currentSpecs && (
              <>
                <span className="chip-spec">{currentSpecs.modelId}</span>
                <span className="chip-spec">{currentSpecs.spec1}</span>
                <span className="chip-spec">{currentSpecs.origin}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGraphDashboard;
