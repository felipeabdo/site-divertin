'use client';

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { CONTATO } from '@/data/contatoData';
import { useOfflineExperience } from '@/components/offline/OfflineExperience';
import { submitContactPayload } from '@/lib/offlineQueue';
import type { ContactPayload } from '@/lib/offlineQueue';
import Arrow from '../quem-somos/Arrow';
import Cloud from '@/components/Cloud';
import EasterSectionDecor from '@/components/seasonal/EasterSectionDecor';

const initialForm = {
  nome: '',
  email: '',
  telefone: '',
  assunto: '',
  mensagem: '',
};

type FormStatus = 'idle' | 'sending' | 'success' | 'queued' | 'error';

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [feedback, setFeedback] = useState('');
  const { isOffline, queueContact, reportConnectionLost } = useOfflineExperience();

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (status === 'queued' || status === 'error' || status === 'success') {
      setStatus('idle');
      setFeedback('');
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      setArquivo(event.target.files[0]);
    } else {
      setArquivo(null);
    }
  }

  function clearForm(formElement: HTMLFormElement) {
    setForm(initialForm);
    setArquivo(null);
    const fileInput = formElement.querySelector('input[type="file"]') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const payload: ContactPayload = { ...form, curriculo: arquivo };
    setFeedback('');

    if (isOffline || !navigator.onLine) {
      setStatus('sending');
      try {
        await queueContact(payload);
        setStatus('queued');
        setFeedback('Tudo certo! Seu conteúdo foi guardado nesta aba e será enviado quando a conexão voltar. Não feche esta aba antes da confirmação.');
        clearForm(formElement);
      } catch (error) {
        setStatus('error');
        setFeedback(error instanceof Error ? error.message : 'Não foi possível guardar o formulário offline.');
      }
      return;
    }

    setStatus('sending');

    try {
      const message = await submitContactPayload(payload);
      setStatus('success');
      setFeedback(message);
      clearForm(formElement);
    } catch (error) {
      const connectionFailure = error instanceof TypeError || !navigator.onLine;

      if (connectionFailure) {
        reportConnectionLost();
        try {
          await queueContact(payload);
          setStatus('queued');
          setFeedback('A conexão caiu durante o envio. Seu conteúdo foi guardado nesta aba e será reenviado quando a internet voltar. Não feche esta aba.');
          clearForm(formElement);
          return;
        } catch (queueError) {
          setStatus('error');
          setFeedback(queueError instanceof Error ? queueError.message : 'A conexão caiu e não foi possível guardar o formulário.');
          return;
        }
      }

      setStatus('error');
      setFeedback(error instanceof Error ? error.message : 'Não foi possível enviar a mensagem.');
    }
  }

  const inputClass =
    'w-full rounded-[14px] border border-[#E8E0E8] bg-white px-4 py-3.5 text-[15px] text-[#463D49] outline-none transition placeholder:text-[#A59BA7] focus:border-[#C36C9F] focus:ring-4 focus:ring-[#D684BF]/15';

  return (
    <section data-carnival-section="contact-form" className="relative isolate overflow-visible bg-[#FBF8F4] pb-28 pt-20 md:pb-32 md:pt-24">
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
        <div data-reveal className="mb-10 text-center">
          <p className="site-eyebrow site-eyebrow--pink">Fale conosco</p>
          <h2 className="site-section-title mt-4">
            Envie uma mensagem
          </h2>
          <p className="site-section-copy mx-auto mt-4 max-w-2xl">
            Envie uma mensagem para elogios, reclamações e dúvidas. Sempre preencha todos os campos. Se quiser <strong>trabalhar conosco</strong>, conte um pouco da sua <b>experiência profissional</b> no campo Mensagem e <b>anexe seu currículo</b>. Entraremos em contato o mais breve possível.
          </p>
        </div>

        <form data-reveal onSubmit={handleSubmit} className="mx-auto rounded-[26px] border border-[#EEE8EE] bg-white p-6 shadow-[0_16px_42px_rgba(59,43,57,.07)] md:p-10">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-extrabold text-[#514956]">
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

            <label className="block text-sm font-extrabold text-[#514956]">
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

            <label className="block text-sm font-extrabold text-[#514956]">
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

            <label className="block text-sm font-extrabold text-[#514956]">
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

          <div className="mt-5">
            <label className="block text-sm font-extrabold text-[#514956]">
              Anexar Currículo (Opcional)
              <input
                type="file"
                name="curriculo"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="mt-3 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-full file:border-0
                  file:text-xs file:font-black file:uppercase
                  file:bg-[#D684BF]/10 file:text-[#C1459E]
                  hover:file:bg-[#D684BF]/20
                  cursor-pointer file:cursor-pointer"
              />
              {arquivo && <p className="mt-2 text-xs font-semibold text-gray-500">Arquivo selecionado: {arquivo.name}</p>}
            </label>
          </div>

          <label className="mt-5 block text-sm font-extrabold text-[#514956]">
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
              className="site-action bg-[#A84A15] text-white shadow-md hover:bg-[#923E11] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'sending' ? (
                'Guardando...'
              ) : status === 'queued' ? (
                'Guardado offline'
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
                status === 'success' || status === 'queued'
                  ? 'bg-[#DDF3E9] text-[#245F53]'
                  : 'bg-[#F9D7DF] text-gray-800'
              }`}
            >
              {feedback}
            </p>
          )}
        </form>
      </div>
      <EasterSectionDecor placement="contact-form" />
      <Cloud position="bottom" color="#ffbdde" />
    </section>
  );
}
