import { Languages } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function LanguageToggle({ className = '' }) {
  const { lang, toggleLang, t } = useLanguage()

  return (
    <button
      type="button"
      onClick={toggleLang}
      title={t('language')}
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-sky-200 bg-white px-3 py-1.5 text-xs font-heading font-bold text-sky-800 shadow-soft hover:bg-sky-50 transition-colors ${className}`}
    >
      <Languages className="w-3.5 h-3.5 text-sky-600" />
      <span>{lang === 'gu' ? t('english') : t('gujarati')}</span>
    </button>
  )
}
