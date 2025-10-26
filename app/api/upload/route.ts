import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { processPDF } from '@/lib/pdf-processor';
import { storeDocument } from '@/lib/storage';
import { PDFDocument } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Check file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }
    
    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 50MB' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Process PDF
    const { chunks, totalPages } = await processPDF(buffer, file.name);
    
    // Create document
    const doc: PDFDocument = {
      id: uuidv4(),
      name: file.name,
      chunks,
      totalPages,
      createdAt: new Date()
    };
    
    // Store document
    storeDocument(doc);
    
    return NextResponse.json({
      success: true,
      document: {
        id: doc.id,
        name: doc.name,
        totalPages: doc.totalPages,
        chunksCount: chunks.length
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF file' },
      { status: 500 }
    );
  }
}
