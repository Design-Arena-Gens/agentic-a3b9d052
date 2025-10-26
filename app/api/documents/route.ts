import { NextResponse } from 'next/server';
import { getAllDocuments, deleteDocument } from '@/lib/storage';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const documents = getAllDocuments();
    
    return NextResponse.json({
      success: true,
      documents: documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        totalPages: doc.totalPages,
        chunksCount: doc.chunks.length,
        createdAt: doc.createdAt
      }))
    });
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json(
      { error: 'Failed to get documents' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');
    
    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }
    
    const deleted = deleteDocument(documentId);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
