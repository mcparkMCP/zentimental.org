export interface KBDocument {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  chunkCount: number;
  uploadedAt: number;
}

export interface KBChunk {
  id: string;
  documentId: string;
  content: string;
  index: number;
  embedding: number[];
}

export interface KBSearchResult {
  chunk: KBChunk;
  score: number;
  documentFilename: string;
}

export interface KnowledgeBase {
  documents: KBDocument[];
  chunks: KBChunk[];
}
