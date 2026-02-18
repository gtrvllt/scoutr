import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { name, description, tags, image_url } = body ?? {};

    const updatePayload: Record<string, any> = {};
    if (typeof name === 'string') updatePayload.name = name;
    if (typeof description === 'string') updatePayload.description = description;
    if (Array.isArray(tags)) updatePayload.tags = tags;
    if (typeof image_url === 'string' || image_url === null) updatePayload.image_url = image_url;

    const { data, error } = await supabaseServer
      .from('metas')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unexpected error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { error } = await supabaseServer
      .from('metas')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unexpected error' }, { status: 500 });
  }
}
