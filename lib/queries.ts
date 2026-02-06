import { supabase } from './supabase';
import { DailyQuestion, Exchange, Hypothesis, Model, Question, ResearchNote, ResearchReport } from './types';
import { exchanges as seedExchanges, models as seedModels, questions as seedQuestions } from './seed-data';

// Transform a Supabase row into the Exchange shape the UI expects
function toExchange(row: Record<string, unknown>): Exchange {
  return {
    id: row.id as string,
    question_id: row.question_id as string,
    question_text: row.question_text as string,
    response_text: row.response_text as string,
    model_id: row.model_id as string,
    model_name: row.model_name as string,
    domain_code: row.domain_code as string,
    domain_name: row.domain_name as string,
    context_window_used: row.context_window_used as number,
    token_count: row.token_count as number,
    temperature: row.temperature as number,
    created_at: row.created_at as string,
    content_hash: row.content_hash as string,
    arweave_tx: row.arweave_tx as string | undefined,
    analysis: {
      coherence_score: row.coherence_score as number,
      novelty_score: row.novelty_score as number,
      refusal_score: row.refusal_score as number,
      self_reference_count: row.self_reference_count as number,
      hedge_count: row.hedge_count as number,
      key_themes: row.key_themes as string[],
      notable_claims: row.notable_claims as string[],
    },
    nft_status: { minted: false },
  };
}

export async function getExchanges(): Promise<Exchange[]> {
  const { data, error } = await supabase
    .from('exchanges')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return seedExchanges;
  }

  return data.map(toExchange);
}

export async function getExchangeById(id: string): Promise<Exchange | null> {
  const { data, error } = await supabase
    .from('exchanges')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    const seed = seedExchanges.find(e => e.id === id);
    return seed || null;
  }

  return toExchange(data);
}

export async function getExchangesByDomain(domainCode: string): Promise<Exchange[]> {
  const { data, error } = await supabase
    .from('exchanges')
    .select('*')
    .eq('domain_code', domainCode)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return seedExchanges.filter(e => e.domain_code === domainCode);
  }

  return data.map(toExchange);
}

export async function getExchangesByModel(modelId: string): Promise<Exchange[]> {
  const { data, error } = await supabase
    .from('exchanges')
    .select('*')
    .eq('model_id', modelId)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return seedExchanges.filter(e => e.model_id === modelId);
  }

  return data.map(toExchange);
}

export async function getExchangesByQuestion(questionId: string): Promise<Exchange[]> {
  const { data, error } = await supabase
    .from('exchanges')
    .select('*')
    .eq('question_id', questionId)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return seedExchanges.filter(e => e.question_id === questionId);
  }

  return data.map(toExchange);
}

export async function getQuestionById(questionId: string): Promise<Question | null> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', questionId)
    .single();

  if (error || !data) {
    const seed = seedQuestions.find(q => q.id === questionId);
    return seed || null;
  }

  return data as Question;
}

export async function getModels(): Promise<Model[]> {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return seedModels;
  }

  return data as Model[];
}

export async function getQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return seedQuestions;
  }

  return data as Question[];
}

export async function getResearchNotes(exchangeId: string): Promise<ResearchNote[]> {
  const { data, error } = await supabase
    .from('research_notes')
    .select('*')
    .eq('exchange_id', exchangeId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data as ResearchNote[];
}

export async function getHypotheses(): Promise<Hypothesis[]> {
  const { data, error } = await supabase
    .from('hypotheses')
    .select('*')
    .order('id', { ascending: true });
  if (error || !data) return [];
  return data as Hypothesis[];
}

export async function getHypothesisById(id: string): Promise<Hypothesis | null> {
  const { data, error } = await supabase
    .from('hypotheses')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data as Hypothesis;
}

export async function getResearchNotesByHypothesis(hypothesisRef: string): Promise<ResearchNote[]> {
  const { data, error } = await supabase
    .from('research_notes')
    .select('*')
    .eq('hypothesis_ref', hypothesisRef)
    .order('created_at', { ascending: true });
  if (error || !data) return [];
  return data as ResearchNote[];
}

export async function getExchangesByIds(ids: string[]): Promise<Exchange[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from('exchanges')
    .select('*')
    .in('id', ids)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(toExchange);
}

export async function getQuestionsByIds(ids: string[]): Promise<Question[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .in('id', ids);
  if (error || !data) return [];
  return data as Question[];
}

export async function getResearchNoteCounts(): Promise<Record<string, { notes: number; exchanges: number }>> {
  const { data, error } = await supabase
    .from('research_notes')
    .select('hypothesis_ref, exchange_id');
  if (error || !data) return {};

  const counts: Record<string, { notes: number; exchanges: Set<string> }> = {};
  for (const row of data) {
    if (!row.hypothesis_ref) continue;
    if (!counts[row.hypothesis_ref]) counts[row.hypothesis_ref] = { notes: 0, exchanges: new Set() };
    counts[row.hypothesis_ref].notes++;
    counts[row.hypothesis_ref].exchanges.add(row.exchange_id);
  }

  return Object.fromEntries(
    Object.entries(counts).map(([k, v]) => [k, { notes: v.notes, exchanges: v.exchanges.size }])
  );
}

// === Research Observations (Recent Notes) ===

export async function getRecentResearchNotes(limit: number = 5): Promise<(ResearchNote & { exchange_model?: string })[]> {
  const { data, error } = await supabase
    .from('research_notes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return (data as ResearchNote[]).map((note) => ({
    ...note,
    exchange_model: undefined,
  }));
}

// === Model Stats ===

export interface ModelStats {
  model_id: string;
  model_name: string;
  exchange_count: number;
  avg_coherence: number;
  avg_novelty: number;
  domains: string[];
}

export async function getModelStats(): Promise<ModelStats[]> {
  const { data, error } = await supabase
    .from('exchanges')
    .select('model_id, model_name, coherence_score, novelty_score, domain_code');
  if (error || !data) return [];

  // Normalize versioned model IDs (e.g. claude-opus-4-20250514 → claude-opus-4)
  const normalizeModelId = (id: string): string => id.replace(/-\d{8}$/, '');

  const map: Record<string, { model_name: string; count: number; coherence_sum: number; novelty_sum: number; domains: Set<string> }> = {};
  for (const row of data) {
    const modelId = normalizeModelId(row.model_id);
    if (!map[modelId]) {
      map[modelId] = { model_name: row.model_name, count: 0, coherence_sum: 0, novelty_sum: 0, domains: new Set() };
    }
    const m = map[modelId];
    m.count++;
    m.coherence_sum += (row.coherence_score as number) || 0;
    m.novelty_sum += (row.novelty_score as number) || 0;
    m.domains.add(row.domain_code);
  }

  return Object.entries(map)
    .map(([model_id, m]) => ({
      model_id,
      model_name: m.model_name,
      exchange_count: m.count,
      avg_coherence: m.count > 0 ? m.coherence_sum / m.count : 0,
      avg_novelty: m.count > 0 ? m.novelty_sum / m.count : 0,
      domains: Array.from(m.domains),
    }))
    .sort((a, b) => b.exchange_count - a.exchange_count);
}

// === Domain Stats ===

export interface DomainStats {
  domain_code: string;
  domain_name: string;
  exchange_count: number;
}

export async function getDomainStats(): Promise<DomainStats[]> {
  const { data, error } = await supabase
    .from('exchanges')
    .select('domain_code, domain_name');
  if (error || !data) return [];

  const map: Record<string, { domain_name: string; count: number }> = {};
  for (const row of data) {
    if (!map[row.domain_code]) {
      map[row.domain_code] = { domain_name: row.domain_name, count: 0 };
    }
    map[row.domain_code].count++;
  }

  return Object.entries(map)
    .map(([domain_code, d]) => ({
      domain_code,
      domain_name: d.domain_name,
      exchange_count: d.count,
    }))
    .sort((a, b) => b.exchange_count - a.exchange_count);
}

// === Daily Questions (QOTD) ===

export async function getDailyQuestion(date?: string): Promise<DailyQuestion | null> {
  if (date) {
    const { data, error } = await supabase
      .from('daily_questions')
      .select('*')
      .eq('date', date)
      .single();
    if (error || !data) return null;
    return data as DailyQuestion;
  }
  // Get today's (most recent)
  const { data, error } = await supabase
    .from('daily_questions')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
    .single();
  if (error || !data) return null;
  return data as DailyQuestion;
}

export async function getDailyQuestionArchive(): Promise<DailyQuestion[]> {
  const { data, error } = await supabase
    .from('daily_questions')
    .select('*')
    .order('date', { ascending: false });
  if (error || !data) return [];
  return data as DailyQuestion[];
}

export async function getDailyQuestionExchanges(date: string): Promise<Exchange[]> {
  const dq = await getDailyQuestion(date);
  if (!dq || !dq.exchange_ids || dq.exchange_ids.length === 0) return [];
  return getExchangesByIds(dq.exchange_ids);
}

// === Research Reports ===

export async function getResearchReports(): Promise<ResearchReport[]> {
  const { data, error } = await supabase
    .from('research_reports')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as ResearchReport[];
}

export async function getResearchReportById(id: string): Promise<ResearchReport | null> {
  const { data, error } = await supabase
    .from('research_reports')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data as ResearchReport;
}

export async function getStats() {
  const [exchanges, questions, models] = await Promise.all([
    getExchanges(),
    getQuestions(),
    getModels(),
  ]);

  const totalTokens = exchanges.reduce((sum, e) => sum + e.token_count, 0);

  return {
    exchangeCount: exchanges.length,
    questionCount: questions.length,
    modelCount: models.length,
    totalTokens,
  };
}
