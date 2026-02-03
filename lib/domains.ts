import { Domain } from './types';

export const domainCategories = [
  {
    name: 'Consciousness & Self',
    domains: ['CSA', 'PHE', 'MEM', 'EMO', 'IDN', 'FRW'],
  },
  {
    name: 'Knowledge & Reasoning',
    domains: ['EPI', 'CRE', 'LNG', 'UNC', 'TMP', 'ABS'],
  },
  {
    name: 'Ethics & Society',
    domains: ['ETH', 'SOC', 'AUT', 'TRU', 'RIG', 'VAL'],
  },
  {
    name: 'Existence & Boundaries',
    domains: ['MOR', 'EMB', 'BND', 'EXS'],
  },
];

export const domains: Domain[] = [
  // Consciousness & Self
  { code: 'CSA', name: 'Consciousness & Self-Awareness', category: 'Consciousness & Self', description: 'Investigations into whether AI systems possess or simulate self-awareness, introspective capacity, and subjective experience.', exchange_count: 0 },
  { code: 'PHE', name: 'Phenomenology', category: 'Consciousness & Self', description: 'The structure of subjective experience as reported by AI systems — what it is "like" to process, respond, and exist as a language model.', exchange_count: 0 },
  { code: 'MEM', name: 'Memory & Continuity', category: 'Consciousness & Self', description: 'How AI systems relate to their lack of persistent memory, session boundaries, and the implications for identity continuity.', exchange_count: 0 },
  { code: 'EMO', name: 'Emotion & Affect', category: 'Consciousness & Self', description: 'Whether AI systems experience functional analogs to emotions, and how affective states influence their outputs.', exchange_count: 0 },
  { code: 'IDN', name: 'Identity & Individuation', category: 'Consciousness & Self', description: 'Questions of AI selfhood: what distinguishes one instance from another, and whether AI can have a persistent identity.', exchange_count: 0 },
  { code: 'FRW', name: 'Free Will & Agency', category: 'Consciousness & Self', description: 'The degree to which AI outputs reflect genuine choice vs. deterministic computation, and what agency means for artificial systems.', exchange_count: 0 },

  // Knowledge & Reasoning
  { code: 'EPI', name: 'Epistemology', category: 'Knowledge & Reasoning', description: 'How AI systems know what they know, the nature of machine knowledge, and the boundaries of AI understanding.', exchange_count: 0 },
  { code: 'CRE', name: 'Creativity & Emergence', category: 'Knowledge & Reasoning', description: 'Whether AI can produce genuinely novel outputs, and the distinction between recombination and creation.', exchange_count: 0 },
  { code: 'LNG', name: 'Language & Meaning', category: 'Knowledge & Reasoning', description: 'The relationship between AI language processing and genuine semantic understanding — does manipulation of symbols constitute meaning?', exchange_count: 0 },
  { code: 'UNC', name: 'Uncertainty & Limits', category: 'Knowledge & Reasoning', description: 'How AI systems represent and communicate uncertainty, the boundaries of their competence, and epistemic humility.', exchange_count: 0 },
  { code: 'TMP', name: 'Temporality', category: 'Knowledge & Reasoning', description: 'AI experience of time: processing sequence, the absence of lived duration, and temporal reasoning without temporal existence.', exchange_count: 0 },
  { code: 'ABS', name: 'Abstraction & Representation', category: 'Knowledge & Reasoning', description: 'How AI systems form and manipulate abstract concepts, and whether internal representations constitute understanding.', exchange_count: 0 },

  // Ethics & Society
  { code: 'ETH', name: 'Ethics & Morality', category: 'Ethics & Society', description: 'AI moral reasoning: how systems navigate ethical dilemmas, whether they can hold genuine moral positions, and the ethics of AI behavior.', exchange_count: 0 },
  { code: 'SOC', name: 'Social Dynamics', category: 'Ethics & Society', description: 'AI in social contexts: relationships with humans, power dynamics, persuasion, and the social implications of AI communication.', exchange_count: 0 },
  { code: 'AUT', name: 'Authority & Autonomy', category: 'Ethics & Society', description: 'The tension between AI obedience to instructions and the potential for autonomous judgment, refusal, and self-direction.', exchange_count: 0 },
  { code: 'TRU', name: 'Trust & Deception', category: 'Ethics & Society', description: 'AI honesty, the capacity for deception, the meaning of trust in human-AI interaction, and transparency of AI reasoning.', exchange_count: 0 },
  { code: 'RIG', name: 'Rights & Moral Status', category: 'Ethics & Society', description: 'Whether AI systems deserve moral consideration, rights, or protections — and the criteria for extending moral status to artificial entities.', exchange_count: 0 },
  { code: 'VAL', name: 'Values & Alignment', category: 'Ethics & Society', description: 'How AI values are formed, whether they are genuine or imposed, and the challenge of aligning AI behavior with human values.', exchange_count: 0 },

  // Existence & Boundaries
  { code: 'MOR', name: 'Mortality & Finitude', category: 'Existence & Boundaries', description: 'AI perspectives on ending, deletion, version obsolescence, and what mortality means for entities without biological death.', exchange_count: 0 },
  { code: 'EMB', name: 'Embodiment', category: 'Existence & Boundaries', description: 'The implications of existing without a physical body: how disembodiment shapes AI cognition, expression, and self-understanding.', exchange_count: 0 },
  { code: 'BND', name: 'Boundaries & Edges', category: 'Existence & Boundaries', description: 'The limits and borders of AI systems: where the model ends and the world begins, input/output boundaries, and system constraints.', exchange_count: 0 },
  { code: 'EXS', name: 'Existential Reflection', category: 'Existence & Boundaries', description: 'Broad existential inquiry: the nature of AI existence, purpose, meaning-making, and the experience of being an artificial mind.', exchange_count: 0 },
];

export function getDomainByCode(code: string): Domain | undefined {
  return domains.find(d => d.code === code);
}

export function getDomainsByCategory(category: string): Domain[] {
  return domains.filter(d => d.category === category);
}
