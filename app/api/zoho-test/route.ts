export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return Response.json({
      ok: false,
      step: 'env',
      error: 'Missing env vars',
      found: { ZOHO_CLIENT_ID: !!clientId, ZOHO_CLIENT_SECRET: !!clientSecret, ZOHO_REFRESH_TOKEN: !!refreshToken },
    });
  }

  // Step 1: Get access token
  let accessToken: string;
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    });
    const tokenRes = await fetch(`https://accounts.zoho.in/oauth/v2/token?${params}`, { method: 'POST' });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return Response.json({ ok: false, step: 'token', error: tokenData });
    }
    accessToken = tokenData.access_token;
  } catch (e) {
    return Response.json({ ok: false, step: 'token', error: String(e) });
  }

  // Step 2: Create a test lead (simple POST, no upsert)
  try {
    const lead = {
      Last_Name: 'CRM Test',
      First_Name: 'Zoho',
      Email: 'zoho-test@mentormyboard.com',
      Company: 'MentorMyBoard Test',
      Lead_Source: 'Website',
      Lead_Status: 'Not Contacted',
      Description: 'Automated test lead — safe to delete.',
    };

    const res = await fetch('https://www.zohoapis.in/crm/v2/Leads', {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: [lead] }),
    });

    const data = await res.json();
    return Response.json({
      ok: res.ok,
      step: 'create_lead',
      status: res.status,
      response: data,
    });
  } catch (e) {
    return Response.json({ ok: false, step: 'create_lead', error: String(e) });
  }
}
