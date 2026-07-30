import { Settings as SettingsIcon, Bell, Globe, Lock } from 'lucide-react'

const sections = [
  { icon: Bell, title: 'Notifications', desc: 'Manage alerts for pending reviews and verifier updates.' },
  { icon: Globe, title: 'Language', desc: 'Switch portal language between English and Gujarati.' },
  { icon: Lock, title: 'Security', desc: 'Update password policy and session timeout.' },
]

export default function Settings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-sky-900 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6" /> Settings
        </h1>
        <p className="text-sky-800/60 text-sm mt-1">Portal-wide preferences (demo only).</p>
      </div>
      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 divide-y divide-sky-50">
        {sections.map((s) => (
          <div key={s.title} className="flex items-center gap-4 px-6 py-5">
            <div className="w-11 h-11 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-bold text-sky-900 text-sm">{s.title}</p>
              <p className="text-xs text-sky-700/60">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
