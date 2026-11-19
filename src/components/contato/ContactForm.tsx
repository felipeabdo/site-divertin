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
import { contactAttachmentMimeType, MAX_ATTACHMENTS, MAX_TOTAL_ATTACHMENT_SIZE } from '@/lib/contactFileTypes';

const initialForm = {
  nome: '',
  email: '',
  telefone: '',
  assunto: '',
  mensagem: '',
};


type FormStatus = 'idle' | 'sending' | 'success' | 'queued' | 'error';

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} MB`;
}

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [feedback, setFeedback] = useState('');
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const { isOffline, queueContact, reportConnectionLost } = useOfflineExperience();

  const totalAttachmentSize = arquivos.reduce((total, file) => total + file.size, 0);

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (status === 'queued' || status === 'error' || status === 'success') {
      setStatus('idle');
      setFeedback('');
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    event.target.value = '';
    if (selected.length === 0) return;

    const nextFiles = [...arquivos];
    for (const file of selected) {
      if (!contactAttachmentMimeType(file.name)) {
        setStatus('error');
        setFeedback(`O arquivo "${file.name}" não pode ser enviado por e-mail. Formatos executáveis ou bloqueados pelo Titan não são aceitos. Se necessário, compacte-o em ZIP.`);
        return;
      }
      if (file.size <= 0) {
        setStatus('error');
        setFeedback(`O arquivo "${file.name}" está vazio.`);
        return;
      }
      if (nextFiles.length >= MAX_ATTACHMENTS) {
        setStatus('error');
        setFeedback(`É possível anexar até ${MAX_ATTACHMENTS} arquivos por mensagem.`);
        return;
      }
      nextFiles.push(file);
    }

    const nextTotal = nextFiles.reduce((total, file) => total + file.size, 0);
    if (nextTotal > MAX_TOTAL_ATTACHMENT_SIZE) {
      setStatus('error');
      setFeedback('A soma dos anexos ultrapassa o limite de 17 MB. Remova algum arquivo para continuar.');
      return;
    }

    setArquivos(nextFiles);
    setStatus('idle');
    setFeedback('');
  }

  function removeFile(index: number) {
    setArquivos((current) => current.filter((_, fileIndex) => fileIndex !== index));
    setStatus('idle');
    setFeedback('');
  }

  function clearForm(formElement: HTMLFormElement) {
    setForm(initialForm);
    setArquivos([]);
    setStartedAt(Date.now());
    const fileInput = formElement.querySelector('input[type="file"]') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
    const honeypot = formElement.elements.namedItem('website') as HTMLInputElement | null;
    if (honeypot) honeypot.value = '';
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const honeypot = formElement.elements.namedItem('website') as HTMLInputElement | null;
    const payload: ContactPayload = {
      ...form,
      arquivos,
      website: honeypot?.value || '',
      formStartedAt: startedAt,
    };
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
          <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="contact-website">Não preencha este campo</label>
            <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-extrabold text-[#514956]">
              Nome
              <input
                name="nome"
                autoComplete="name"
                required
                maxLength={120}
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
                maxLength={254}
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
                maxLength={50}
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
                maxLength={160}
                value={form.assunto}
                onChange={(event) => updateField('assunto', event.target.value)}
                className={`${inputClass} mt-2`}
                placeholder="Agendamento, dúvida..."
              />
            </label>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-extrabold text-[#514956]" htmlFor="contact-attachments">
              Anexar documentos, áudios, vídeos ou imagens (opcional)
            </label>
            <input
              id="contact-attachments"
              type="file"
              name="anexos"
              multiple
              onChange={handleFileChange}
              className="mt-3 block w-full text-sm text-gray-500
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-full file:border-0
                file:text-xs file:font-black file:uppercase
                file:bg-[#D684BF]/10 file:text-[#C1459E]
                hover:file:bg-[#D684BF]/20
                cursor-pointer file:cursor-pointer"
            />
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Aceita documentos, planilhas, textos, imagens, áudios e vídeos. Até {MAX_ATTACHMENTS} arquivos, com limite total de 17 MB por envio. Formatos executáveis bloqueados pelo Titan não são aceitos.
            </p>

            {arquivos.length > 0 && (
              <div className="mt-3 rounded-xl border border-[#EEE8EE] bg-[#FBF8F4] p-3">
                <ul className="space-y-2">
                  {arquivos.map((file, index) => (
                    <li key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center justify-between gap-3 text-xs text-[#514956]">
                      <span className="min-w-0 break-all">{file.name} <span className="text-gray-500">({formatFileSize(file.size)})</span></span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        disabled={status === 'sending'}
                        aria-label={`Remover ${file.name}`}
                        className="shrink-0 rounded-full px-2 py-1 font-bold text-[#A84A15] hover:bg-[#A84A15]/10 disabled:opacity-50"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center justify-between border-t border-[#E8E0E8] pt-2 text-xs font-extrabold text-[#514956]">
                  <span>Total selecionado</span>
                  <span>{formatFileSize(totalAttachmentSize)} / 17 MB</span>
                </div>
              </div>
            )}
          </div>

          <label className="mt-5 block text-sm font-extrabold text-[#514956]">
            Mensagem
            <textarea
              name="mensagem"
              required
              rows={6}
              maxLength={10_000}
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
                'Enviando...'
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
