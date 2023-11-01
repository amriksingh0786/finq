import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { getPineconeClient } from "@/lib/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
const f = createUploadthing();


export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = getUser();

      if (!user || !user.id) {
        throw new Error("User not authenticated");
      }
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const respone = await fetch(
          `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
        );

        const blob = await respone.blob();

        const laoder = new PDFLoader(blob);

        const pageLevelDocs = await laoder.load();

        const pageAmt = pageLevelDocs.length;

        //vecotrize and index entire doc

        const pinecone = await getPineconeClient();
        const pineconeIndex = pinecone.Index('finq')
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        });

        //disable ts for now
        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          // @ts-ignore
          pineconeIndex,
/*           // namespace: createdFile.id,
 */         });

        await db.file.update({
          where: { id: createdFile.id },
          data: {
            uploadStatus: "SUCCESS",
          },
        });
      } catch (err) {
        console.log("ERROR", err);
        await db.file.update({
          where: { id: createdFile.id },
          data: {
            uploadStatus: "FAILED",
          },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
