/**
 * User-facing confirmation email.
 * Tone: warm, premium, reassuring. No marketing fluff.
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
  name: string;
  requirement: string;
};

const colors = {
  primary: '#0C183A',
  secondary: '#C6A15B',
  surface: '#FDFCFA',
  border: '#DCD7CF',
  text: '#1C1E23',
  subtle: '#4B525F',
};

export default function ContactConfirmation({ name, requirement }: Props) {
  const firstName = name.split(' ')[0] || name;

  return (
    <Html>
      <Head />
      <Preview>Thank you for reaching out to MentorMyBoard</Preview>
      <Body style={{ backgroundColor: '#F3F0EB', fontFamily: 'Georgia, serif', margin: 0, padding: '40px 0' }}>
        <Container style={{ maxWidth: 620, margin: '0 auto', backgroundColor: colors.surface, padding: 0 }}>
          <Section style={{ backgroundColor: colors.primary, padding: '40px 40px', textAlign: 'center' }}>
            <Text
              style={{
                color: colors.surface,
                fontSize: 28,
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
                margin: '6px 0 0 0',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              Strategic Governance Excellence
            </Text>
          </Section>

          <Section style={{ padding: '48px 40px 32px' }}>
            <Heading
              style={{
                color: colors.primary,
                fontSize: 28,
                margin: '0 0 24px',
                fontFamily: 'Georgia, serif',
                fontWeight: 400,
                lineHeight: 1.3,
              }}
            >
              Thank you, {firstName}.
            </Heading>

            <Text style={{ color: colors.text, fontSize: 16, lineHeight: 1.7, margin: '0 0 16px' }}>
              We&rsquo;ve received your inquiry regarding{' '}
              <strong style={{ color: colors.primary }}>{requirement}</strong>, and a member of our advisory team will
              respond personally within one business day.
            </Text>

            <Text style={{ color: colors.text, fontSize: 16, lineHeight: 1.7, margin: '0 0 16px' }}>
              In the meantime, if your matter is urgent, please don&rsquo;t hesitate to reach us directly. We treat
              every inquiry with the discretion and rigor it deserves.
            </Text>

            <Hr style={{ borderColor: colors.border, margin: '32px 0' }} />

            <Text
              style={{
                color: colors.subtle,
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                margin: '0 0 12px',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              Direct Channels
            </Text>
            <Text style={{ color: colors.text, fontSize: 15, lineHeight: 1.8, margin: 0 }}>
              Advisory Desk:{' '}
              <Link href="mailto:advisory@mentormyboard.com" style={{ color: colors.primary }}>
                advisory@mentormyboard.com
              </Link>
              <br />
              Office: Financial District, Mumbai, India
            </Text>

            <Hr style={{ borderColor: colors.border, margin: '32px 0' }} />

            <Text
              style={{
                color: colors.subtle,
                fontSize: 14,
                fontStyle: 'italic',
                lineHeight: 1.6,
                margin: 0,
                fontFamily: 'Georgia, serif',
              }}
            >
              &ldquo;Great boards aren&rsquo;t built by accident. They are designed with intent, governed with rigor,
              and led with conviction.&rdquo;
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: colors.primary,
              padding: '24px 40px',
              textAlign: 'center',
            }}
          >
            <Text
              style={{
                color: colors.secondary,
                fontSize: 10,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                margin: 0,
                fontFamily: 'Arial, sans-serif',
              }}
            >
              © {new Date().getFullYear()} MentorMyBoard. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
