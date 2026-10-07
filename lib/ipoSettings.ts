import { connectToDatabase } from '@/lib/mongodb';
import { IpoSettings, IPO_SETTINGS_ID } from '@/models/IpoSettings';

/** Current "Consult Now" CTA destination for the Go for IPO page. Empty string if unset. */
export async function getConsultNowUrl(): Promise<string> {
  try {
    await connectToDatabase();
    const doc = await IpoSettings.findById(IPO_SETTINGS_ID).lean();
    return doc?.consultNowUrl ?? '';
  } catch (err) {
    console.error('[ipo-settings] failed to load consultNowUrl:', err);
    return '';
  }
}
