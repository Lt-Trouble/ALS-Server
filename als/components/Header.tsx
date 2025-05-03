"use client";

import { chart, home, login, menu as menuIcon, close, book } from "@/utils/Icons";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Book } from "lucide-react";

function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const menu = [
        {
            name: "Home",
            icon: home,
            link: "/",  
        },
        {
            name: "Library",
            icon: book,
            link: "librarian",
        },
        {
            name: "My Stats",
            icon: chart,
            link: "/stats",
        },
    ];
        
  return (
    <header className="min-h-[8vh] w-full border-b-2 sticky top-0 bg-white z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <nav className="h-full flex items-center justify-between py-2">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 z-50">
                    <Image 
                        src="/icon--logo-lg.png" 
                        alt="logo" 
                        width={40} 
                        height={40}
                        className="w-10 h-10"
                    />
                    <h1 className="text-2xl font-bold text-blue-400">ALS</h1>
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center gap-6 lg:gap-8">
                    {menu.map((item, index) => (
                        <li key={index}> 
                            <Link href={item.link}
                                className={`py-1 px-4 flex items-center gap-2 text-lg leading-none rounded-lg transition-colors
                                    ${
                                        pathname === item.link 
                                            ? "bg-blue-500/20 text-blue-400 border-2 border-blue-400" 
                                            : "text-gray-400 hover:text-blue-400"
                                    }`}
                            >
                                <span className="text-2xl text-blue-400">{item.icon}</span>
                                <span className={`font-bold uppercase
                                    ${pathname === item.link ? "text-blue-400" : "text-gray-400"}`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>    

                {/* Desktop User/Auth Section */}
                <div className="hidden md:flex items-center gap-4">
                    <SignedIn>
                        <UserButton 
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-14 h-14 border-2 border-blue-400 rounded-full",
                                    userButtonPopoverCard: "shadow-lg",
                                },
                            }}
                        />
                    </SignedIn>
                    <SignedOut>
                        <Button 
                            className="py-3 px-4 bg-blue-400 flex items-center gap-2 font-medium text-lg rounded-lg hover:bg-blue-500/90 transition-colors"
                            onClick={() => router.push("/sign-in")}
                        >
                            <span>{login}</span>
                            <span>Login / Sign Up</span>
                        </Button>
                    </SignedOut>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <SignedIn>
                        <UserButton 
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-12 h-12 border-2 border-blue-400 rounded-full",
                                },
                            }}
                        />
                    </SignedIn>
                    <button 
                        className="text-2xl text-blue-400 z-50"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? close : menuIcon}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 bg-white z-40 pt-24 px-6">
                        {/* Profile Section */}
                        <div className="w-full flex justify-center mb-8">
                            <SignedIn>
                                <UserButton 
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "w-24 h-24 border-2 border-blue-400 rounded-full",
                                            userButtonPopoverCard: "shadow-lg",
                                        },
                                    }}
                                />
                            </SignedIn>
                        </div>

                        {/* Navigation Links */}
                        <ul className="w-full flex flex-col items-center gap-4">
                            {menu.map((item, index) => (
                                <li key={index} className="w-full max-w-xs"> 
                                    <Link 
                                        href={item.link}
                                        className={`w-full py-4 px-6 flex items-center gap-4 text-xl leading-none rounded-lg transition-colors
                                            ${
                                                pathname === item.link 
                                                    ? "bg-blue-500/20 text-blue-400 border-2 border-blue-400" 
                                                    : "text-gray-400 hover:text-blue-400"
                                            }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span className="text-3xl text-blue-400">{item.icon}</span>
                                        <span className={`font-bold uppercase
                                            ${pathname === item.link ? "text-blue-400" : "text-gray-400"}`}
                                        >
                                            {item.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </nav>
        </div>
    </header>
  );
}

export default Header;