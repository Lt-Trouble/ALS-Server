"use client";
import { useGlobalContext } from '@/context/globalContext';
import { IQuestion, IResponse } from '@/types/types';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

// Local Fisher-Yates shuffle for results page
const fisherYatesShuffle = <T,>(array: T[]): T[] => {
    if (!array || array.length === 0) return array;
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export default function ResultsPage() {
    const { 
        quizResponses, 
        selectedQuiz, 
        clearQuiz
    } = useGlobalContext();
    
    const router = useRouter();
    const [score, setScore] = useState<number>(0);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const processResults = async () => {
            try {
                if (!selectedQuiz || !quizResponses?.length) {
                    toast.error('No quiz data available');
                    router.push('/');
                    return;
                }

                // Calculate score
                const correctCount = quizResponses.filter(r => r.isCorrect).length;
                const calculatedScore = Math.round((correctCount / quizResponses.length) * 100);
                setScore(calculatedScore);

                // Prepare results data
                const resultsData = quizResponses.map(response => {
                    const question = selectedQuiz.questions.find(q => q.id === response.questionId);
                    const userOption = question?.options.find(o => o.id === response.optionId);
                    const correctOption = question?.options.find(o => o.isCorrect);
                    
                    return {
                        question: question?.text || 'Question not available',
                        userAnswer: userOption?.text || 'No answer selected',
                        correctAnswer: correctOption?.text || 'Correct answer not available',
                        isCorrect: response.isCorrect,
                        explanation: question?.explanation
                    };
                });

                // Shuffle results for varied review
                setResults(fisherYatesShuffle(resultsData));

                // Save results
                await axios.post('/api/user/quiz/save-results', {
                    quizId: selectedQuiz.id,
                    categoryId: selectedQuiz.categoryId,
                    score: calculatedScore,
                    responses: quizResponses,
                });
            } catch (error) {
                console.error('Results processing error:', error);
                toast.error('Failed to process results');
            } finally {
                setLoading(false);
            }
        };

        processResults();
    }, [quizResponses, selectedQuiz, router]);

    const handleRestart = () => {
        clearQuiz();
        router.push(`/quiz/setup/${selectedQuiz.categoryId}`);
    };

    const handleReturnHome = () => {
        clearQuiz();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl font-medium">Calculating results...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz Results</h1>
                    <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-8 ${
                        score >= 80 ? 'border-green-500 text-green-500' :
                        score >= 50 ? 'border-yellow-500 text-yellow-500' : 
                        'border-red-500 text-red-500'
                    }`}>
                        <span className="text-4xl font-bold">{score}%</span>
                    </div>
                    <p className="text-2xl mt-4 font-medium text-gray-800">
                        {score >= 80 ? 'Excellent Work! 🎉' :
                         score >= 50 ? 'Good Job! 👍' : 
                         'Keep Practicing! 💪'}
                    </p>
                    <p className="text-gray-600 mt-2">
                        You answered {quizResponses.filter(r => r.isCorrect).length} of {quizResponses.length} questions correctly
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">Detailed Review</h2>
                        <p className="text-gray-600">Questions are randomized for better learning</p>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {results.map((result, index) => (
                            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start">
                                    <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mr-4 ${
                                        result.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900">{result.question}</h3>
                                        <div className="mt-3 space-y-2">
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Your answer:</span>
                                                <p className={`font-medium ${
                                                    result.isCorrect ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {result.userAnswer}
                                                </p>
                                            </div>
                                            {!result.isCorrect && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Correct answer:</span>
                                                    <p className="text-green-600 font-medium">{result.correctAnswer}</p>
                                                </div>
                                            )}
                                            {result.explanation && (
                                                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                                    <span className="text-sm font-medium text-blue-800">Explanation:</span>
                                                    <p className="text-blue-700">{result.explanation}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={handleRestart}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Retake Quiz
                    </button>
                    <button
                        onClick={handleReturnHome}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}