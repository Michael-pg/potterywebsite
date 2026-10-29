import { useEffect, useState } from 'react'

const readLocation = () => ({
  path: window.location.pathname,
  query: new URLSearchParams(window.location.search),
})

// Two pages and a modal don't need a router library: track the URL and
// intercept internal link clicks so navigation stays client-side.
export function useLocation() {
  const [location, setLocation] = useState(readLocation)

  useEffect(() => {
    const onPop = () => setLocation(readLocation())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return location
}

export function navigate(to, { replace = false, state = {} } = {}) {
  window.history[replace ? 'replaceState' : 'pushState'](state, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function Link({ to, state, keepScroll = false, onClick, ...props }) {
  const handleClick = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    const here = window.location.pathname + window.location.search
    if (here !== to) navigate(to, { state })
    if (!keepScroll) window.scrollTo(0, 0)
  }

  return <a href={to} onClick={handleClick} {...props} />
}
