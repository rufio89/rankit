'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Attribute, Subject } from '@/types';
import { DecisionStepper } from '@/components/DecisionStepper';
import { SubjectForm } from '@/components/SubjectForm';
import { Results } from '@/components/Results';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Home() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showStepper, setShowStepper] = useState(true);
  const [showAttributes, setShowAttributes] = useState(false);
  const [currentDecision, setCurrentDecision] = useState('');
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>();

  const handleStepperComplete = (decision: string, newAttributes: Omit<Attribute, 'id'>[]) => {
    setAttributes(newAttributes.map(attr => ({ ...attr, id: uuidv4() })));
    setCurrentDecision(decision);
    setShowStepper(false);
  };

  const handleSubjectAdd = (subject: Omit<Subject, 'id'>) => {
    if (editingSubject) {
      setSubjects(prev => prev.map(s => 
        s.id === editingSubject.id 
          ? { ...subject, id: s.id }
          : s
      ));
      setEditingSubject(undefined);
    } else {
      setSubjects(prev => [...prev, { ...subject, id: uuidv4() }]);
    }
  };

  const handleBackToAttributes = () => {
    setShowAttributes(true);
  };

  const handleAttributesUpdate = (decision: string, updatedAttributes: Omit<Attribute, 'id'>[]) => {
    if (Array.isArray(updatedAttributes)) {
      setAttributes(updatedAttributes.map(attr => ({ ...attr, id: uuidv4() })));
      setShowAttributes(false);
    } else {
      console.error('updatedAttributes is not an array:', updatedAttributes);
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
  };

  const handleCancelEdit = () => {
    setEditingSubject(undefined);
  };

  const handleRemoveSubject = (subject: Subject) => {
    setSubjects(prev => prev.filter(s => s.id !== subject.id));
    if (editingSubject && editingSubject.id === subject.id) {
      setEditingSubject(undefined);
    }
  };

  return (
    <main className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">Decision Ranker</h1>
      
      {showStepper ? (
        <DecisionStepper onComplete={handleStepperComplete} />
      ) : showAttributes ? (
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => setShowAttributes(false)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Comparison
          </Button>
          <DecisionStepper 
            onComplete={handleAttributesUpdate}
            initialDecision={currentDecision}
            initialAttributes={attributes.map(({ id, ...attr }) => attr)}
          />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBackToAttributes}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Edit Attribute Weights
            </Button>
          </div>
          {subjects.length > 0 && (
            <Results
              subjects={subjects}
              attributes={attributes}
              onEditSubject={handleEditSubject}
              onRemoveSubject={handleRemoveSubject}
            />
          )}
          <SubjectForm
            attributes={attributes}
            onSubjectAdd={handleSubjectAdd}
            editingSubject={editingSubject}
            onCancel={handleCancelEdit}
          />
        </div>
      )}
    </main>
  );
}
