"use client";
import { ICategory } from "@/types/types";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface Props {
  category: ICategory;
}

function HomeCard({ category }: Props) {
  const router = useRouter();

  return (
    <div 
      className="border border-gray-200 rounded-xl p-4 cursor-pointer shadow-sm hover:shadow-md
      hover:-translate-y-0.5 transition-all duration-200 ease-in-out bg-white
      w-full h-full flex flex-col"
      onClick={() => router.push(`/categories/${category.id}`)}
    >
      {/* Image with gradient overlay */}
      <div className="relative rounded-xl h-[10rem] overflow-hidden group flex-shrink-0">
        <Image 
          src={category.image ? category.image 
            : `/categories/image--${category.name
                .toLowerCase()
                .split(" ")
                .join("-")}.svg`
            }
          width={400}
          height={225}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="pt-4 flex-1 flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
          {category.name}
        </h2>
        <p className="text-gray-600 text-base leading-tight mt-2 line-clamp-2">
          {category.description}
        </p>
        
        {/* Quiz count */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span>{category.quizzes?.length || 0} quizzes</span>
        </div>
      </div>
    </div>
  );
}

export default HomeCard;