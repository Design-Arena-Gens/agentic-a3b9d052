'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import QueryInterface from '@/components/QueryInterface';
import { FileText, Sparkles, ArrowLeft } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  totalPages: number;
  chunksCount: number;
}

export default function Home() {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);

  const handleUploadSuccess = (document: Document) => {
    setCurrentDocument(document);
  };

  const handleBack = () => {
    setCurrentDocument(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              AI-Powered PDF Query Assistant
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Extract exact answers from your PDFs with AI-powered semantic search.
            No summaries, no rewording — just precise content from your documents.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Exact Answers</h3>
            <p className="text-sm text-gray-600">
              Get verbatim text from your PDFs without summarization or rewriting
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Search</h3>
            <p className="text-sm text-gray-600">
              Hybrid keyword + semantic search finds the most relevant passages
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Response</h3>
            <p className="text-sm text-gray-600">
              Get answers in seconds, even from 20+ page documents
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          {!currentDocument ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload Your PDF
                </h2>
                <p className="text-gray-600">
                  Start by uploading a PDF document to analyze. Supports multi-page documents up to 50MB.
                </p>
              </div>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </div>
          ) : (
            <div className="space-y-6">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Upload Another PDF</span>
              </button>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Ask Questions
                </h2>
                <p className="text-gray-600">
                  Type your question below to search through the document and find exact answers.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Total Pages</p>
                  <p className="font-semibold text-gray-900">{currentDocument.totalPages}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Text Chunks</p>
                  <p className="font-semibold text-gray-900">{currentDocument.chunksCount}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Status</p>
                  <p className="font-semibold text-green-600">Ready</p>
                </div>
              </div>

              <QueryInterface
                documentId={currentDocument.id}
                documentName={currentDocument.name}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Built with Next.js, OpenAI Embeddings, and semantic search technology
          </p>
        </div>
      </div>
    </main>
  );
}
