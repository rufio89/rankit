'use client';

import React from 'react';
import { useState } from 'react';
import { Attribute, Importance } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AttributeFormProps {
  onAttributeAdd: (attribute: Omit<Attribute, 'id'>) => void;
}

export function AttributeForm({ onAttributeAdd }: AttributeFormProps) {
  const [name, setName] = useState('');
  const [importance, setImportance] = useState<Importance>(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAttributeAdd({ name: name.trim(), importance });
      setName('');
      setImportance(3);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Attribute</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Attribute Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Location, Price, Size"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="importance">Importance (1-5)</Label>
            <Select
              value={importance.toString()}
              onValueChange={(value) => setImportance(Number(value) as Importance)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select importance" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Add Attribute</Button>
        </form>
      </CardContent>
    </Card>
  );
} 