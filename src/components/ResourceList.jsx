import React from 'react'

export default function ResourceList({ resources = [] }) {
  if (!resources?.length) return null
  return (
    <div className="resources">
      {resources.map((r, idx) => (
        <a className="resource" key={`${r.url}-${idx}`} href={r.url} target="_blank" rel="noreferrer">
          <div className="resource-title">{r.title}</div>
          <div className="resource-meta">
            <span className={`pill pill-${r.level}`}>{r.level}</span>
            <span className="pill">{r.type}</span>
          </div>
        </a>
      ))}
    </div>
  )
}