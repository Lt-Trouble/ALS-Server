import React, { useEffect } from "react";
import useCategories from "./useCategories";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const GlobalContext = React.createContext();

export const GlobalContextProvider = ({ children }) => {    
    const { loading, categories } = useCategories();
    const { user, isLoaded } = useUser();

    const [quizSetup, setQuizSetup] = React.useState({
        questionCount: 1,
        category: null,
        difficulty: null,
    });
    
    const [selectedQuiz, setSelectedQuiz] = React.useState(null);
    const [quizResponses, setQuizResponses] = React.useState([]);

    useEffect(() => {
        if (!isLoaded || !user?.emailAddresses[0]?.emailAddress) return;

        const registerUser = async () => {
            try {
                await axios.post("/api/user/register");
            } catch (error) {
                console.error("Error registering user:", error);
            }
        };

        registerUser();
    }, [user, isLoaded]);

    const clearQuiz = () => {
        setQuizResponses([]);
    };

    return (
        <GlobalContext.Provider value={{
            loading,
            categories,
            quizSetup,
            setQuizSetup,
            selectedQuiz,
            setSelectedQuiz,
            quizResponses,
            setQuizResponses,
            clearQuiz,
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return React.useContext(GlobalContext);
};