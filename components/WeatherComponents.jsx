import { GH, displayTemp } from './WeatherUtils';
// import IconComponent from './IconComponent';
export const Card = ({ children, style = {} }) => (
  <div
    style={{
      background: GH.surface,
      border: `1px solid ${GH.border}`,
      borderRadius: 12,
      ...style,
    }}
  >
    {children}
  </div>
);

export const StatCell = ({ label, value, accent }) => (
  <div
    style={{
      background: GH.surface,
      border: `1px solid ${GH.border}`,
      borderRadius: 10,
      padding: '12px 10px',
      textAlign: 'center',
    }}
  >
    <p
      style={{
        fontSize: 18,
        fontWeight: 700,
        color: accent || GH.text,
        margin: 0,
      }}
    >
      {value}
    </p>
    <p
      style={{
        fontSize: 10,
        fontWeight: 600,
        color: GH.textMuted,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        margin: '3px 0 0',
      }}
    >
      {label}
    </p>
  </div>
);

export const ForecastRow = ({ f, unit, isLast, IconComponent }) => (
  <div
    className='forcastrow'
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: isLast ? 'none' : `1px solid ${GH.borderSub}`,
    }}
  >
    <span style={{ fontSize: 13, fontWeight: 700, color: GH.text, width: 34 }}>
      {f.day}
    </span>
    <IconComponent code={f.code} size={26} />
    <div style={{ display: 'flex', gap: 16, fontSize: 13, fontWeight: 600 }}>
      <span style={{ color: GH.textMuted }}>{displayTemp(f.lowC, unit)}°</span>
      <span style={{ color: GH.text }}>{displayTemp(f.highC, unit)}°</span>
    </div>
  </div>
);
