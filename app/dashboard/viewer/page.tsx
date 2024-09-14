'use client';

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FileViewer() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100 p-4 items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Coming Soon</h1>
      <Button onClick={handleGoBack} variant="default" className="flex items-center">
        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
      </Button>
    </div>
  )
}
