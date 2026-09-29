'use client'

import { useState } from 'react'
import s from './quote-builder.module.css'

export function QuoteLogin({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/quotes/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (response.ok) {
        window.location.reload()
        return
      }
      setError(response.status === 401 ? 'That password is not right. Try again.' : 'Sign-in is not set up yet.')
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    }
    setBusy(false)
  }

  return (
    <div className={s.root}>
      <div className={s.login}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/quote/logo.png" alt="Urban Rasoi" width={64} height={64} />
        <h1 className={s.loginTitle}>
          House party <em>quote</em>
        </h1>
        {configured ? (
          <form onSubmit={submit} className={s.loginForm}>
            <label className={s.field}>
              <span className={s.lbl}>Staff password</span>
              <input
                id="qb-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </label>
            {error && <p className={s.error}>{error}</p>}
            <button className={`${s.btn} ${s.primary}`} type="submit" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        ) : (
          <p className={s.note}>
            The quote builder needs a staff password before anyone can use it. Add QUOTE_BUILDER_PASSWORD in Vercel → Settings →
            Environment Variables, then redeploy.
          </p>
        )}
      </div>
    </div>
  )
}
