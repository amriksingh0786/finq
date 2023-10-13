"use client"

import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import Dropzone from "react-dropzone";
import { Cloud, File } from "lucide-react";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadThing";
import { useToast } from "./ui/use-toast";
import { ro } from "date-fns/locale";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation"
const UploadDropZone = () => {
    const [isUploading, setIsUploading] = useState(true);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { startUpload } = useUploadThing("pdfUploader");
    const { toast } = useToast();
    const router = useRouter()
    const { mutate: startPolling } = trpc.getFile.useMutation({
        onSuccess: (file) => {
            console.log(file.id)
            router.push(`/dashboard/${file.id}`)
        },
        retry: true,
        retryDelay: 500
    })
    const startSimulatedProgress = () => {
        setIsUploading(true);
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 95) {
                    clearInterval(interval);
                    setIsUploading(false);
                    return prev;
                }
                return prev + 5;
            });
        }, 500);
        return interval;
    };
    return (
        <Dropzone
            multiple={false}
            onDrop={async (acceptedFile) => {
                const progressInterval = startSimulatedProgress();

                //  handle file upload here
                const res = await startUpload(acceptedFile);

                if (!res) {
                    return toast({
                        title: 'Something went wrong',
                        description: 'Please try again',
                        variant: 'destructive'
                    })
                }

                const [fileResponse] = res;

                const key = fileResponse.key;

                if (!key) {
                    return toast({
                        title: 'Something went wrong',
                        description: 'Please try again',
                        variant: 'destructive'
                    })
                }

                clearInterval(progressInterval);
                setUploadProgress(100);
                startPolling({ key })
            }}>
            {({ getRootProps, getInputProps, acceptedFiles }) => (
                <div {...getRootProps()}
                    className="border h-64 m-4 border-dashed border-gray-400 rounded-lg"
                >
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <label htmlFor="dropzone-file" className="flex items-center flex-col justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                                <p className="mb-2 text-sm text-zinc-700"><span className="font-semibold">Click to upload</span> {' '}or drag and drop</p>
                                <p className="text-xs text-zinc-500">PDF (up to 4MB)</p>
                            </div>
                            {acceptedFiles && acceptedFiles[0] ? (
                                < div
                                    className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200"
                                >
                                    <div className="px-3 py-2 grid h-full place-items-center">
                                        <File className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="px-3 py-2 h-full text-sm truncate">
                                        <p className="text-sm font-medium text-zinc-700">{acceptedFiles[0].name}</p>
                                        <p className="text-xs text-zinc-500">{acceptedFiles[0].size} bytes</p>
                                    </div>
                                </div>) : null}
                            {isUploading ? (
                                <div className="w-full mt-4 max-w-xs mx-auto">
                                    <Progress value={uploadProgress} className="h-1 w-full bg-zinc-200" />
                                </div>
                            ) : null}

                            <input {...getInputProps()} type="file" id="dropzone-file" className="hidden" />

                        </label>
                    </div>
                </div>
            )}
        </Dropzone>)
}
const UploadButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={(v) => {
            if (!v) setIsOpen(v)
        }}>
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button>Upload PDF</Button>
            </DialogTrigger>

            <DialogContent>
                <UploadDropZone />
            </DialogContent>
        </Dialog>
    );
}

export default UploadButton;