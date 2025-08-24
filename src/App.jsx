import React from 'react'
import TopBar from './components/TopBar.jsx'
import Chat from './components/Chat.jsx'

export default function App() {
  return (
    <div className="app" data-theme={localStorage.getItem('theme') || 'dark'}>
      <TopBar />
      <main className="main">
        <Chat />
      </main>
      <footer className="footer">
        <span>DS Tutor • Interactive Data Science Assistant</span>
        <span>
          API: <code>/api/tutor/query</code>
        </span>
      </footer>
    </div>
  )
}