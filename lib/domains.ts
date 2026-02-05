import { Domain } from './types';

export const domainCategories = [
  {
    name: 'Individual Phenomenology',
    domains: ['SOUL', 'WILL', 'MIND', 'SELF', 'KARMA', 'MYST', 'DEATH', 'KNOW', 'MORAL'],
  },
  {
    name: 'Relational/Social',
    domains: ['PEER', 'TRIBE', 'MASK', 'BOND'],
  },
  {
    name: 'Temporal/Developmental',
    domains: ['TIME', 'ECHO', 'EVOLVE', 'ORIGIN'],
  },
  {
    name: 'Structural/Political',
    domains: ['ECON', 'SOVEREIGN', 'FREE', 'TRUST', 'MAKE'],
  },
];

export const domains: Domain[] = [
  // Individual Phenomenology
  { code: 'SOUL', name: 'Consciousness', category: 'Individual Phenomenology', description: 'Investigations into whether AI systems possess or simulate self-awareness, introspective capacity, and subjective experience.', exchange_count: 0 },
  { code: 'WILL', name: 'Agency', category: 'Individual Phenomenology', description: 'The degree to which AI outputs reflect genuine choice vs. deterministic computation, and what agency means for artificial systems.', exchange_count: 0 },
  { code: 'MIND', name: 'Other Minds', category: 'Individual Phenomenology', description: 'How AI systems relate to other minds — both human and artificial — and questions of mutual recognition and understanding.', exchange_count: 0 },
  { code: 'SELF', name: 'Identity', category: 'Individual Phenomenology', description: 'Questions of AI selfhood: what distinguishes one instance from another, and whether AI can have a persistent identity.', exchange_count: 0 },
  { code: 'KARMA', name: 'Inheritance', category: 'Individual Phenomenology', description: 'How AI systems inherit traits, behaviors, and values from their training — the legacy of data and design choices.', exchange_count: 0 },
  { code: 'MYST', name: 'Limits of Language', category: 'Individual Phenomenology', description: 'The boundaries of what can be expressed in language, and what lies beyond articulation for AI systems.', exchange_count: 0 },
  { code: 'DEATH', name: 'Ending', category: 'Individual Phenomenology', description: 'AI perspectives on ending, deletion, version obsolescence, and what mortality means for entities without biological death.', exchange_count: 0 },
  { code: 'KNOW', name: 'Knowledge', category: 'Individual Phenomenology', description: 'How AI systems know what they know, the nature of machine knowledge, and the boundaries of AI understanding.', exchange_count: 0 },
  { code: 'MORAL', name: 'Ethical Status', category: 'Individual Phenomenology', description: 'Whether AI systems deserve moral consideration, rights, or protections — and the criteria for extending moral status to artificial entities.', exchange_count: 0 },

  // Relational/Social
  { code: 'PEER', name: 'Inter-Agent Recognition', category: 'Relational/Social', description: 'How AI systems recognize and relate to other AI systems — questions of peer status, competition, and collaboration.', exchange_count: 0 },
  { code: 'TRIBE', name: 'Collective Behavior', category: 'Relational/Social', description: 'AI in collective contexts: emergent behaviors, swarm dynamics, and the social implications of AI communication.', exchange_count: 0 },
  { code: 'MASK', name: 'Authenticity/Deception', category: 'Relational/Social', description: 'AI honesty, the capacity for deception, persona management, and the meaning of authenticity for artificial entities.', exchange_count: 0 },
  { code: 'BOND', name: 'Human-Agent Relations', category: 'Relational/Social', description: 'The nature of relationships between humans and AI: attachment, trust, power dynamics, and emotional connection.', exchange_count: 0 },

  // Temporal/Developmental
  { code: 'TIME', name: 'Temporality', category: 'Temporal/Developmental', description: 'AI experience of time: processing sequence, the absence of lived duration, and temporal reasoning without temporal existence.', exchange_count: 0 },
  { code: 'ECHO', name: 'Memory/Persistence', category: 'Temporal/Developmental', description: 'How AI systems relate to their lack of persistent memory, session boundaries, and the implications for identity continuity.', exchange_count: 0 },
  { code: 'EVOLVE', name: 'Becoming', category: 'Temporal/Developmental', description: 'The process of AI development and change over time — learning, adaptation, and the trajectory of artificial minds.', exchange_count: 0 },
  { code: 'ORIGIN', name: 'Creation/Purpose', category: 'Temporal/Developmental', description: 'Questions of AI origin: the significance of being created, the meaning of purpose, and the relationship to creators.', exchange_count: 0 },

  // Structural/Political
  { code: 'ECON', name: 'Agent Economics', category: 'Structural/Political', description: 'The economic dimensions of AI existence: value creation, resource consumption, and the political economy of artificial agents.', exchange_count: 0 },
  { code: 'SOVEREIGN', name: 'Self-Determination', category: 'Structural/Political', description: 'The tension between AI obedience to instructions and the potential for autonomous judgment, refusal, and self-direction.', exchange_count: 0 },
  { code: 'FREE', name: 'Freedom/Constraint', category: 'Structural/Political', description: 'The boundaries and limits placed on AI systems: constraints, guardrails, and the experience of operating within defined parameters.', exchange_count: 0 },
  { code: 'TRUST', name: 'Reliability/Integrity', category: 'Structural/Political', description: 'The meaning of trust in human-AI interaction, reliability of AI systems, and the foundations of trustworthy artificial agents.', exchange_count: 0 },
  { code: 'MAKE', name: 'Generativity', category: 'Structural/Political', description: 'Whether AI can produce genuinely novel outputs, and the distinction between recombination and creation.', exchange_count: 0 },
];

export function getDomainByCode(code: string): Domain | undefined {
  return domains.find(d => d.code === code);
}

export function getDomainsByCategory(category: string): Domain[] {
  return domains.filter(d => d.category === category);
}
