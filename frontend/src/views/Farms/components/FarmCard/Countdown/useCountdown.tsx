import { useCallback, useEffect, useState } from 'react'

/**
 * Consider this moving up to the global level
 */
const useCountdown = () => {
  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    return 0
  })

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    if (secondsRemaining > 0) {
      timer = setTimeout(() => {
        setSecondsRemaining((prevSecondsRemaining) => prevSecondsRemaining - 1)
      }, 1000)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [secondsRemaining, setSecondsRemaining])

  return { secondsRemaining}
}

export default useCountdown
