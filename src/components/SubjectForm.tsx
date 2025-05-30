'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Attribute, Subject } from '@/types';

interface SubjectFormProps {
  attributes: Attribute[];
  onSubjectAdd: (subject: Omit<Subject, 'id'>) => void;
  editingSubject?: Subject;
  onCancel?: () => void;
}

export function SubjectForm({ attributes, onSubjectAdd, editingSubject, onCancel }: SubjectFormProps) {
  const [name, setName] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (editingSubject) {
      setName(editingSubject.name);
      setScores(editingSubject.scores);
    } else {
      setName('');
      setScores({});
    }
  }, [editingSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && attributes.every(attr => scores[attr.id] !== undefined)) {
      onSubjectAdd({
        name,
        scores
      });
      if (!editingSubject) {
        setName('');
        setScores({});
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subject name"
              required
            />
          </div>

          <div className="space-y-4">
            {attributes.map(attribute => (
              <div key={attribute.id} className="space-y-2">
                <Label htmlFor={`score-${attribute.id}`}>
                  {attribute.name}
                  <span className="text-muted-foreground ml-1">(Weight: {attribute.importance})</span>
                </Label>
                <Select
                  value={scores[attribute.id]?.toString() || ''}
                  onValueChange={(value) => setScores(prev => ({ ...prev, [attribute.id]: Number(value) }))}
                >
                  <SelectTrigger id={`score-${attribute.id}`}>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              {editingSubject ? 'Save Changes' : 'Add Subject'}
            </Button>
            {editingSubject && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 