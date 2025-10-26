import { NextRequest, NextResponse } from 'next/server';
import { getDocument } from '@/lib/storage';
import { hybridSearch } from '@/lib/embeddings';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { documentId, query } = await request.json();
    
    if (!documentId || !query) {
      return NextResponse.json(
        { error: 'Document ID and query are required' },
        { status: 400 }
      );
    }
    
    // Get document
    const document = getDocument(documentId);
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    
    // Perform search
    const startTime = Date.now();
    const results = await hybridSearch(query, document.chunks, 5);
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      results,
      responseTime,
      documentName: document.name
    });
  } catch (error) {
    console.error('Query error:', error);
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    );
  }
}
