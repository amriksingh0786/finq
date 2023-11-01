import { AppRouter } from "@/trpc";
import { inferRouterOutputs } from "@trpc/server";

//using trpc to get message type
type RouterOutput = inferRouterOutputs<AppRouter>;

type Messages = RouterOutput['getFileMessages']['messages']

type OmitText = Omit<Messages[number], 'text'>

type ExtendedText ={
    text: string| JSX.Element
}

export type ExtendedMessage = OmitText & ExtendedText