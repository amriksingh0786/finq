"use client"
import { Ghost, Loader2, MessageSquare, Plus, TrashIcon } from 'lucide-react';
import React from 'react';
import UploadButton from './UploadButton';
import { trpc } from '@/app/_trpc/client';
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';
import format from 'date-fns/format';
import { Button } from './ui/button';
const Dashboard: React.FC = () => {

    const [currentlyDeletingFile, setCurrentlyDeletingFile] = React.useState<string | null>(null);
    const utils = trpc.useContext();
    const { data: files, isLoading } = trpc.getUserFiles.useQuery();

    const { mutate: deleteFile } = trpc.deleteFile.useMutation({
        onSuccess: () => {
            utils.getUserFiles.invalidate()
        },
        onMutate({ id }) {
            setCurrentlyDeletingFile(id)
        },
        onSettled() {
            setCurrentlyDeletingFile(null)
        }
    });

    return (
        <main className='max-auto max-w-7xl md:p-10'>
            <div className='mt-8 flex items-start justify-between gap-4 border-b broder-gray-200 pb-5  sm:gap-0'>
                <div>
                    <h1 className='mb-3 font-bold text-5xl text-gray-900'>My Files</h1>
                </div>
                <div>
                    <UploadButton />
                </div>
            </div>

            {/** display files */}

            {files && files.length !== 0 ? (
                <ul className='mt-8 grid grid-cols-1 gap-6 divide-y dvide-zinc-200 md:grid-cols-2 lg:grid-cols-3'>
                    {files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((file) => (
                        <li key={file.id}
                            className='col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg'
                        >
                            <Link href={`/dashboard/${file.id}`} className='flex gap-2'>
                                <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                                    <div className="flex-1 truncate">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-zinc-900 text-lg font-medium truncate">{file.name}</h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                                <div className="flex items-center gap-2">
                                    <Plus className='h-4 w-4' />
                                    {format(new Date(file.createdAt), 'MMM yyyy')}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MessageSquare className='h-4 w-4' />
                                    mocked
                                </div>
                                <Button size="sm" className='w-full' variant='destructive'
                                    onClick={() => deleteFile({ id: file.id })}
                                >
                                    {currentlyDeletingFile ? <Loader2 /> : <TrashIcon className='h-4 w-4' />}
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : isLoading ? (
                <Skeleton height={100} className='my-2' count={100} />
            ) : (
                <div className='mt-16 flex flex-col items-center gap-2'>
                    <Ghost className='h-8 w-8 text-zinc-800' />
                    <h3 className='font-semibold text-xl'>Pretty empty around here</h3>
                    <p>Let&apos;s upload your first PDF.</p>
                </div>
            )}
        </main>
    );
};

export default Dashboard;
