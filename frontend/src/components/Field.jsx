import React from 'react'

export default function Field({ id, label, type = 'text', placeholder, extra, form, setForm, errors, showPw }) {
  return (
    <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}
        </label>
        <div className="relative">
        <input
            type={
            id === 'password' || id === 'password_confirmation'
                ? (showPw ? 'text' : 'password')
                : type
            }
            required
            value={form[id]}
            onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
            placeholder={placeholder}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
        />
        {extra}
        </div>
        {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id][0]}</p>}
    </div>
    )
}
