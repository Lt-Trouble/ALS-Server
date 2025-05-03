"use client";
import { useGlobalContext } from '@/context/globalContext';
import { IOption, IQuestion, IResponse } from '@/types/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';

// Fisher-Yates shuffle implementation
const fisherYatesShuffle = <T,>(array: T[]): T[] => {
    if (!array || array.length === 0) return array;
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Quizizz-like color palette
const optionColors = [
    'bg-[#FF6B6B] hover:bg-[#FF5252] border-[#FF6B6B]', // Red
    'bg-[#4ECDC4] hover:bg-[#3DBDB4] border-[#4ECDC4]', // Teal
    'bg-[#FFD166] hover:bg-[#FFC233] border-[#FFD166]', // Yellow
    'bg-[#06D6A0] hover:bg-[#00C896] border-[#06D6A0]', // Green
];

function Page() {
    const { 
        selectedQuiz, 
        quizSetup, 
        setQuizResponses,
        clearQuiz
    } = useGlobalContext();
    
    const router = useRouter();
    const errorAudioRef = useRef<HTMLAudioElement | null>(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeQuestion, setActiveQuestion] = useState<IQuestion | null>(null);
    const [responses, setResponses] = useState<IResponse[]>([]);
    const [shuffledOptions, setShuffledOptions] = useState<IOption[]>([]);
    const [shuffledQuestions, setShuffledQuestions] = useState<IQuestion[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize audio
    useEffect(() => {
        errorAudioRef.current = new Audio('/sounds/error.mp3');
    }, []);

    // Shuffle questions when component mounts or quiz changes
    useEffect(() => {
        if (!selectedQuiz?.questions) {
            router.push("/");
            return;
        }

        // Filter questions based on difficulty
        const filteredQuestions = selectedQuiz.questions.filter(q => (
            !quizSetup?.difficulty || 
            quizSetup.difficulty === "unspecified" || 
            q.difficulty === quizSetup.difficulty
        )).slice(0, quizSetup?.questionCount || 10);

        // Shuffle questions and options
        const shuffled = fisherYatesShuffle(filteredQuestions).map(q => ({
            ...q,
            options: fisherYatesShuffle([...q.options])
        }));

        setShuffledQuestions(shuffled);
        setIsLoading(false);
    }, [selectedQuiz, quizSetup, router]);

    // Set active question when index changes
    useEffect(() => {
        if (shuffledQuestions.length > 0 && currentIndex < shuffledQuestions.length) {
            const currentQuestion = shuffledQuestions[currentIndex];
            setActiveQuestion(currentQuestion);
            setShuffledOptions(currentQuestion.options);
            setSelectedOption(null);
        }
    }, [currentIndex, shuffledQuestions]);

    const handleOptionSelect = (option: IOption) => {
        if (!shuffledQuestions[currentIndex] || selectedOption !== null) return;

        setSelectedOption(option.id);
        
        const response: IResponse = {
            questionId: shuffledQuestions[currentIndex].id,
            optionId: option.id,
            isCorrect: option.isCorrect,
        };

        setResponses(prev => [...prev, response]);

        if (!option.isCorrect && errorAudioRef.current) {
            errorAudioRef.current.currentTime = 0;
            errorAudioRef.current.play().catch(e => {
                console.error("Audio play failed:", e);
                toast.error('Could not play error sound');
            });
        }
    };

    const handleNextQuestion = () => {
        if (currentIndex < shuffledQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
        }
    };

    const handleFinishQuiz = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading('Submitting your quiz...');
        
        try {
            setQuizResponses(responses);
            const score = responses.filter(res => res.isCorrect).length;

            await axios.post("/api/user/quiz/finish", {
                categoryId: selectedQuiz.categoryId,
                quizId: selectedQuiz.id,
                score,
                responses,
            });

            toast.success('Quiz submitted successfully!', { id: toastId });
            router.push("/quiz/results");
        } catch (error) {
            console.error("Error finishing quiz:", error);
            toast.error('Failed to submit quiz. Please try again.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!selectedQuiz || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
                <div className="text-xl font-medium text-purple-800">
                    {isLoading ? 'Loading quiz...' : 'No quiz selected, redirecting...'}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-8 px-4">
            <audio ref={errorAudioRef} src="/sounds/error.mp3" preload="auto" />
            
            {activeQuestion && (
                <div className="max-w-3xl mx-auto">
                    {/* Quizizz-like header */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                                {currentIndex + 1}
                            </div>
                            <span className="text-purple-800 font-medium">
                                Question {currentIndex + 1} of {shuffledQuestions.length}
                            </span>
                        </div>
                        <div className="bg-white rounded-full px-4 py-2 shadow-md">
                            <span className="font-bold text-purple-700">
                                Score: {responses.filter(r => r.isCorrect).length}
                            </span>
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl mb-8 transform transition-all duration-300 hover:shadow-2xl">
                        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
                            {activeQuestion.text}
                        </h1>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {shuffledOptions.map((option, index) => (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option)}
                                className={`${optionColors[index % optionColors.length]} 
                                text-white font-bold text-lg p-6 rounded-2xl shadow-md transition-all duration-300 transform hover:scale-105
                                ${selectedOption === option.id ? 
                                    (option.isCorrect ? 
                                        'ring-4 ring-green-300 scale-105' : 
                                        'ring-4 ring-red-300 scale-105') : 
                                    'hover:shadow-lg'}
                                ${selectedOption !== null && selectedOption !== option.id && option.isCorrect ? 
                                    'ring-4 ring-green-300 scale-105' : ''}
                                `}
                                disabled={selectedOption !== null}
                            >
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-white bg-opacity-30 flex items-center justify-center mr-4">
                                        {String.fromCharCode(65 + index)}
                                    </div>
                                    {option.text}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-end">
                        {currentIndex < shuffledQuestions.length - 1 ? (
                            <button
                                onClick={handleNextQuestion}
                                disabled={!selectedOption}
                                className={`py-3 px-8 rounded-full font-bold text-white shadow-lg transition-all duration-300
                                ${selectedOption ? 
                                    'bg-purple-600 hover:bg-purple-700 hover:shadow-xl' : 
                                    'bg-gray-400 cursor-not-allowed'}
                                transform hover:scale-105`}
                            >
                                Next Question →
                            </button>
                        ) : (
                            <button
                                onClick={handleFinishQuiz}
                                disabled={!selectedOption || isSubmitting}
                                className={`py-3 px-8 rounded-full font-bold text-white shadow-lg transition-all duration-300
                                ${selectedOption ? 
                                    'bg-green-600 hover:bg-green-700 hover:shadow-xl' : 
                                    'bg-gray-400 cursor-not-allowed'}
                                transform hover:scale-105 flex items-center`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    'Finish Quiz 🎉'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Page;