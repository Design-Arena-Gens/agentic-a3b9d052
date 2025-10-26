export interface PDFChunk {
  id: string;
  text: string;
  pageNumber: number;
  chunkIndex: number;
  embedding?: number[];
}

export interface QueryResult {
  text: string;
  pageNumber: number;
  score: number;
  context: string;
}

export interface PDFDocument {
  id: string;
  name: string;
  chunks: PDFChunk[];
  totalPages: number;
  createdAt: Date;
}
