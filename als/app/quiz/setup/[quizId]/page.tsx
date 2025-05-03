"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGlobalContext } from '@/context/globalContext';
import { play } from '@/utils/Icons';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';

function page() {
  const router = useRouter();
  const { quizSetup, setQuizSetup, selectedQuiz } = useGlobalContext();

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const value = parseInt(e.target.value, 10);
    const maxQuestions = selectedQuiz?.questions.length || 1;

    const newCount = 
      isNaN(value) || value <1 ? 1 :Math.min(value, maxQuestions);

      setQuizSetup((prev: {}) => ({...prev, questionCount: newCount}));
  };

  const handleDifficultyChange = (difficulty:string) => {
    setQuizSetup((prev: {}) => ({...prev, difficulty}));

    console.log("Difficulty: ", difficulty);
  };

  const startQuiz = async () => {
    if (!selectedQuiz?.questions) {
      toast.error("No questions available for this quiz.");
      return;
    }
    
    const selectedQuestions = selectedQuiz?.questions.slice(
      0, 
      quizSetup?.questionCount
    ).filter((q:{difficulty:string}) => {
        return ( 
          quizSetup?.difficulty || 
          q.difficulty?.toLowerCase() === 
          selectedQuiz?.difficulty?.toLowerCase()
        );
    });

    if (selectedQuestions.length > 0) {

      try {
        await axios.post("/api/user/start", {
          categoryId: selectedQuiz?.categoryId,
          quizId: selectedQuiz?.id,
        })
      } catch (error) {
        console.log("Error starting quiz: ", error);
      }

      router.push("/quiz")
    } else {
      toast.error("No questions found for the selected criteria.")

      console.log("Selected Quiz:", JSON.stringify(selectedQuiz, null, 2));
    }
  };

    

  return (
  <div>
      <div className="py-[6rem] w-[50%] fixed left-1/2 top-[45%] translate-x-[-50%] translate-y-[-50%] p-6 border-2 rounded-xl shadow-[0_.5rem_0_0_rgba(0,0,0,0.1)] mx-auto">
        <h1 className="text-4xl font-bold mb-4"> Quiz Setup </h1>
      
        <div className="space-x-6">
          <div className="space-y-2">
            <Label htmlFor="questionCount" className="text-lg">
                Number of Questions
            </Label>
            <Input 
            type="number" 
            min={1} 
            id="questionCount" 
            value={quizSetup?.questionCount} 
            onChange={handleQuestionChange} 
            max={selectedQuiz?.questions.length}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-lg">
              Category
            </Label>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            <SelectContent>
              <SelectItem value="random">Random</SelectItem>
              <SelectItem value="general">General Knowledge</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="modern">Modern Filipino</SelectItem>
            </SelectContent>
            </Select>
          </div>  

          <div className="space-y-2">
            <Label htmlFor="difficulty" className="text-lg">
              Difficulty
            </Label>

            <Select defaultValue="unspecified"
                    onValueChange={(value) => handleDifficultyChange(value)}
            >
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
            <SelectContent>
              <SelectItem value="unspecified">Unspecified</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="py-[4rem] flex items-center justify-center fixed bottom-0 left-0 right-0 bg-white border-t-2">
        <Button variant={"blue"}
          className="px-10 py-6 font-bold text-white text-xl rounded-xl"
          onClick={startQuiz}
        >
          <span className="flex items-center gap-2">{play} Start</span> 
        </Button>
      </div>
  </div>
  );
}

export default page;