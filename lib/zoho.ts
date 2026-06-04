/**
 * Zoho CRM (India data center) integration — Lead upsert via OAuth2 refresh-token flow.
 * All functions are best-effort: they log errors but never throw, so a Zoho outage
 * cannot break the contact or newsletter flows.
 */

const ZOHO_AUTH_URL = 'https://accounts.zoho.in/oauth/v2/token';
const ZOHO_API_BASE = 'https://www.zohoapis.in/crm/v2';

// Module-level token cache — valid for ~1 hour per serverless instance
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  // Reuse cached token with a 5-minute buffer before expiry
  if (cachedToken && Date.now() < cachedToken.expiresAt - 5 * 60 * 1000) {
    return cachedToken.value;
  }

  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    });

    const res = await fetch(`${ZOHO_AUTH_URL}?${params.toString()}`, { method: 'POST' });
    if (!res.ok) {
      console.error('[zoho] token refresh HTTP error:', res.status);
      return null;
    }

    const data = await res.json();
    if (!data.access_token) {
      console.error('[zoho] token refresh returned no access_token:', data);
      return null;
    }

    cachedToken = {
      value: data.access_token as string,
      expiresAt: Date.now() + ((data.expires_in as number) ?? 3600) * 1000,
    };

    return cachedToken.value;
  } catch (err) {
    console.error('[zoho] token refresh failed:', err);
    return null;
  }
}

function splitName(fullName: string): { First_Name?: string; Last_Name: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { Last_Name: parts[0] };
  const Last_Name = parts.pop()!;
  return { First_Name: parts.join(' '), Last_Name };
}

async function upsertLead(lead: Record<string, unknown>): Promise<void> {
  const token = await getAccessToken();
  if (!token) return; // Zoho not configured — skip silently

  try {
    const res = await fetch(`${ZOHO_API_BASE}/Leads/upsert`, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [lead],
        duplicate_check_fields: ['Email'],
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[zoho] upsert failed:', res.status, body);
    }
  } catch (err) {
    console.error('[zoho] upsert error:', err);
  }
}

export async function pushContactToZoho(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  requirement?: string;
  message?: string;
}): Promise<void> {
  const { First_Name, Last_Name } = splitName(data.name);

  const descriptionParts: string[] = [];
  if (data.requirement) descriptionParts.push(`Requirement: ${data.requirement}`);
  if (data.message) descriptionParts.push(`Message:\n${data.message}`);

  const lead: Record<string, unknown> = {
    Last_Name,
    Email: data.email,
    Company: data.company || 'Not specified',
    Lead_Source: 'Website',
    Lead_Status: 'Not Contacted',
  };

  if (First_Name) lead.First_Name = First_Name;
  if (data.phone) lead.Phone = data.phone;
  if (descriptionParts.length) lead.Description = descriptionParts.join('\n\n');

  await upsertLead(lead);
}

export async function pushNewsletterToZoho(email: string): Promise<void> {
  await upsertLead({
    Last_Name: 'Subscriber',
    Email: email,
    Company: 'Not specified',
    Lead_Source: 'Newsletter',
    Lead_Status: 'Not Contacted',
    Description: 'Newsletter subscriber — website footer.',
  });
}
