"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle2, XCircle, Trophy, ChevronRight } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface BookQuizProps {
  quiz: QuizQuestion[];
  bookTitle: string;
}

export function BookQuiz({ quiz, bookTitle }: BookQuizProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!quiz || quiz.length === 0) return null;

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setShowExplanation(true);
    if (selectedAnswer === quiz[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
    setShowQuiz(true);
  };

  if (!showQuiz) {
    return (
      <Card className="my-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-blue-900">
            Metti alla Prova le Tue Conoscenze
          </h3>
          <p className="text-blue-800 max-w-2xl mx-auto">
            Hai davvero compreso i concetti chiave di "{bookTitle}"? Fai il quiz per valutare
            le tue competenze e ricevere feedback immediato.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-blue-700">
            <Badge variant="secondary">{quiz.length} domande</Badge>
            <span>•</span>
            <span>Risposte multiple</span>
            <span>•</span>
            <span>Con spiegazioni</span>
          </div>
          <Button
            onClick={() => setShowQuiz(true)}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Inizia il Quiz
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Card>
    );
  }

  if (completed) {
    const percentage = Math.round((score / quiz.length) * 100);
    const passed = percentage >= 60;

    return (
      <Card className="my-12 p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-green-900">Quiz Completato!</h3>
          <div className="space-y-2">
            <p className="text-6xl font-bold text-green-600">{percentage}%</p>
            <p className="text-lg text-green-800">
              Hai risposto correttamente a {score} su {quiz.length} domande
            </p>
          </div>
          {passed ? (
            <p className="text-green-700 text-lg font-medium">
              Ottimo lavoro! Hai una buona comprensione dei concetti chiave.
            </p>
          ) : (
            <p className="text-orange-700 text-lg font-medium">
              Continua a studiare! Rileggi il riassunto e riprova il quiz.
            </p>
          )}
          <Button onClick={handleRestart} size="lg" className="bg-green-600 hover:bg-green-700">
            Rifai il Quiz
          </Button>
        </div>
      </Card>
    );
  }

  const question = quiz[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <Card className="my-12 p-8">
      <div className="space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Domanda {currentQuestion + 1} di {quiz.length}</span>
          <span>Punteggio: {score}/{quiz.length}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div>
          <h3 className="text-xl font-bold mb-6">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === question.correctAnswer;

              let className = "p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary";

              if (showExplanation) {
                if (isCorrectAnswer) {
                  className = "p-4 rounded-lg border-2 bg-green-50 border-green-500";
                } else if (isSelected && !isCorrect) {
                  className = "p-4 rounded-lg border-2 bg-red-50 border-red-500";
                } else {
                  className = "p-4 rounded-lg border-2 opacity-50";
                }
              } else if (isSelected) {
                className = "p-4 rounded-lg border-2 border-primary bg-primary/5";
              }

              return (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={className}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showExplanation && isCorrectAnswer && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {showExplanation && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <Card className={`p-6 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div className="space-y-2">
                <p className={`font-bold ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                  {isCorrect ? 'Risposta Corretta!' : 'Risposta Errata'}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {question.explanation}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {!showExplanation ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              size="lg"
            >
              Conferma Risposta
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} size="lg">
              {currentQuestion < quiz.length - 1 ? 'Prossima Domanda' : 'Vedi Risultati'}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
