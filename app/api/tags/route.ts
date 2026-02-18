import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, country_code } = body ?? {};
    if (!name || !country_code) {
      return NextResponse.json({ error: 'Missing name or country_code' }, { status: 400 });
    }

    const { error } = await supabaseServer
      .from('meta_tags')
      .insert({ name, country_code, created_at: new Date() });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unexpected error' }, { status: 500 });
  }
}
