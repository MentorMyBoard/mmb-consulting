/**
 * Business-side notification email.
 * Sent to the advisory inbox the instant a new contact submission lands.
 * Designed to be scannable on mobile so partners can action quickly.
 */
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

type Props = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  requirement: string;
  message: string;
  submittedAt: Date;
};

const colors = {
  primary: '#0C183A', // deep navy
  secondary: '#C6A15B', // gold
  surface: '#FDFCFA',
  border: '#DCD7CF',
  text: '#1C1E23',
  subtle: '#4B525F',
};

export default function ContactNotification({
  id,
  name,
  email,
  company,
  phone,
  requirement,
  message,
  submittedAt,
}: Props) {
  const formattedDate = new Date(submittedAt).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

  return (
    <Html>
      <Head />
      <Preview>{`New inquiry from ${name} (${company}) — ${requirement}`}</Preview>
      <Body style={{ backgroundColor: '#F3F0EB', fontFamily: 'Georgia, serif', margin: 0, padding: '40px 0' }}>
        <Container style={{ maxWidth: 620, margin: '0 auto', backgroundColor: colors.surface, padding: 0 }}>
          {/* Brand bar */}
          <Section style={{ backgroundColor: colors.primary, padding: '32px 40px' }}>
            <Text
              style={{
                color: colors.surface,
                fontSize: 24,
                margin: 0,
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              MentorMyBoard
            </Text>
            <Text
              style={{
                color: colors.secondary,
                fontSize: 11,
                margin: '4px 0 0 0',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              New Strategic Inquiry
            </Text>
          </Section>

          <Section style={{ padding: '40px 40px 20px' }}>
            <Heading
              style={{
                color: colors.primary,
                fontSize: 22,
                margin: '0 0 8px',
                fontFamily: 'Georgia, serif',
                fontWeight: 400,
              }}
            >
              {requirement}
            </Heading>
            <Text style={{ color: colors.subtle, fontSize: 13, margin: '0 0 24px' }}>
              Submitted {formattedDate}
            </Text>

            <Hr style={{ borderColor: colors.border, margin: '16px 0' }} />

            <DetailRow label="Name" value={name} />
            <DetailRow label="Organization" value={company} />
            <DetailRow label="Email" value={email} link={`mailto:${email}`} />
            <DetailRow label="Phone" value={phone} link={`tel:${phone.replace(/\s+/g, '')}`} />

            <Hr style={{ borderColor: colors.border, margin: '16px 0' }} />

            <Text
              style={{
                color: colors.subtle,
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                margin: '0 0 8px',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              Message
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 15,
                lineHeight: 1.7,
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}
            >
              {message}
            </Text>

            <Hr style={{ borderColor: colors.border, margin: '32px 0 16px' }} />

            <Section style={{ textAlign: 'center', padding: '8px 0' }}>
              <Link
                href={`mailto:${email}?subject=Re%3A%20Your%20inquiry%20with%20MentorMyBoard`}
                style={{
                  backgroundColor: colors.primary,
                  color: colors.surface,
                  padding: '14px 32px',
                  textDecoration: 'none',
                  fontSize: 12,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'Arial, sans-serif',
                  display: 'inline-block',
                }}
              >
                Reply to {name.split(' ')[0]}
              </Link>
            </Section>
          </Section>

          <Section style={{ backgroundColor: '#F8F6F2', padding: '20px 40px', borderTop: `1px solid ${colors.border}` }}>
            <Text style={{ color: colors.subtle, fontSize: 11, margin: 0, fontFamily: 'Arial, sans-serif' }}>
              Reference ID: <code style={{ fontFamily: 'monospace' }}>{id}</code>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function DetailRow({ label, value, link }: { label: string; value: string; link?: string }) {
  return (
    <Section style={{ margin: '12px 0' }}>
      <Text
        style={{
          color: colors.subtle,
          fontSize: 11,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          margin: '0 0 4px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {label}
      </Text>
      {link ? (
        <Link href={link} style={{ color: colors.primary, fontSize: 16, textDecoration: 'none' }}>
          {value}
        </Link>
      ) : (
        <Text style={{ color: colors.text, fontSize: 16, margin: 0 }}>{value}</Text>
      )}
    </Section>
  );
}
