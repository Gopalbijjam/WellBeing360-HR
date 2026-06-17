import React from 'react';

// 1. Line Chart for steps/wellness logs
interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
}

export function LineChart({ data, height = 180 }: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-xl" style={{ height }}>
        <p className="text-xs text-slate-400">No activity data logged yet</p>
      </div>
    );
  }

  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, 1000);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal;

  const width = 500;
  const padding = 40;

  // Calculate coordinates
  const points = data.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / Math.max(1, data.length - 1);
    const y = height - padding - ((d.value - minVal) * (height - padding * 2)) / Math.max(1, range);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Fill path coordinate to create gradient area below line
  const fillD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d09c" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00d09c" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f1f5f9" strokeWidth="1" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="1.5" />

        {/* Gradient fill */}
        {fillD && <path d={fillD} fill="url(#chart-grad)" />}

        {/* Spark line path */}
        {pathD && <path d={pathD} fill="none" stroke="#00d09c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            <circle cx={p.x} cx-hover={p.x} cy={p.y} r="3" fill="#ffffff" stroke="#00d09c" strokeWidth="2" />
            <circle cx={p.x} cy={p.y} r="8" fill="#00d09c" fillOpacity="0" className="hover:fill-opacity-10 transition-all duration-200" />
            <title>{`${p.label}: ${p.value.toLocaleString()}`}</title>
          </g>
        ))}

        {/* Labels */}
        {points.map((p, i) => {
          if (i === 0 || i === points.length - 1 || i === Math.floor(points.length / 2)) {
            return (
              <text key={i} x={p.x} y={height - 12} fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="500">
                {p.label}
              </text>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
}

// 2. Donut Chart for Premium Splits
interface DonutChartProps {
  employee: number;
  employer: number;
}

export function DonutChart({ employee, employer }: DonutChartProps) {
  const total = employee + employer;
  const empPercent = total > 0 ? (employee / total) * 100 : 0;
  const erPercent = total > 0 ? (employer / total) * 100 : 0;

  // SVG parameters
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  const empOffset = circumference - (empPercent / 100) * circumference;
  const erOffset = circumference - (erPercent / 100) * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
          {/* Employer contribution ring */}
          <circle 
            cx="60" 
            cy="60" 
            r={radius} 
            fill="none" 
            stroke="#5367ff" 
            strokeWidth={strokeWidth} 
            strokeDasharray={circumference}
            strokeDashoffset={erOffset}
            strokeLinecap="round"
          />
          {/* Employee contribution ring */}
          <circle 
            cx="60" 
            cy="60" 
            r={radius} 
            fill="none" 
            stroke="#00d09c" 
            strokeWidth={strokeWidth} 
            strokeDasharray={circumference}
            strokeDashoffset={empOffset}
            transform={`rotate(${(erPercent / 100) * 360} 60 60)`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total</span>
          <span className="text-lg font-bold text-slate-800">${total}/mo</span>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        <div className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 bg-accent rounded-full shrink-0"></span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-500">Employer Premium</p>
            <p className="text-base font-bold text-slate-800">${employer}/mo ({erPercent.toFixed(0)}%)</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 bg-primary rounded-full shrink-0"></span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-500">Employee Premium</p>
            <p className="text-base font-bold text-slate-800">${employee}/mo ({empPercent.toFixed(0)}%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Bar Chart for general dashboard usage
interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
}

export function BarChart({ data }: BarChartProps) {
  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, 100);

  return (
    <div className="space-y-4">
      {data.map((d, i) => {
        const percent = (d.value / maxVal) * 100;
        return (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>{d.label}</span>
              <span className="text-slate-800">{d.value.toLocaleString()}</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500" 
                style={{ 
                  width: `${percent}%`, 
                  backgroundColor: d.color || '#00d09c' 
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
