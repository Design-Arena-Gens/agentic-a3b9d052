import pdf from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import { PDFChunk } from './types';

const CHUNK_SIZE = 500; // Characters per chunk
const CHUNK_OVERLAP = 50; // Overlap between chunks

export async function processPDF(buffer: Buffer, fileName: string): Promise<{
  chunks: PDFChunk[];
  totalPages: number;
}> {
  try {
    const data = await pdf(buffer);
    
    // Extract text with page information
    const pageTexts: { page: number; text: string }[] = [];
    
    // Parse page-by-page text
    let currentPage = 1;
    const fullText = data.text;
    
    // Split by form feed or approximate page breaks
    const pages = fullText.split('\f').filter(p => p.trim().length > 0);
    
    if (pages.length > 1) {
      pages.forEach((pageText, index) => {
        pageTexts.push({
          page: index + 1,
          text: pageText.trim()
        });
      });
    } else {
      // If no form feeds, estimate pages by character count
      const avgCharsPerPage = fullText.length / data.numpages;
      let currentText = '';
      currentPage = 1;
      
      for (let i = 0; i < fullText.length; i++) {
        currentText += fullText[i];
        
        if (currentText.length >= avgCharsPerPage && currentPage < data.numpages) {
          pageTexts.push({
            page: currentPage,
            text: currentText.trim()
          });
          currentText = '';
          currentPage++;
        }
      }
      
      if (currentText.trim().length > 0) {
        pageTexts.push({
          page: currentPage,
          text: currentText.trim()
        });
      }
    }
    
    // Create chunks with page information
    const chunks: PDFChunk[] = [];
    let globalChunkIndex = 0;
    
    for (const { page, text } of pageTexts) {
      const pageChunks = createChunks(text, page, globalChunkIndex);
      chunks.push(...pageChunks);
      globalChunkIndex += pageChunks.length;
    }
    
    return {
      chunks,
      totalPages: data.numpages
    };
  } catch (error) {
    console.error('PDF processing error:', error);
    throw new Error('Failed to process PDF file');
  }
}

function createChunks(text: string, pageNumber: number, startIndex: number): PDFChunk[] {
  const chunks: PDFChunk[] = [];
  let start = 0;
  let chunkIndex = startIndex;
  
  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    let chunkText = text.slice(start, end);
    
    // Try to end at a sentence boundary
    if (end < text.length) {
      const lastPeriod = chunkText.lastIndexOf('.');
      const lastNewline = chunkText.lastIndexOf('\n');
      const lastBoundary = Math.max(lastPeriod, lastNewline);
      
      if (lastBoundary > CHUNK_SIZE / 2) {
        chunkText = chunkText.slice(0, lastBoundary + 1);
      }
    }
    
    chunks.push({
      id: uuidv4(),
      text: chunkText.trim(),
      pageNumber,
      chunkIndex: chunkIndex++
    });
    
    start += chunkText.length - CHUNK_OVERLAP;
    if (start < 0) start = 0;
  }
  
  return chunks;
}

export function findExactMatch(chunks: PDFChunk[], query: string): PDFChunk[] {
  const queryLower = query.toLowerCase().trim();
  
  return chunks.filter(chunk => {
    const chunkLower = chunk.text.toLowerCase();
    return chunkLower.includes(queryLower);
  }).sort((a, b) => {
    // Sort by page number first, then chunk index
    if (a.pageNumber !== b.pageNumber) {
      return a.pageNumber - b.pageNumber;
    }
    return a.chunkIndex - b.chunkIndex;
  });
}
