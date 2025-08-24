import React from 'react'

export default function TopBar() {
  const [theme, setTheme] = React.useState(
    () => localStorage.getItem('theme') || 'dark'
  )

  React.useEffect(() => {
    document.querySelector('.app')?.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <header className="topbar">
      <div className="brand">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path fill="currentColor" d="M12 2l3.5 6H22l-5 4 2 8-7-4-7 4 2-8-5-4h6.5z"/>
        </svg>
        <span>DS Tutor</span>
      </div>
      <div className="actions">
        <button
          className="btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </header>
  )
}