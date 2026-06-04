'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { contactFormSchema, type ContactFormInput } from '@/lib/validations';
import { requirements } from '@/content/testimonials';

type FieldErrors = Partial<Record<keyof ContactFormInput, string>>;

const INITIAL_STATE: ContactFormInput = {
  name: '',
  email: '',
  company: '',
  phone: '',
  requirement: '',
  message: '',
  website: '', // honeypot
};

/**
 * Contact form.
 *
 * Strategy: client validates with the same Zod schema the server uses, so
 * we catch errors instantly. The server re-validates, so even if a user
 * tampers with the request the API stays safe.
 */
export default function ContactForm() {
  const [form, setForm] = useState<ContactFormInput>(INITIAL_STATE);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof ContactFormInput>(key: K, value: ContactFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    // Client-side validation
    const result = contactFormSchema.safeParse(form);
    if (!result.success) {
      const next: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ContactFormInput;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error('Please correct the highlighted fields.');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Sending your inquiry...');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      let data: { ok?: boolean; error?: string; message?: string; fieldErrors?: FieldErrors } = {};
      try {
        data = await res.json();
      } catch {
        // Server returned non-JSON (HTML error page / timeout)
        toast.error(`Server error (${res.status}). Please try again in a moment.`, { id: toastId });
        return;
      }

      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        toast.error(data.error || 'Something went wrong. Please try again.', { id: toastId });
        return;
      }

      toast.success(data.message || 'Inquiry received. We will be in touch.', {
        id: toastId,
        duration: 6000,
      });
      setForm(INITIAL_STATE);
      setErrors({});
    } catch (err) {
      console.error('[contact-form]', err);
      toast.error('Unable to reach the server. Please check your connection and try again.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white p-8 md:p-12 border border-outline-variant shadow-2xl relative"
    >
      <div className="absolute top-0 right-0 w-2 h-full bg-secondary" />

      <form onSubmit={handleSubmit} noValidate className="space-y-10">
        {/* Honeypot — visually hidden but not display:none (bots skip the latter) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-10000px',
            top: 'auto',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          <label htmlFor="website">Leave this field empty</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website || ''}
            onChange={(e) => update('website', e.target.value)}
          />
        </div>

        <Field
          id="name"
          label="Full Name"
          type="text"
          value={form.name}
          onChange={(v) => update('name', v)}
          error={errors.name}
          autoComplete="name"
        />

        <Field
          id="email"
          label="Email Address"
          type="email"
          value={form.email}
          onChange={(v) => update('email', v)}
          error={errors.email}
          autoComplete="email"
        />

        <Field
          id="company"
          label="Organization"
          type="text"
          value={form.company}
          onChange={(v) => update('company', v)}
          error={errors.company}
          autoComplete="organization"
        />

        <Field
          id="phone"
          label="Phone Number"
          type="tel"
          value={form.phone}
          onChange={(v) => update('phone', v)}
          error={errors.phone}
          autoComplete="tel"
        />

        {/* Requirement select */}
        <div className="relative">
          <select
            id="requirement"
            value={form.requirement}
            onChange={(e) => update('requirement', e.target.value)}
            className={`w-full border-0 border-b-2 ${
              errors.requirement ? 'border-red-500' : 'border-outline-variant focus:border-secondary'
            } focus:ring-0 transition-colors py-3 bg-transparent text-lg text-primary outline-none appearance-none cursor-pointer`}
            aria-invalid={Boolean(errors.requirement)}
            aria-describedby={errors.requirement ? 'requirement-error' : undefined}
          >
            <option value="" disabled>
              Strategic Requirement
            </option>
            {requirements.map((r) => (
              <option key={r.value} value={r.label}>
                {r.label}
              </option>
            ))}
          </select>
          <span
            className="material-symbols-outlined absolute right-0 top-4 text-on-surface-variant pointer-events-none"
            aria-hidden="true"
          >
            expand_more
          </span>
          {errors.requirement && (
            <p id="requirement-error" className="mt-2 text-xs text-red-600">
              {errors.requirement}
            </p>
          )}
        </div>

        {/* Message textarea */}
        <div className="relative group">
          <textarea
            id="message"
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            rows={4}
            placeholder="Briefly describe your needs..."
            className={`w-full border-0 border-b-2 ${
              errors.message ? 'border-red-500' : 'border-outline-variant focus:border-secondary'
            } focus:ring-0 transition-colors py-3 bg-transparent text-lg outline-none resize-none`}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            maxLength={5000}
          />
          {errors.message && (
            <p id="message-error" className="mt-2 text-xs text-red-600">
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-on-primary py-5 text-sm uppercase tracking-[0.2em] hover:bg-secondary hover:text-primary hover:shadow-lg transition-all duration-300 group flex justify-center items-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Submit Inquiry
              <span
                className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform"
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </>
          )}
        </button>

        <p className="text-xs text-on-surface-variant text-center">
          By submitting, you agree to our handling of your information in line with our privacy practices.
        </p>
      </form>
    </motion.div>
  );
}

// Reusable floating-label input
function Field(props: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
}) {
  const { id, label, type, value, onChange, error, autoComplete } = props;
  return (
    <div className="relative group">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        autoComplete={autoComplete}
        className={`w-full border-0 border-b-2 ${
          error ? 'border-red-500' : 'border-outline-variant focus:border-secondary'
        } focus:ring-0 transition-colors py-3 bg-transparent text-lg peer outline-none placeholder-transparent`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <label
        htmlFor={id}
        className="absolute left-0 -top-4 text-xs uppercase tracking-widest text-on-surface-variant transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-secondary"
      >
        {label}
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
