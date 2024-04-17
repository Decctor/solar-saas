import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

export function useKey(key: string, cb: () => void) {
  const callbackRef = useRef(cb)
  useEffect(() => {
    callbackRef.current = cb
  }, [cb])
  useEffect(() => {
    function handle(event: any) {
      if (event.code === key) {
        // @ts-ignore
        callbackRef.current(event)
      }
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keypress', handle)
  }, [key])
}
export function useClickOutside(ref: React.MutableRefObject<any>, cb: () => void) {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        cb()
      }
    }
    document.addEventListener('click', (e) => handleClickOutside(e), true)
    return () => {
      document.removeEventListener('click', (e) => handleClickOutside(e), true)
    }
  }, [cb])
}

export function copyToClipboard(text: string | undefined) {
  if (text) {
    var dummy = document.createElement('textarea')
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy)
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text
    dummy.select()
    document.execCommand('copy')
    document.body.removeChild(dummy)
    toast.success('Copiado para área de transferência.')
  } else {
    toast.error('Conteúdo não disponível para cópia.')
  }
}
