/**
 * DELETE /api/admin/ipo-leads/[id]
 * Protected by proxy.ts Basic Auth (matcher includes /api/admin/:path*).
 */
import { NextResponse, type NextRequest } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { IpoLead } from '@/models/IpoLead';
import { errorDetail } from '@/lib/errors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ ok: false, error: 'Invalid lead id.' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const lead = await IpoLead.findByIdAndDelete(id);

    if (!lead) {
      return NextResponse.json({ ok: false, error: 'Lead not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('[admin/ipo-leads] failed to delete lead:', err);
    return NextResponse.json(
      { ok: false, error: `Something went wrong: ${errorDetail(err)}` },
      { status: 500 },
    );
  }
}
