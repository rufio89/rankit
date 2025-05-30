export type Importance = 1 | 2 | 3 | 4 | 5;
export type Score = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Attribute {
  id: string;
  name: string;
  importance: Importance;
}

export interface Subject {
  id: string;
  name: string;
  attributes: {
    attributeId: string;
    score: Score;
  }[];
}

export interface ComparisonResult {
  subjectId: string;
  subjectName: string;
  totalScore: number;
  weightedScores: {
    attributeName: string;
    score: number;
    weightedScore: number;
  }[];
} 