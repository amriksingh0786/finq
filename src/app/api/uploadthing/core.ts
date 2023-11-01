import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { getPineconeClient } from "@/lib/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
const f = createUploadthing();

const middleware = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) {
    throw new Error("User not authenticated");
  }

  const subscriptionPlan = await getUserSubscriptionPlan();
  return { subscriptionPlan, userId: user.id };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  const isFileAlreadyUploaded = await db.file.findFirst({
    where: {
      key: file.key,
    },
  });
  if (isFileAlreadyUploaded) return;
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

    const { subscriptionPlan } = metadata;
    const { isSubscribed } = subscriptionPlan;

    const isProExceeded =
      pageAmt > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPdf;
    const isFreeExceeded =
      pageAmt > PLANS.find((plan) => plan.name === "Free")!.pagesPerPdf;

    if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      await db.file.update({
        data: {
          uploadStatus: "FAILED",
        },
        where: {
          id: createdFile.id,
        },
      });
    }
    //vecotrize and index entire doc

    const pinecone = await getPineconeClient();
    const pineconeIndex = pinecone.Index("finq");
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    //disable ts for now
    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      // @ts-ignore
      pineconeIndex,
      /*           // namespace: createdFile.id,
       */
    });

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
};
export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),

  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
