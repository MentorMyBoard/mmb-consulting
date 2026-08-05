import { connectToDatabase } from '@/lib/mongodb';
import { Popup } from '@/models/Popup';
import type { PopupDTO } from '@/lib/types';

/** Active popups for the public site. Used by both the homepage (SSR) and /api/popups. */
export async function getActivePopups(): Promise<PopupDTO[]> {
  try {
    await connectToDatabase();
    const docs = await Popup.find({ active: true }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs)) as PopupDTO[];
  } catch (err) {
    console.error('[popups] failed to load active popups:', err);
    return [];
  }
}
