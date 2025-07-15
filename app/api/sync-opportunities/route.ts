import { NextResponse } from 'next/server';
import { getAllOpportunities } from '@/lib/ghl';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.GHL_API_KEY;
  const subAccountId = process.env.SUB_ACCOUNT_ID;

  if (!apiKey || !subAccountId) {
    console.error('❌ Missing API key or subAccount ID');
    return NextResponse.json({ error: 'Missing API key or subAccount ID' }, { status: 400 });
  }

  try {
    const opportunities = await getAllOpportunities(apiKey);

    for (const opportunity of opportunities) {
      await setDoc(
        doc(db, 'opportunities', opportunity.id),
        {
          ...opportunity,
          subAccountId,
        },
        { merge: true }
      );
    }

    return NextResponse.json({ message: '✅ Opportunities synced successfully' });
  } catch (err: any) {
    console.error('❌ Opportunity sync failed:', err);
    return NextResponse.json({ error: 'Sync failed', details: err.message }, { status: 500 });
  }
}