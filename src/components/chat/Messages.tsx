import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { Loader, Loader2, MessageSquare } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Message from "./Message";
import { useContext } from "react";
import { ChatContext } from "./ChatContext";

interface MessagesProps {
    fileId: string;
}

const Messages = ({ fileId }: MessagesProps) => {

    const {isLoading : isAiTHinking} = useContext(ChatContext)

    const { data, isLoading, fetchNextPage } = trpc.getFileMessages.useInfiniteQuery({
        fileId,
        limit: INFINITE_QUERY_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
    })
    const messages = data?.pages.flatMap((page) => page.messages) ?? [];
    const loadingMessage = {
        id: 'loading-message',
        createdAt: new Date().toISOString(),
        text: (
            <span className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin h-4 w-4" />
            </span>
        ),
        isUserMessage: false,
    }
    const combinedMessages = [...(isAiTHinking ? [loadingMessage] : []), ...(messages ?? [])]
    return (
        <div className="flex max-h-[clac(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
            {
                combinedMessages && combinedMessages.length > 0 ? (
                    combinedMessages.map((message, i) => {
                        const isNextMessageSamePerson = combinedMessages[i - 1]?.isUserMessage === message.isUserMessage;
                        if (i === combinedMessages.length - 1) {
                            return <Message
                                message={message}
                                key={message.id}
                                isNextMessageSamePerson={isNextMessageSamePerson}
                            />
                        }
                        else return <Message
                            message={message}
                            key={message.id}
                            isNextMessageSamePerson={isNextMessageSamePerson}
                        />
                    }
                    )
                ) : isLoading ? (<div className="w-full flex flex-col gap-2">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                </div>) : <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <MessageSquare className="h-12 w-12 text-blue-500" />
                    <h3 className="font-semibold text-xl">
                        You&apos;re all set!
                    </h3>
                    <p className="text-zinc-500 text-sm">
                        Ask your first question to get started.
                    </p>
                </div>
                
                }
        </div>
    )

};

export default Messages;