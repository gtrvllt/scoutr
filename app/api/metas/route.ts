import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, tags = [], country_code = null, image_url = null } = body ?? {};

    if (!name || !description) {
      return NextResponse.json({ error: 'Missing name or description' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('metas')
      .insert([{ name, description, tags, country_code, image_url }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unexpected error' }, { status: 500 });
  }
}
