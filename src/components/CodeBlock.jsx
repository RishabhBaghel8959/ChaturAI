import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CodeBlock({ code = '', language = 'python' }) {
  const theme = document.querySelector('.app')?.getAttribute('data-theme') || 'dark'
  const [copied, setCopied] = React.useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span className="code-lang">{language}</span>
        <button className="btn btn-small" onClick={onCopy}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <SyntaxHighlighter language={language} style={theme === 'dark' ? oneDark : oneLight} customStyle={{ margin: 0, borderRadius: '8px' }}>
        {code}
      </SyntaxHighlighter>
    </div>
  )
}