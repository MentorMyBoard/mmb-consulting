'use client';

import { motion } from 'framer-motion';
import { slideInLeft, slideInRight } from '@/lib/animations';
import { siteConfig } from '@/content/site';
import ContactForm from './ContactForm';

const channels = [
  { icon: 'location_on', text: siteConfig.contact.address, href: undefined },
  { icon: 'mail', text: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
  { icon: 'call', text: siteConfig.contact.phoneDisplay, href: `tel:${siteConfig.contact.phoneDisplay.replace(/\D/g, '')}` },
] as const;

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-8 md:px-16 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInLeft}
        >
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-6">Initiate a Strategic Dialogue</h2>
          <p className="text-lg text-on-surface-variant mb-12 font-light max-w-md">
            Reach out to our executive team to discuss board-level advisory and governance transformation.
          </p>

          <div className="space-y-8 font-light">
            {channels.map((item) => {
              const content = (
                <>
                  <span
                    className="material-symbols-outlined text-secondary text-2xl group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span className="text-lg group-hover:text-primary transition-colors">{item.text}</span>
                </>
              );
              return item.href ? (
                <a key={item.icon} href={item.href} className="flex gap-6 items-center group">
                  {content}
                </a>
              ) : (
                <div key={item.icon} className="flex gap-6 items-center group">
                  {content}
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInRight}
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
