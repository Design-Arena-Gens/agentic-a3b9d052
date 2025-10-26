'use client';

import { useState } from 'react';
import { Search, Loader2, FileText, Clock } from 'lucide-react';

interface QueryResult {
  text: string;
  pageNumber: number;
  score: number;
  context: string;
}

interface QueryInterfaceProps {
  documentId: string;
  documentName: string;
}

export default function QueryInterface({ documentId, documentName }: QueryInterfaceProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          query: query.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Query failed');
      }

      setResults(data.results);
      setResponseTime(data.responseTime);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query failed');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <p className="text-sm font-medium text-blue-900">
            Querying: <span className="font-bold">{documentName}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your PDF..."
            className="w-full px-6 py-4 pr-32 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {responseTime !== null && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Response time: {responseTime}ms</span>
        </div>
      )}

      {hasSearched && results.length === 0 && !isSearching && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No results found for your query.</p>
          <p className="text-gray-400 text-sm mt-2">Try rephrasing your question or using different keywords.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">
            Results ({results.length})
          </h2>
          
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    Page {result.pageNumber}
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {(result.score * 100).toFixed(1)}% match
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Exact Text:</h3>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-gray-900 leading-relaxed">{result.text}</p>
                  </div>
                </div>

                {result.context !== result.text && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Context:</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-gray-700 text-sm leading-relaxed">{result.context}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
