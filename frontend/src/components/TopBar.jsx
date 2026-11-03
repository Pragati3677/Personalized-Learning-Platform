export default function TopBar({
  title,
  subtitle,
  rightContent,
  onMenuClick
}) {
  return <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onMenuClick && <button onClick={onMenuClick} className="text-slate-500 hover:text-slate-800 mr-1">
            ☰
          </button>}
        <div>
          <h1 className="text-lg font-700 text-slate-900" style={{
          fontFamily: "'DM Sans',sans-serif",
          fontWeight: 700
        }}>
            {title}
          </h1>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {rightContent}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>;
}
