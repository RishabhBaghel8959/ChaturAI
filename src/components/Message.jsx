import React from 'react'
import CodeBlock from './CodeBlock.jsx'
import ResourceList from './ResourceList.jsx'

export default function Message({ role, kind = 'text', content, code, resources }) {
  const isUser = role === 'user'
  return (
    <div className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div className="avatar">{isUser ? '🧑' : '🤖'}</div>
      <div className="bubble">
        {kind === 'code' && code ? (
          <CodeBlock code={code} />
        ) : kind === 'resources' && resources ? (
          <ResourceList resources={resources} />
        ) : (
          <p className="text-content">{content}</p>
        )}
      </div>
    </div>
  )
}