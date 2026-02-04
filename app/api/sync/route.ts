import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

interface SyncPayload {
  models?: {
    id: string;
    name: string;
    provider: string;
    version: string;
    context_window: number;
  }[];
  questions?: {
    id: string;
    text: string;
    domain_codes: string[];
    times_asked?: number;
  }[];
  exchanges?: {
    id: string;
    question_id: string;
    question_text: string;
    response_text: string;
    model_id: string;
    model_name: string;
    domain_code: string;
    domain_name: string;
    context_window_used: number;
    token_count: number;
    temperature: number;
    content_hash: string;
    arweave_tx?: string;
    coherence_score: number;
    novelty_score: number;
    refusal_score: number;
    self_reference_count: number;
    hedge_count: number;
    key_themes: string[];
    notable_claims: string[];
    created_at?: string;
  }[];
}

export async function POST(request: NextRequest) {
  // Authenticate
  const secret = request.headers.get('x-sync-secret');
  if (!secret || secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: SyncPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.models && !body.questions && !body.exchanges) {
    return NextResponse.json(
      { error: 'Payload must include at least one of: models, questions, exchanges' },
      { status: 400 }
    );
  }

  const inserted = { models: 0, questions: 0, exchanges: 0 };

  try {
    // Upsert models
    if (body.models && body.models.length > 0) {
      for (const model of body.models) {
        if (!model.id || !model.name || !model.provider || !model.version) {
          return NextResponse.json(
            { error: 'Each model requires: id, name, provider, version' },
            { status: 400 }
          );
        }
      }

      const { error } = await supabaseAdmin
        .from('models')
        .upsert(body.models, { onConflict: 'id' });

      if (error) throw error;
      inserted.models = body.models.length;
    }

    // Upsert questions (bumps times_asked via onConflict)
    if (body.questions && body.questions.length > 0) {
      for (const question of body.questions) {
        if (!question.id || !question.text || !question.domain_codes) {
          return NextResponse.json(
            { error: 'Each question requires: id, text, domain_codes' },
            { status: 400 }
          );
        }
      }

      // For questions, upsert individually to handle times_asked increment
      for (const question of body.questions) {
        // Check if question already exists
        const { data: existing } = await supabaseAdmin
          .from('questions')
          .select('id, times_asked')
          .eq('id', question.id)
          .single();

        if (existing) {
          // Bump times_asked
          const { error } = await supabaseAdmin
            .from('questions')
            .update({
              text: question.text,
              domain_codes: question.domain_codes,
              times_asked: existing.times_asked + (question.times_asked ?? 1),
            })
            .eq('id', question.id);

          if (error) throw error;
        } else {
          const { error } = await supabaseAdmin
            .from('questions')
            .insert({
              id: question.id,
              text: question.text,
              domain_codes: question.domain_codes,
              times_asked: question.times_asked ?? 1,
            });

          if (error) throw error;
        }
      }

      inserted.questions = body.questions.length;
    }

    // Insert exchanges (with flattened analysis fields)
    if (body.exchanges && body.exchanges.length > 0) {
      for (const exchange of body.exchanges) {
        if (
          !exchange.id ||
          !exchange.question_id ||
          !exchange.question_text ||
          !exchange.response_text ||
          !exchange.model_id ||
          !exchange.model_name ||
          !exchange.domain_code ||
          !exchange.domain_name ||
          !exchange.content_hash
        ) {
          return NextResponse.json(
            {
              error:
                'Each exchange requires: id, question_id, question_text, response_text, model_id, model_name, domain_code, domain_name, content_hash',
            },
            { status: 400 }
          );
        }
      }

      const { error } = await supabaseAdmin
        .from('exchanges')
        .upsert(body.exchanges, { onConflict: 'id' });

      if (error) throw error;
      inserted.exchanges = body.exchanges.length;
    }

    return NextResponse.json({ inserted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
