import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { LANG_KEY, translations, formatMessage } from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem(LANG_KEY)
    const initial = saved === 'gu' || saved === 'en' ? saved : 'gu'
    if (typeof document !== 'undefined') {
      document.documentElement.lang = initial === 'gu' ? 'gu' : 'en'
    }
    return initial
  })

  const setLang = useCallback((next) => {
    const value = next === 'en' ? 'en' : 'gu'
    setLangState(value)
    localStorage.setItem(LANG_KEY, value)
    document.documentElement.lang = value === 'gu' ? 'gu' : 'en'
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === 'gu' ? 'en' : 'gu')
  }, [lang, setLang])

  const t = useCallback(
    (key, vars) => {
      const dict = translations[lang] || translations.gu
      const fallback = translations.en[key]
      const value = dict[key] ?? fallback ?? key
      return vars ? formatMessage(value, vars) : value
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, setLang, toggleLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
