'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { CONTATO } from '@/data/contatoData';
import Arrow from '../quem-somos/Arrow';


const initialForm = {
  nome: '',
  email: '',
  telefone: '',
  assunto: '',
  mensagem: '',
};

export default function ContactForm() {
  
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  
  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setFeedback('');

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Não foi possível enviar a mensagem.');
      }

      setStatus('success');
      setFeedback(data.message || 'Mensagem enviada com sucesso.');
      setForm(initialForm);
    } catch (error) {
      setStatus('error');
      setFeedback(error instanceof Error ? error.message : 'Não foi possível enviar a mensagem.');
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D684BF] focus:ring-2 focus:ring-[#D684BF]/20';

  return (
    <section className="relative overflow-hidden bg-[#F6F1E8] py-20 md:py-24">
      <div className="absolute inset-x-0 top-0 z-10 h-[30px] -translate-y-1/2 md:h-[70px]" aria-hidden>
        <div
          className="h-full w-full bg-contain bg-bottom bg-repeat-x"
          style={{ backgroundImage: "url('/cloud (1).png')" }}
        />
      </div>
      <div className="mx-auto w-full max-w-4xl px-6">
        <div className="mb-10 text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#D684BF]">Fale conosco</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-gray-800 sm:text-4xl">
            Envie uma mensagem
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
            Deixe seus dados e uma mensagem. A estrutura de envio já está preparada para ser conectada ao e-mail da clínica.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[36px] bg-white p-6 shadow-sm md:p-10">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="text-sm font-bold text-gray-700">
              Nome
              <input
                name="nome"
                autoComplete="name"
                required
                value={form.nome}
                onChange={(event) => updateField('nome', event.target.value)}
                className={`${inputClass} mt-2`}
                placeholder="Seu nome"
              />
            </label>

            <label className="text-sm font-bold text-gray-700">
              E-mail
              <input
                name="email"
                autoComplete="email"
                required
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                className={`${inputClass} mt-2`}
                placeholder="voce@email.com"
              />
            </label>

            <label className="text-sm font-bold text-gray-700">
              Telefone / WhatsApp
              <input
                name="telefone"
                autoComplete="tel"
                value={form.telefone}
                onChange={(event) => updateField('telefone', event.target.value)}
                className={`${inputClass} mt-2`}
                placeholder="(61) 99999-9999"
              />
            </label>

            <label className="text-sm font-bold text-gray-700">
              Assunto
              <input
                name="assunto"
                value={form.assunto}
                onChange={(event) => updateField('assunto', event.target.value)}
                className={`${inputClass} mt-2`}
                placeholder="Agendamento, dúvida..."
              />
            </label>
          </div>

          <label className="mt-5 block text-sm font-bold text-gray-700">
            Mensagem
            <textarea
              name="mensagem"
              required
              rows={6}
              value={form.mensagem}
              onChange={(event) => updateField('mensagem', event.target.value)}
              className={`${inputClass} mt-2 resize-y`}
              placeholder="Como podemos ajudar?"
            />
          </label>

          <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-center text-xs leading-relaxed text-gray-500 sm:max-w-md sm:text-left">
              Também é possível escrever diretamente para <a href={`mailto:${CONTATO.email}`} className="font-bold text-gray-700 underline">{CONTATO.email}</a>.
            </p>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="rounded-full bg-[#FC5D00] px-7 py-4 text-sm font-black text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'sending' ? (
                'Enviando...'
              ) : (
                <>
                  Enviar mensagem
                  <Arrow />
                </>
              )}
            </button>
          </div>

          {feedback && (
            <p
              role={status === 'error' ? 'alert' : 'status'}
              className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${
                status === 'success'
                  ? 'bg-[#E6F08F] text-gray-800'
                  : 'bg-[#F9D7DF] text-gray-800'
              }`}
            >
              {feedback}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
