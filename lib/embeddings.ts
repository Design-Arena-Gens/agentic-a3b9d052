import OpenAI from 'openai';
import { PDFChunk, QueryResult } from './types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
    });
    
    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw new Error('Failed to generate embeddings');
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function semanticSearch(
  query: string,
  chunks: PDFChunk[],
  topK: number = 5
): Promise<QueryResult[]> {
  try {
    // Generate embedding for query
    const queryEmbedding = await generateEmbeddings([query]);
    const queryVector = queryEmbedding[0];
    
    // Generate embeddings for chunks if not already done
    const chunksWithoutEmbeddings = chunks.filter(c => !c.embedding);
    if (chunksWithoutEmbeddings.length > 0) {
      const chunkTexts = chunksWithoutEmbeddings.map(c => c.text);
      const embeddings = await generateEmbeddings(chunkTexts);
      
      chunksWithoutEmbeddings.forEach((chunk, idx) => {
        chunk.embedding = embeddings[idx];
      });
    }
    
    // Calculate similarities
    const results = chunks
      .filter(chunk => chunk.embedding)
      .map(chunk => ({
        chunk,
        score: cosineSimilarity(queryVector, chunk.embedding!)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
    
    // Format results
    return results.map(result => ({
      text: result.chunk.text,
      pageNumber: result.chunk.pageNumber,
      score: result.score,
      context: extractContext(result.chunk, chunks)
    }));
  } catch (error) {
    console.error('Semantic search error:', error);
    throw new Error('Failed to perform semantic search');
  }
}

function extractContext(chunk: PDFChunk, allChunks: PDFChunk[]): string {
  // Get surrounding chunks for context
  const samePage = allChunks.filter(c => c.pageNumber === chunk.pageNumber);
  const chunkIdx = samePage.findIndex(c => c.id === chunk.id);
  
  const prevChunk = chunkIdx > 0 ? samePage[chunkIdx - 1] : null;
  const nextChunk = chunkIdx < samePage.length - 1 ? samePage[chunkIdx + 1] : null;
  
  let context = '';
  if (prevChunk) context += prevChunk.text.slice(-100) + ' ... ';
  context += chunk.text;
  if (nextChunk) context += ' ... ' + nextChunk.text.slice(0, 100);
  
  return context;
}

export async function hybridSearch(
  query: string,
  chunks: PDFChunk[],
  topK: number = 5
): Promise<QueryResult[]> {
  // First, try exact keyword matching
  const queryLower = query.toLowerCase();
  const exactMatches = chunks.filter(chunk => 
    chunk.text.toLowerCase().includes(queryLower)
  );
  
  if (exactMatches.length > 0) {
    // Return exact matches with context
    return exactMatches.slice(0, topK).map(chunk => ({
      text: chunk.text,
      pageNumber: chunk.pageNumber,
      score: 1.0,
      context: extractContext(chunk, chunks)
    }));
  }
  
  // Fall back to semantic search
  return semanticSearch(query, chunks, topK);
}
