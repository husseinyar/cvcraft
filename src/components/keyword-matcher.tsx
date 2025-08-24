
"use client";

import { useMemo } from 'react';
import type { CVData, JobApplication } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface KeywordMatcherProps {
  job: JobApplication;
  cv: CVData;
}

export default function KeywordMatcher({ job, cv }: KeywordMatcherProps) {
  
  const cvTextContent = useMemo(() => {
    // Combine all relevant text fields from the CV into one string for easy searching
    const content = [
      cv.jobTitle,
      cv.summary,
      ...cv.experience.map(e => `${e.role} ${e.description}`),
      ...cv.education.map(e => `${e.degree} ${e.description || ''}`),
      ...cv.skills,
    ];
    return content.join(' ').toLowerCase();
  }, [cv]);

  const matchedKeywords = useMemo(() => {
    return job.keywords.filter(keyword => 
        new RegExp(`\\b${keyword.toLowerCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i').test(cvTextContent)
    );
  }, [job.keywords, cvTextContent]);

  const unmatchedKeywords = useMemo(() => {
    const matchedSet = new Set(matchedKeywords.map(k => k.toLowerCase()));
    return job.keywords.filter(keyword => !matchedSet.has(keyword.toLowerCase()));
  }, [job.keywords, matchedKeywords]);

  const matchPercentage = Math.round((matchedKeywords.length / job.keywords.length) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyword Match</CardTitle>
        <p className="text-sm text-muted-foreground">
          Matching <span className="font-bold text-primary">{matchPercentage}%</span> of keywords for <span className="font-bold">{job.jobTitle}</span>
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-green-500">
                <CheckCircle size={16} /> Matched Keywords ({matchedKeywords.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map(keyword => <Badge key={keyword} variant="secondary">{keyword}</Badge>)}
              </div>
            </div>
             <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-destructive">
                <XCircle size={16} /> Missing Keywords ({unmatchedKeywords.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {unmatchedKeywords.map(keyword => <Badge key={keyword} variant="destructive">{keyword}</Badge>)}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
