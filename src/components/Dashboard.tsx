"use client"
import { Ghost } from 'lucide-react';
import React from 'react';
import UploadButton from './UploadButton';
import { trpc } from '@/app/_trpc/client';
import Skeleton from 'react-loading-skeleton';
const Dashboard: React.FC = () => {

    const { data : files, isLoading} = trpc.getUserFiles.useQuery();

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
                <div></div>
            ): isLoading ? (
                <Skeleton height={100} className='my-2' count={100} />
            ): (
                <div className='mt-16 flex flex-col items-center gap-2'>
                    <Ghost className='h-8 w-8 text-zinc-800' />
                    <h3 className='font-semibold text-xl'>Pretty empty around here</h3>
                    <p>Let&apos;s upload your first PDF.</p>
                </div>
            ) } 
        </main>
    );
};

export default Dashboard;
