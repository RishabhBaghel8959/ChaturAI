import React from 'react'
import Message from './Message.jsx'

const DEFAULT_MESSAGES = [
  { role: 'assistant', kind: 'text', content: 'Hi! Ask me anything about data science, or choose Resources/Code/Explain.' },
]

export default function Chat() {
  const [messages, setMessages] = React.useState(DEFAULT_MESSAGES)
  const [question, setQuestion] = React.useState('')
  const [intent, setIntent] = React.useState('qa')
  const [topic, setTopic] = React.useState('')
  const [level, setLevel] = React.useState('beginner')
  const [busy, setBusy] = React.useState(false)
  const controllerRef = React.useRef(null)

  const send = async () => {
    if (!question.trim() || busy) return
    setBusy(true)
    const userMsg = { role: 'user', kind: 'text', content: question }
    setMessages(prev => [...prev, userMsg])

    try {
      controllerRef.current?.abort?.()
      controllerRef.current = new AbortController()
      const res = await fetch('/api/tutor/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controllerRef.current.signal,
        body: JSON.stringify({ question, intent, topic: topic || undefined, level }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      if (data.resources?.length) {
        setMessages(prev => [...prev, { role: 'assistant', kind: 'resources', resources: data.resources }])
      } else if (data.code) {
        setMessages(prev => [...prev, { role: 'assistant', kind: 'code', code: data.code }])
      } else if (data.answer) {
        setMessages(prev => [...prev, { role: 'assistant', kind: 'text', content: data.answer }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', kind: 'text', content: 'No response.' }])
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', kind: 'text', content: `Error: ${e?.message || e}` }])
    } finally {
      setBusy(false)
      setQuestion('')
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((m, i) => (
          <Message key={i} {...m} />
        ))}
      </div>
      <div className="controls">
        <div className="row">
          <div className="segmented">
            {['qa','resources','code','explain'].map(k => (
              <button
                key={k}
                className={`seg ${intent === k ? 'active' : ''}`}
                onClick={() => setIntent(k)}
                aria-pressed={intent === k}
              >{k}</button>
            ))}
          </div>
          <select className="select" value={level} onChange={e => setLevel(e.target.value)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input className="input" placeholder="Optional topic (e.g., pandas)" value={topic} onChange={e => setTopic(e.target.value)} />
        </div>
        <div className="row">
          <textarea
            className="textarea"
            placeholder="Ask a question..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={onKey}
            rows={2}
          />
          <button className="btn primary" onClick={send} disabled={busy}>
            {busy ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}