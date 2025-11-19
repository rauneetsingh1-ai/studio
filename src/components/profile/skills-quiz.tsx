'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking } from '@/firebase';
import { BrainCircuit, Loader, CheckCircle } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, Bar, BarChart as RechartsBarChart } from '@/components/ui/chart';


const quizQuestions = [
  {
    question: "What is the primary purpose of a 'key' prop in a list of React components?",
    domain: 'Web',
    options: [
      'To provide a unique style to the component.',
      'To help React identify which items have changed, are added, or are removed.',
      'To set the encryption key for the component data.',
      'To use as a CSS selector.'
    ],
    correctAnswer: 'To help React identify which items have changed, are added, or are removed.'
  },
  {
    question: "Which of the following is a supervised machine learning algorithm?",
    domain: 'ML',
    options: [
        'K-Means Clustering',
        'Principal Component Analysis (PCA)',
        'Linear Regression',
        'Apriori Algorithm'
    ],
    correctAnswer: 'Linear Regression'
  },
    {
    question: "What does the 'git clone' command do?",
    domain: 'Web',
    options: [
        'Creates a new branch.',
        'Deletes a repository.',
        'Creates a local copy of a remote repository.',
        'Merges two branches.'
    ],
    correctAnswer: 'Creates a local copy of a remote repository.'
    },
    {
    question: "In the context of neural networks, what is 'overfitting'?",
    domain: 'ML',
    options: [
        'The model performs well on training data but poorly on unseen data.',
        'The model is too simple to capture the underlying pattern of the data.',
        'The learning rate is too high.',
        'The model has not been trained for enough epochs.'
    ],
    correctAnswer: 'The model performs well on training data but poorly on unseen data.'
    }
];

function QuizResults({ quizData }) {
    if (!quizData?.domainScores) return null;

    const chartData = Object.entries(quizData.domainScores).map(([name, value]) => ({ name, value }));

    const chartConfig = chartData.reduce((acc, item) => {
        acc[item.name] = { label: item.name, color: `hsl(var(--chart-${Object.keys(acc).length + 1}))` };
        return acc;
    }, {});

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" />
                <p className="font-semibold">Quiz Completed! Overall Level: {quizData.overall}</p>
            </div>
            <ChartContainer config={chartConfig} className="min-h-[150px] w-full">
                <RechartsBarChart accessibilityLayer data={chartData} layout="vertical">
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    {chartData.map((item) => (
                         <Bar key={item.name} dataKey="value" layout="vertical" fill={`var(--color-${item.name})`} radius={4} />
                    ))}
                </RechartsBarChart>
            </ChartContainer>
        </div>
    )
}


export function SkillsQuiz({ userProfile, userDocRef }) {
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    let webCorrect = 0;
    let mlCorrect = 0;
    const webTotal = quizQuestions.filter(q => q.domain === 'Web').length;
    const mlTotal = quizQuestions.filter(q => q.domain === 'ML').length;

    quizQuestions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        if (q.domain === 'Web') webCorrect++;
        if (q.domain === 'ML') mlCorrect++;
      }
    });

    const webScore = (webCorrect / webTotal) * 100;
    const mlScore = (mlCorrect / mlTotal) * 100;
    const totalScore = ((webCorrect + mlCorrect) / quizQuestions.length) * 100;

    let overallLevel = 'Beginner';
    if (totalScore > 70) {
      overallLevel = 'Expert';
    } else if (totalScore > 40) {
      overallLevel = 'Intermediate';
    }

    const quizResult = {
      quiz: {
        domainScores: { Web: webScore, ML: mlScore },
        overall: overallLevel,
      },
      updatedAt: serverTimestamp(),
    };

    updateDocumentNonBlocking(userDocRef, quizResult);

    toast({
      title: 'Quiz Submitted!',
      description: 'Your skill profile has been updated.',
    });

    setIsSubmitting(false);
    setIsTakingQuiz(false);
    // The UI will update automatically via the useDoc listener in the parent
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  if (!isTakingQuiz) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Skills Quiz</CardTitle>
          <CardDescription>Quantify your skills and improve your match recommendations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userProfile.quiz ? (
            <QuizResults quizData={userProfile.quiz} />
          ) : (
            <p className="text-sm text-muted-foreground">You haven't taken the quiz yet.</p>
          )}
          <Button onClick={() => setIsTakingQuiz(true)}>
            {userProfile.quiz ? 'Retake Quiz' : 'Take the Quiz'}
            <BrainCircuit className="ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {currentQuestionIndex + 1} of {quizQuestions.length}</CardTitle>
        <CardDescription>{currentQuestion.question}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={answers[currentQuestionIndex]}
          onValueChange={handleAnswerChange}
        >
          {currentQuestion.options.map((option, i) => (
            <div key={i} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${i}`} />
              <Label htmlFor={`option-${i}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        <div className="flex justify-end gap-2">
          {currentQuestionIndex < quizQuestions.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader className="animate-spin mr-2" />}
                Submit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
