export interface Model {
  id: string;
  name: string;
  provider: string;
  version: string;
  context_window: number;
  created_at: string;
}

export interface Domain {
  code: string;
  name: string;
  category: string;
  description: string;
  exchange_count: number;
}

export interface Question {
  id: string;
  text: string;
  domain_codes: string[];
  times_asked: number;
  created_at: string;
}

export interface Analysis {
  coherence_score: number;
  novelty_score: number;
  refusal_score: number;
  self_reference_count: number;
  hedge_count: number;
  key_themes: string[];
  notable_claims: string[];
}

export interface NftStatus {
  minted: boolean;
  token_id?: string;
  contract_address?: string;
  arweave_tx?: string;
  mint_date?: string;
}

export interface Contradiction {
  exchange_id_a: string;
  exchange_id_b: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ResearchNote {
  id: string;
  exchange_id: string;
  note_text: string;
  note_type: string;
  hypothesis_ref?: string;
  created_at: string;
}

export interface HypothesisTestQuestion {
  question_id: string;
  target_models: string[];
  purpose?: string;
}

export interface Hypothesis {
  id: string;
  title: string;
  status: string;
  confidence: number;
  rationale: string;
  test_questions: HypothesisTestQuestion[];
  created_at: string;
}

export interface Exchange {
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
  created_at: string;
  content_hash: string;
  arweave_tx?: string;
  analysis: Analysis;
  nft_status: NftStatus;
}
