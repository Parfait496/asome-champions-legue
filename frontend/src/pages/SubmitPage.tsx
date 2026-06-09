import { useState } from 'react'
import Card from '../components/ui/Card'
import SectionHeader from '../components/ui/SectionHeader'

type FormType = 'suggestion' | 'claim'

export default function SubmitPage() {
  const [type, setType] = useState<FormType>('suggestion')
  const [form, setForm] = useState({
    name: '', email: '', subject: '', message: '',
  })
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/submissions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, submission_type: type }),
      })
      if (res.ok) {
        setDone(true)
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setError('Failed to submit. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="font-display text-3xl text-gold mb-2">Submitted!</h2>
        <p className="text-gray-400 mb-6">
          Your {type} has been received. We will review it shortly.
        </p>
        <button
          onClick={() => setDone(false)}
          className="px-6 py-2.5 bg-gold text-dark font-bold rounded-lg"
        >
          Submit Another
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <SectionHeader title="Contact &" highlight="Feedback" />

      {/* Type selector */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setType('suggestion')}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
            type === 'suggestion'
              ? 'bg-gold text-dark'
              : 'bg-surface border border-border text-gray-400'
          }`}
        >
          💡 Suggestion
        </button>
        <button
          onClick={() => setType('claim')}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
            type === 'claim'
              ? 'bg-gold text-dark'
              : 'bg-surface border border-border text-gray-400'
          }`}
        >
          ⚠️ Claim / Complaint
        </button>
      </div>

      <Card className="p-6">
        <div className="mb-5">
          <h3 className="font-semibold text-white mb-1">
            {type === 'suggestion' ? '💡 Submit a Suggestion' : '⚠️ File a Claim'}
          </h3>
          <p className="text-xs text-gray-500">
            {type === 'suggestion'
              ? 'Have an idea to improve ASOME Champions League? We want to hear it.'
              : 'Have a complaint about a match result, player conduct, or any issue? File it here.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
              placeholder={type === 'suggestion' ? 'e.g. Add player ratings' : 'e.g. Wrong result recorded'}
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">
              Message
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="w-full bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold resize-none"
              placeholder="Describe your suggestion or claim in detail..."
              required
            />
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-gold text-dark font-bold rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
          >
            {saving ? 'Submitting...' : `Submit ${type === 'suggestion' ? 'Suggestion' : 'Claim'}`}
          </button>
        </form>
      </Card>
    </div>
  )
}