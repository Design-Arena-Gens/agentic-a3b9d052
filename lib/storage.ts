import { PDFDocument, PDFChunk } from './types';

// In-memory storage (for serverless, this resets on cold start)
// In production, you'd use a database like Redis, MongoDB, or Vector DB
const documents = new Map<string, PDFDocument>();

export function storeDocument(doc: PDFDocument): void {
  documents.set(doc.id, doc);
}

export function getDocument(id: string): PDFDocument | undefined {
  return documents.get(id);
}

export function getAllDocuments(): PDFDocument[] {
  return Array.from(documents.values());
}

export function deleteDocument(id: string): boolean {
  return documents.delete(id);
}

export function clearAllDocuments(): void {
  documents.clear();
}
