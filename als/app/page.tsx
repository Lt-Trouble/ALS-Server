"use client";
import { ICategory } from "@/types/types";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";

export default function QuizCatalog() {
  const { categories } = useGlobalContext();

  return (
    <div className="min-h-screen bg-white">
      {/* Wave Banner */}
      <div className="relative w-full py-8 overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="absolute inset-0 overflow-hidden">
          <svg 
            className="w-full h-full text-blue-200"
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
          >
            <path 
              d="M0,50 C150,150 350,0 500,50 S850,0 1000,50 V200 H0 Z" 
              fill="currentColor"
              opacity="0.2"
            />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">Quiz Catalog</h1>
          <p className="text-blue-500 text-sm md:text-base">
            Explore and test your knowledge with our interactive quizzes
          </p>
        </div>
      </div>
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="relative">
          <input
        type="text"
        placeholder="Search quizzes..."
        className="w-full border border-gray-300 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <svg
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
          >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z"
        />
          </svg>
        </div>
      </div>
      {/* Compact Quiz Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <QuizCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuizCard({ category }: { category: ICategory }) {
  const router = useRouter();

  return (
    <div 
      className="border border-gray-100 rounded-lg p-3 cursor-pointer shadow-xs hover:shadow-sm
      transition-all duration-150 bg-white h-full flex flex-col group"
      onClick={() => router.push(`/categories/${category.id}`)}
    >
      {/* Image with subtle overlay */}
      <div className="relative rounded-lg h-24 w-full overflow-hidden">
          <Image
          src={category.image || `/categories/image--${category.name.toLowerCase().replace(/\s+/g, '-')}.svg`}
          fill
          alt={category.name}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Compact content */}
      <div className="pt-2 flex-1">
        <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
          {category.name}
        </h3>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
          {category.description}
        </p>
        <div className="mt-2 flex items-center text-xs text-gray-400">
          <svg 
            className="w-3 h-3 mr-1 text-blue-400" 
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{category.quizzes?.length || 0} quizzes</span>
        </div>
      </div>
    </div>
  );
}