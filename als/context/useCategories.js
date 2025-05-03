import React, { useState, useEffect } from "react";
import axios from "axios";
const useCategories = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    const getCategories = async () => {
        setLoading(true);
        try {

            const res = await axios.get("/api/categories");

            setCategories(res.data);

            setLoading(false);
    
        } catch (error) {
            console.log("Error fetching categories", error);
        }
    }
    useEffect(() => {
        getCategories();
    }, []);

    return { loading, categories };
};



export default useCategories;