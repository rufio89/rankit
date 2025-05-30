'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Attribute, Subject, ComparisonResult } from '@/types';
import { Pencil, Trophy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultsProps {
  subjects: Subject[];
  attributes: Attribute[];
  onEditSubject?: (subject: Subject) => void;
  onRemoveSubject?: (subject: Subject) => void;
}

export function Results({ subjects, attributes, onEditSubject, onRemoveSubject }: ResultsProps) {
  const calculateResults = (): ComparisonResult[] => {
    return subjects.map(subject => {
      const totalScore = Object.values(subject.scores).reduce((sum, score) => sum + score, 0);
      const weightedScore = Object.entries(subject.scores).reduce((sum, [attrId, score]) => {
        const attribute = attributes.find(attr => attr.id === attrId);
        return sum + (score * (attribute?.importance || 1));
      }, 0);

      return {
        subject,
        totalScore,
        weightedScore
      };
    }).sort((a, b) => b.weightedScore - a.weightedScore);
  };

  const results = calculateResults();

  // Find the top weighted score for highlighting
  const topScore = results.length > 1 ? results[0].weightedScore : null;

  return (
    <Card className="shadow-lg rounded-xl border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Comparison Results</span>
          <span className="text-xs text-muted-foreground">(Click a row to edit)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Subject</TableHead>
              {attributes.map(attr => (
                <TableHead key={attr.id} className="font-bold">
                  {attr.name}
                  <span className="text-muted-foreground ml-1">(Weight: {attr.importance})</span>
                </TableHead>
              ))}
              <TableHead className="font-bold">Total Score</TableHead>
              <TableHead className="font-bold">Weighted Score</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, idx) => {
              const isTop = topScore !== null && result.weightedScore === topScore && idx === 0;
              return (
                <TableRow
                  key={result.subject.id}
                  className={`transition hover:bg-blue-50 ${isTop ? 'bg-green-50 border-2 border-green-400' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  style={{ verticalAlign: 'middle' }}
                >
                  <TableCell className="font-medium flex items-center gap-2 text-lg">
                    {result.subject.name}
                    {isTop && (
                      <span className="flex items-center gap-1 text-green-600 font-bold">
                        <Trophy className="h-5 w-5 text-green-600" /> Winner
                      </span>
                    )}
                  </TableCell>
                  {attributes.map(attr => (
                    <TableCell key={attr.id}>
                      {result.subject.scores[attr.id] || 0}
                    </TableCell>
                  ))}
                  <TableCell>
                    <span>{result.totalScore}</span>
                  </TableCell>
                  <TableCell>
                    <span>{result.weightedScore}</span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditSubject?.(result.subject);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSubject?.(result.subject);
                      }}
                      className="ml-1"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 