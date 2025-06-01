'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Attribute, Subject } from '@/types';
import { DecisionStepper } from '@/components/DecisionStepper';
import { SubjectForm } from '@/components/SubjectForm';
import { Results } from '@/components/Results';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Trash2 } from 'lucide-react';

// New type for a decision topic
interface DecisionTopic {
  id: string;
  name: string;
  attributes: Attribute[];
  subjects: Subject[];
}

export default function Dashboard() {
  const [topics, setTopics] = useState<DecisionTopic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [showStepper, setShowStepper] = useState(false);
  const [editingTopic, setEditingTopic] = useState<DecisionTopic | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>();
  const [showAttributes, setShowAttributes] = useState(false);

  // Dashboard actions
  const handleCreateTopic = () => {
    setShowStepper(true);
    setEditingTopic(null);
  };

  const handleDeleteTopic = (id: string) => {
    setTopics(prev => prev.filter(t => t.id !== id));
    if (selectedTopicId === id) setSelectedTopicId(null);
  };

  const handleStepperComplete = (decision: string, newAttributes: Omit<Attribute, 'id'>[]) => {
    const newTopic: DecisionTopic = {
      id: uuidv4(),
      name: decision,
      attributes: newAttributes.map(attr => ({ ...attr, id: uuidv4() })),
      subjects: [],
    };
    setTopics(prev => [...prev, newTopic]);
    setShowStepper(false);
    setSelectedTopicId(newTopic.id);
  };

  // Topic detail actions
  const selectedTopic = topics.find(t => t.id === selectedTopicId) || null;

  const handleBackToDashboard = () => {
    setSelectedTopicId(null);
    setEditingSubject(undefined);
    setShowAttributes(false);
  };

  const handleSubjectAdd = (subject: Omit<Subject, 'id'>) => {
    if (!selectedTopic) return;
    setTopics(prev => prev.map(t => {
      if (t.id !== selectedTopic.id) return t;
      if (editingSubject) {
        return {
          ...t,
          subjects: t.subjects.map(s => s.id === editingSubject.id ? { ...subject, id: s.id } : s),
        };
      } else {
        return {
          ...t,
          subjects: [...t.subjects, { ...subject, id: uuidv4() }],
        };
      }
    }));
    setEditingSubject(undefined);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
  };

  const handleCancelEdit = () => {
    setEditingSubject(undefined);
  };

  const handleRemoveSubject = (subject: Subject) => {
    if (!selectedTopic) return;
    setTopics(prev => prev.map(t => t.id === selectedTopic.id ? {
      ...t,
      subjects: t.subjects.filter(s => s.id !== subject.id),
    } : t));
    if (editingSubject && editingSubject.id === subject.id) {
      setEditingSubject(undefined);
    }
  };

  const handleBackToAttributes = () => {
    setShowAttributes(true);
  };

  const handleAttributesUpdate = (decision: string, updatedAttributes: Omit<Attribute, 'id'>[]) => {
    if (!selectedTopic) return;
    setTopics(prev => prev.map(t => t.id === selectedTopic.id ? {
      ...t,
      name: decision,
      attributes: updatedAttributes.map(attr => ({ ...attr, id: uuidv4() })),
    } : t));
    setShowAttributes(false);
  };

  // Dashboard view
  if (!selectedTopicId && !showStepper) {
    return (
      <main className="container mx-auto p-4 space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">Decision Topics Dashboard</h1>
        <div className="flex justify-between items-center mb-6">
          <Button onClick={handleCreateTopic}>+ New Topic</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map(topic => {
            // Find winner
            const results = topic.subjects.length > 0 && topic.attributes.length > 0
              ? topic.subjects.map(subject => {
                  const totalScore = Object.values(subject.scores).reduce((sum, score) => sum + score, 0);
                  const weightedScore = Object.entries(subject.scores).reduce((sum, [attrId, score]) => {
                    const attribute = topic.attributes.find(attr => attr.id === attrId);
                    return sum + (score * (attribute?.importance || 1));
                  }, 0);
                  return { subject, totalScore, weightedScore };
                }).sort((a, b) => b.weightedScore - a.weightedScore)
              : [];
            const winner = results.length > 1 ? results[0].subject.name : null;
            return (
              <div key={topic.id} className="border rounded-lg shadow p-4 flex flex-col gap-2 bg-white">
                <div className="flex items-center gap-2 justify-between">
                  <span className="text-xl font-semibold">{topic.name}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTopic(topic.id)}>
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">{topic.subjects.length} subjects</div>
                {winner && (
                  <div className="flex items-center gap-1 text-green-600 font-bold">
                    <Trophy className="h-4 w-4 text-green-600" /> {winner} (Winner)
                  </div>
                )}
                <Button className="mt-2" onClick={() => setSelectedTopicId(topic.id)}>
                  Manage
                </Button>
              </div>
            );
          })}
        </div>
      </main>
    );
  }

  // New topic creation (stepper)
  if (showStepper) {
    return (
      <main className="container mx-auto p-4">
        <Button variant="outline" onClick={() => setShowStepper(false)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        <DecisionStepper onComplete={handleStepperComplete} />
      </main>
    );
  }

  // Topic detail view
  if (selectedTopic) {
    return (
      <main className="container mx-auto p-4 space-y-8">
        <Button variant="outline" onClick={handleBackToDashboard} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        <h2 className="text-3xl font-bold mb-4">{selectedTopic.name}</h2>
        {showAttributes ? (
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
              initialDecision={selectedTopic.name}
              initialAttributes={selectedTopic.attributes.map(({ id, ...attr }) => attr)}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handleBackToAttributes}
              >
                Edit Attribute Weights
              </Button>
            </div>
            {selectedTopic.subjects.length > 0 && (
              <Results
                subjects={selectedTopic.subjects}
                attributes={selectedTopic.attributes}
                onEditSubject={handleEditSubject}
                onRemoveSubject={handleRemoveSubject}
              />
            )}
            <SubjectForm
              attributes={selectedTopic.attributes}
              onSubjectAdd={handleSubjectAdd}
              editingSubject={editingSubject}
              onCancel={handleCancelEdit}
            />
          </div>
        )}
      </main>
    );
  }

  return null;
}
