import { useEffect, useState } from 'react'
import { getHello } from './api'

type Status = 'loading' | 'ok' | 'error'

function App() {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    getHello()
      .then((data) => {
        setMessage(data.message)
        setStatus('ok')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main>
      <h1>Hello from React!</h1>
      <p>
        Backend says: {status === 'loading' && <em>loading…</em>}
        {status === 'ok' && <strong>{message}</strong>}
        {status === 'error' && (
          <span className="error">could not reach the backend. Is Flask running?</span>
        )}
      </p>
    </main>
  )
}

export default App
