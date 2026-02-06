import { supabase } from './supabase';
import { Exchange, Hypothesis, Model, Question, ResearchNote } from './types';
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
