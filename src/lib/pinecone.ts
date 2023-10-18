import { Pinecone } from "@pinecone-database/pinecone";

export const pineconeIndex = async () => {
  const pineconeInstance = new Pinecone() as any;
  await pineconeInstance.init({
    environment: "gcp-starter",
    apiKey: process.env.PINECONE_API_KEY,
  });

  return pineconeInstance.Index("finq");
};
