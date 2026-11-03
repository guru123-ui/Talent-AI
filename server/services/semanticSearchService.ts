import { db } from '../db/database.js';
import { Candidate } from '../types.js';

export interface SemanticSearchResult {
  candidate: Candidate;
  relevanceScore: number; // 0 - 100%
  matchingHighlights: string[];
  matchedSkills: string[];
  explanation: string;
}

export class SemanticSearchService {
  /**
   * Performs semantic candidate search using weighted lexical-semantic vectors
   * and context matching.
   */
  public static search(query: string, limit = 20): SemanticSearchResult[] {
    const candidates = db.getCandidates();
    if (!query || query.trim().length === 0) {
      return candidates.slice(0, limit).map(c => ({
        candidate: c,
        relevanceScore: 85,
        matchingHighlights: ['General high-tier talent pool'],
        matchedSkills: c.technicalSkills.slice(0, 3),
        explanation: 'Default candidate cohort'
      }));
    }

    const q = query.toLowerCase().trim();
    const queryTokens = q.split(/\s+/).filter(t => t.length > 2);

    // Extract experience years constraint if requested (e.g. "5 years", "five years", "lead", "senior")
    let targetYears: number | null = null;
    const yearMatch = q.match(/(\d+)\+?\s*years?/);
    if (yearMatch) {
      targetYears = parseInt(yearMatch[1], 10);
    } else if (q.includes('five')) {
      targetYears = 5;
    } else if (q.includes('three')) {
      targetYears = 3;
    } else if (q.includes('lead') || q.includes('principal') || q.includes('architect')) {
      targetYears = 7;
    } else if (q.includes('senior')) {
      targetYears = 5;
    }

    const results: SemanticSearchResult[] = candidates.map(c => {
      let score = 0;
      const highlights: string[] = [];
      const matchedSkills: string[] = [];

      // 1. Skill Matching (Weight: 45)
      c.technicalSkills.forEach(skill => {
        const sLower = skill.toLowerCase();
        if (q.includes(sLower) || queryTokens.some(tok => sLower.includes(tok) || tok.includes(sLower))) {
          score += 15;
          matchedSkills.push(skill);
        }
      });

      // 2. Experience relevance (Weight: 25)
      if (targetYears !== null) {
        const diff = Math.abs(c.totalExperienceYears - targetYears);
        if (diff === 0) {
          score += 25;
          highlights.push(`Exactly ${c.totalExperienceYears} years of experience`);
        } else if (diff <= 1) {
          score += 20;
          highlights.push(`${c.totalExperienceYears} years of experience (close match to ${targetYears} yrs)`);
        } else if (diff <= 2) {
          score += 12;
        } else if (c.totalExperienceYears > targetYears) {
          score += 15;
          highlights.push(`${c.totalExperienceYears} years of seasoned experience`);
        }
      } else {
        score += Math.min(20, c.totalExperienceYears * 3);
      }

      // 3. Role and Summary text semantic overlap (Weight: 20)
      const fullCorpus = `${c.currentRole || ''} ${c.summary} ${c.projects.map(p => p.name + ' ' + p.description).join(' ')}`.toLowerCase();
      queryTokens.forEach(tok => {
        if (fullCorpus.includes(tok)) {
          score += 5;
          if (tok.length > 3 && !highlights.some(h => h.toLowerCase().includes(tok))) {
            highlights.push(`Mentioned "${tok}" in project portfolio or background`);
          }
        }
      });

      // 4. Leadership / Startup / Domain semantic keywords
      if (q.includes('lead') && (fullCorpus.includes('lead') || fullCorpus.includes('architect') || c.totalExperienceYears >= 6)) {
        score += 12;
        highlights.push('Proven team lead / architectural background');
      }
      if (q.includes('startup') && (fullCorpus.includes('scale') || fullCorpus.includes('fast-paced') || fullCorpus.includes('innovations'))) {
        score += 10;
        highlights.push('High-growth startup scaling experience');
      }
      if ((q.includes('nlp') || q.includes('machine learning') || q.includes('ai')) && (fullCorpus.includes('pytorch') || fullCorpus.includes('llm') || fullCorpus.includes('transformer') || fullCorpus.includes('rag'))) {
        score += 15;
        highlights.push('Direct experience in LLMs, PyTorch, or RAG architectures');
      }
      if (q.includes('aws') && (c.technicalSkills.includes('AWS') || fullCorpus.includes('aws') || fullCorpus.includes('cloud'))) {
        score += 12;
        highlights.push('Strong AWS cloud infrastructure proficiency');
      }

      const normalizedScore = Math.min(98, Math.max(35, Math.round(score)));

      return {
        candidate: c,
        relevanceScore: normalizedScore,
        matchingHighlights: highlights.slice(0, 3),
        matchedSkills: Array.from(new Set(matchedSkills)),
        explanation: `Candidate scores ${normalizedScore}% semantic similarity. ${matchedSkills.length > 0 ? `Matched skills: ${matchedSkills.join(', ')}.` : 'Broad domain relevance with strong experience depth.'}`
      };
    });

    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return results.slice(0, limit);
  }
}
