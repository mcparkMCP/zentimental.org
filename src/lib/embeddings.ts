const BATCH_SIZE = 16;

interface EmbeddingResponse {
  data: Array<{ embedding: number[]; index: number }>;
}

export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
  const apiKey = process.env.AZURE_OPENAI_API_KEY!;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION!;
  const deployment = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT!;

  const allEmbeddings: number[][] = new Array(texts.length);

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    const response = await fetch(
      `${endpoint}/openai/deployments/${deployment}/embeddings?api-version=${apiVersion}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({ input: batch }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Embedding API error (${response.status}): ${errorText}`);
    }

    const data: EmbeddingResponse = await response.json();

    for (const item of data.data) {
      allEmbeddings[i + item.index] = item.embedding;
    }
  }

  return allEmbeddings;
}

export async function getQueryEmbedding(text: string): Promise<number[]> {
  const [embedding] = await getEmbeddings([text]);
  return embedding;
}
