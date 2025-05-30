'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Attribute } from '@/types';
import { Pencil, Check, X } from 'lucide-react';

interface DecisionStepperProps {
  onComplete: (decision: string, attributes: Omit<Attribute, 'id'>[]) => void;
  initialDecision?: string;
  initialAttributes?: Omit<Attribute, 'id'>[];
}

export function DecisionStepper({ onComplete, initialDecision, initialAttributes }: DecisionStepperProps) {
  const [step, setStep] = useState(initialDecision ? 2 : 1);
  const [decision, setDecision] = useState(initialDecision || '');
  const [attributes, setAttributes] = useState<Omit<Attribute, 'id'>[]>(initialAttributes || []);
  const [currentAttribute, setCurrentAttribute] = useState({ name: '', importance: 3 });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editAttribute, setEditAttribute] = useState<Omit<Attribute, 'id'> | null>(null);

  const handleAddAttribute = () => {
    if (currentAttribute.name.trim()) {
      setAttributes([...attributes, { ...currentAttribute, importance: currentAttribute.importance as 1 | 2 | 3 | 4 | 5 }]);
      setCurrentAttribute({ name: '', importance: 3 });
    }
  };

  const handleEditAttribute = (index: number) => {
    setEditingIndex(index);
    setEditAttribute(attributes[index]);
  };

  const handleSaveEdit = () => {
    if (editAttribute && editingIndex !== null) {
      const newAttributes = [...attributes];
      newAttributes[editingIndex] = editAttribute;
      setAttributes(newAttributes);
      setEditingIndex(null);
      setEditAttribute(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditAttribute(null);
  };

  const handleNext = () => {
    if (step === 1 && decision.trim()) {
      setStep(2);
    } else if (step === 2 && attributes.length > 0) {
      onComplete(decision, [...attributes]);
    }
  };

  const handleBack = () => {
    if (initialDecision) {
      onComplete(decision, [...attributes]);
    } else {
      setStep(step - 1);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {step === 1 ? 'What are you making a decision about?' : `What attributes about "${decision}" would you like to add?`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="decision">Decision Topic</Label>
              <Input
                id="decision"
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                placeholder="e.g., Buying a house, Choosing a job"
                required
              />
            </div>
            <Button onClick={handleNext} disabled={!decision.trim()}>
              Next
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="attribute-name">Attribute Name</Label>
                <Input
                  id="attribute-name"
                  value={currentAttribute.name}
                  onChange={(e) => setCurrentAttribute({ ...currentAttribute, name: e.target.value })}
                  placeholder="e.g., Location, Price, Size"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="importance">Importance (1-5)</Label>
                <Select
                  value={currentAttribute.importance.toString()}
                  onValueChange={(value) => setCurrentAttribute({ ...currentAttribute, importance: Number(value) })}
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
              <Button onClick={handleAddAttribute} disabled={!currentAttribute.name.trim()}>
                Add Attribute
              </Button>
            </div>

            {attributes.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Added Attributes:</h3>
                <ul className="space-y-2">
                  {attributes.map((attr, index) => (
                    <li key={index} className="flex justify-between items-center p-2 rounded-lg border">
                      {editingIndex === index ? (
                        <div className="flex-1 space-y-2">
                          <Input
                            value={editAttribute?.name || ''}
                            onChange={(e) => setEditAttribute(prev => prev ? { ...prev, name: e.target.value } : null)}
                            placeholder="Attribute name"
                          />
                          <Select
                            value={editAttribute?.importance.toString() || '3'}
                            onValueChange={(value) => setEditAttribute(prev => prev ? { ...prev, importance: Number(value) as 1 | 2 | 3 | 4 | 5 } : null)}
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
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveEdit}>
                              <Check className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <span className="font-medium">{attr.name}</span>
                            <span className="text-muted-foreground ml-2">Importance: {attr.importance}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAttribute(index)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                {initialDecision ? 'Cancel' : 'Back'}
              </Button>
              <Button onClick={handleNext} disabled={attributes.length === 0}>
                {initialDecision ? 'Save Changes' : 'Complete'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 