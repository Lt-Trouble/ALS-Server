// app/library/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface LibraryCategory {
  id: string;
  name: string;
  coverImage: string;
  pdfFiles: {
    title: string;
    url: string;
    thumbnail?: string;
    pageCount: number;
  }[];
}

export default function LibraryPage() {
  // Sample data with correct public paths (no /public prefix needed)
  const libraryCategories: LibraryCategory[] = [
    {
      id: "1",
      name: "COMMUNICATION SKILLS FILIPINO",
      coverImage: "/library/covers/commskills-filipino.jpg",
      pdfFiles: [
        {
          title: "Modyul 1",
          url: "/library/pdfs/commskills-filipino-1.pdf",
          thumbnail: "/library/covers/commskills-filipino.jpg",
          pageCount: 88
        },
        {
          title: "Modyul 2", 
          url: "/library/pdfs/commskills-filipino-2.pdf",
          thumbnail: "/library/covers/commskills-filipino.jpg",
          pageCount: 88
        }
      ]
    },
    {
      id: "2",
      name: "COMMUNICATION SKILLS ENGLISH",
      coverImage: "/library/covers/commskills-english.jpg",
      pdfFiles: [
        {
          title: "Module 1",
          url: "/library/pdfs/commskills-english-1.pdf",
          thumbnail: "/library/covers/commskills-english.jpg",
          pageCount: 58
        },
        {
          title: "Module 2",
          url: "/library/pdfs/commskills-english-2.pdf",
          thumbnail: "/library/covers/commskills-english.jpg",
          pageCount: 52
        }
      ]
    },
    {
      id: "3",
      name: "SCIENTIFIC AND CRITICAL THINKING SKILLS",
      coverImage: "/library/covers/scientific.jpg",
      pdfFiles: [
        {
          title: "Module 1",
          url: "/library/pdfs/scientific-1.pdf",
          thumbnail: "/library/covers/scientific.jpg",
          pageCount: 69
        },
        {
          title: "Module 2",
          url: "/library/pdfs/scientific-2.pdf",
          thumbnail: "/library/covers/scientific.jpg",
          pageCount: 69
        }
      ]
    },
    {
      id: "4",
      name: "MATHEMATICS",
      coverImage: "/library/covers/mathematics.jpg",
      pdfFiles: [
        {
          title: "Module 1",
          url: "/library/pdfs/mathematics-1.pdf",
          thumbnail: "/library/covers/mathematics.jpg",
          pageCount: 58
        },
        {
          title: "Module 2",
          url: "/library/pdfs/mathematics-2.pdf",
          thumbnail: "/library/covers/mathematics.jpg",
          pageCount: 52
        }
      ]
    },
    {
      id: "5",
      name: "Life and Career Skills",
      coverImage: "/library/covers/life.jpg",
      pdfFiles: [
        {
          title: "Module 1",
          url: "/library/pdfs/life-1.pdf",
          thumbnail: "/library/covers/life.jpg",
          pageCount: 58
        },
        {
          title: "Module 2",
          url: "/library/pdfs/life-2.pdf",
          thumbnail: "/library/covers/life.jpg",
          pageCount: 52
        }
      ]
    },
  ];

  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-400">MODULES</h1>
        <p className="text-blue-600 mt-2">
          Browse and view our learning materials
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {libraryCategories.map((category) => (
          <article
            key={category.id}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-300"
          >
            {/* Cover Image Header */}
            <div className="relative h-48 w-full">
              <Image
                src={category.coverImage}
                alt={`${category.name} cover`}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/library/default-cover.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <h2 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
                {category.name}
              </h2>
            </div>

            {/* Carousel Container */}
            <div className="p-4">
              <div className="relative">
                {/* PDF Carousel */}
                <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                  {category.pdfFiles.map((pdf) => (
                    <div 
                      key={pdf.url}
                      className="flex-shrink-0 w-64 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedPdf(pdf.url)}
                    >
                      <div className="h-40 relative">
                        {pdf.thumbnail ? (
                          <Image
                            src={pdf.thumbnail}
                            alt={`${pdf.title} thumbnail`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400">PDF</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-800 truncate">{pdf.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {pdf.pageCount} pages
                        </p>
                        <div className="mt-3">
                          <a
                            href={pdf.url}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="inline-block px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPdf(null)}
        >
          <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-100 flex justify-between items-center">
              <h3 className="font-medium">
                {libraryCategories
                  .flatMap(c => c.pdfFiles)
                  .find(pdf => pdf.url === selectedPdf)?.title}
              </h3>
              <button 
                onClick={() => setSelectedPdf(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="h-[80vh]">
              <iframe 
                src={`${selectedPdf}#view=fitH`}
                className="w-full h-full"
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}