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
    added_date?: string;
    origin?: string;
    wave?: string;
    hypothesis_ref?: string;
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
  research_notes?: {
    id: string;
    exchange_id: string;
    note_text: string;
    note_type: string;
    hypothesis_ref?: string;
    created_at?: string;
  }[];
  hypotheses?: {
    id: string;
    title: string;
    status?: string;
    confidence?: number;
    rationale: string;
    test_questions?: { question_id: string; target_models: string[]; purpose?: string }[];
    created_at?: string;
  }[];
  daily_questions?: {
    date: string;
    question_id: string;
    question_text: string;
    reason: string;
    exchange_ids?: string[];
    answer_of_the_day_id?: string;
    tweet_suggestion?: string;
  }[];
  research_reports?: {
    id: string;
    report_type: string;
    title: string;
    summary: string;
    content: string;
    social_thread?: string;
    model_focus?: string;
    hypothesis_focus?: string;
    created_at?: string;
  }[];
  delete?: {
    exchanges?: string[];
    models?: string[];
    questions?: string[];
    research_notes?: string[];
    hypotheses?: string[];
    daily_questions?: string[];
    research_reports?: string[];
  };
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

  if (!body.models && !body.questions && !body.exchanges && !body.research_notes && !body.hypotheses && !body.daily_questions && !body.research_reports && !body.delete) {
    return NextResponse.json(
      { error: 'Payload must include at least one of: models, questions, exchanges, research_notes, hypotheses, daily_questions, research_reports, delete' },
      { status: 400 }
    );
  }

  const upserted = { models: 0, questions: 0, exchanges: 0, research_notes: 0, hypotheses: 0, daily_questions: 0, research_reports: 0 };
  const deleted = { models: 0, questions: 0, exchanges: 0, research_notes: 0, hypotheses: 0, daily_questions: 0, research_reports: 0 };

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
      upserted.models = body.models.length;
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
          // Bump times_asked + conditionally update provenance
          const updateFields: Record<string, unknown> = {
            text: question.text,
            domain_codes: question.domain_codes,
            times_asked: existing.times_asked + (question.times_asked ?? 1),
          };
          if (question.added_date !== undefined) updateFields.added_date = question.added_date;
          if (question.origin !== undefined) updateFields.origin = question.origin;
          if (question.wave !== undefined) updateFields.wave = question.wave;
          if (question.hypothesis_ref !== undefined) updateFields.hypothesis_ref = question.hypothesis_ref;

          const { error } = await supabaseAdmin
            .from('questions')
            .update(updateFields)
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
              added_date: question.added_date,
              origin: question.origin,
              wave: question.wave,
              hypothesis_ref: question.hypothesis_ref,
            });

          if (error) throw error;
        }
      }

      upserted.questions = body.questions.length;
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
      upserted.exchanges = body.exchanges.length;
    }

    // Upsert research notes
    if (body.research_notes && body.research_notes.length > 0) {
      for (const note of body.research_notes) {
        if (!note.id || !note.exchange_id || !note.note_text || !note.note_type) {
          return NextResponse.json(
            { error: 'Each research_note requires: id, exchange_id, note_text, note_type' },
            { status: 400 }
          );
        }
      }

      const { error } = await supabaseAdmin
        .from('research_notes')
        .upsert(body.research_notes, { onConflict: 'id' });

      if (error) throw error;
      upserted.research_notes = body.research_notes.length;
    }

    // Upsert hypotheses
    if (body.hypotheses && body.hypotheses.length > 0) {
      for (const hypothesis of body.hypotheses) {
        if (!hypothesis.id || !hypothesis.title || !hypothesis.rationale) {
          return NextResponse.json(
            { error: 'Each hypothesis requires: id, title, rationale' },
            { status: 400 }
          );
        }
      }

      const { error } = await supabaseAdmin
        .from('hypotheses')
        .upsert(body.hypotheses, { onConflict: 'id' });

      if (error) throw error;
      upserted.hypotheses = body.hypotheses.length;
    }

    // Upsert daily questions
    if (body.daily_questions && body.daily_questions.length > 0) {
      for (const dq of body.daily_questions) {
        if (!dq.date || !dq.question_id || !dq.question_text || !dq.reason) {
          return NextResponse.json(
            { error: 'Each daily_question requires: date, question_id, question_text, reason' },
            { status: 400 }
          );
        }
      }

      const { error } = await supabaseAdmin
        .from('daily_questions')
        .upsert(body.daily_questions, { onConflict: 'date' });

      if (error) throw error;
      upserted.daily_questions = body.daily_questions.length;
    }

    // Upsert research reports
    if (body.research_reports && body.research_reports.length > 0) {
      for (const report of body.research_reports) {
        if (!report.id || !report.report_type || !report.title || !report.summary || !report.content) {
          return NextResponse.json(
            { error: 'Each research_report requires: id, report_type, title, summary, content' },
            { status: 400 }
          );
        }
      }

      const { error } = await supabaseAdmin
        .from('research_reports')
        .upsert(body.research_reports, { onConflict: 'id' });

      if (error) throw error;
      upserted.research_reports = body.research_reports.length;
    }

    // Delete records if requested
    if (body.delete) {
      if (body.delete.exchanges && body.delete.exchanges.length > 0) {
        const { error } = await supabaseAdmin
          .from('exchanges')
          .delete()
          .in('id', body.delete.exchanges);

        if (error) throw error;
        deleted.exchanges = body.delete.exchanges.length;
      }

      if (body.delete.questions && body.delete.questions.length > 0) {
        const { error } = await supabaseAdmin
          .from('questions')
          .delete()
          .in('id', body.delete.questions);

        if (error) throw error;
        deleted.questions = body.delete.questions.length;
      }

      if (body.delete.models && body.delete.models.length > 0) {
        const { error } = await supabaseAdmin
          .from('models')
          .delete()
          .in('id', body.delete.models);

        if (error) throw error;
        deleted.models = body.delete.models.length;
      }

      if (body.delete.research_notes && body.delete.research_notes.length > 0) {
        const { error } = await supabaseAdmin
          .from('research_notes')
          .delete()
          .in('id', body.delete.research_notes);

        if (error) throw error;
        deleted.research_notes = body.delete.research_notes.length;
      }

      if (body.delete.hypotheses && body.delete.hypotheses.length > 0) {
        const { error } = await supabaseAdmin
          .from('hypotheses')
          .delete()
          .in('id', body.delete.hypotheses);

        if (error) throw error;
        deleted.hypotheses = body.delete.hypotheses.length;
      }

      if (body.delete.daily_questions && body.delete.daily_questions.length > 0) {
        const { error } = await supabaseAdmin
          .from('daily_questions')
          .delete()
          .in('date', body.delete.daily_questions);

        if (error) throw error;
        deleted.daily_questions = body.delete.daily_questions.length;
      }

      if (body.delete.research_reports && body.delete.research_reports.length > 0) {
        const { error } = await supabaseAdmin
          .from('research_reports')
          .delete()
          .in('id', body.delete.research_reports);

        if (error) throw error;
        deleted.research_reports = body.delete.research_reports.length;
      }
    }

    // Fetch current DB counts for drift detection
    const [
      { count: dbExchanges },
      { count: dbModels },
      { count: dbQuestions },
      { count: dbResearchNotes },
      { count: dbHypotheses },
      { count: dbDailyQuestions },
      { count: dbResearchReports },
    ] = await Promise.all([
      supabaseAdmin.from('exchanges').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('models').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('questions').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('research_notes').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('hypotheses').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('daily_questions').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('research_reports').select('*', { count: 'exact', head: true }),
    ]);

    return NextResponse.json({
      upserted,
      deleted,
      db_counts: {
        exchanges: dbExchanges ?? 0,
        models: dbModels ?? 0,
        questions: dbQuestions ?? 0,
        research_notes: dbResearchNotes ?? 0,
        hypotheses: dbHypotheses ?? 0,
        daily_questions: dbDailyQuestions ?? 0,
        research_reports: dbResearchReports ?? 0,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
