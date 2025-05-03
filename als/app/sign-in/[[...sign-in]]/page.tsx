import { SignIn } from "@clerk/nextjs";
import React from "react";

function page() {
    return (
        <div className="h-[100vh] flex items-center justify-center">
            <SignIn />
        </div>
    );  
}

export default page;