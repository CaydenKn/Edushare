'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import DocViewer, { DocViewerRenderers } from "react-doc-viewer"
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Dynamically import react-pdf components
const PDFViewer = dynamic(() => import('../../../components/PDFViewer'), { ssr: false })

export default function FileViewer() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string | null>(null)

  useEffect(() => {
    const url = searchParams.get('url')
    setFileUrl(url)
    if (url) {
      const extension = url.split('.').pop()?.toLowerCase()
      setFileType(extension || null)
    }
  }, [searchParams])

  const handleGoBack = () => {
    router.back()
  }

  if (!fileUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-700 mb-4">No file URL provided</p>
        <Button onClick={handleGoBack} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  const renderFilePreview = () => {
    switch (fileType) {
      case 'pdf':
        return <PDFViewer fileUrl={fileUrl} />
      case 'doc':
      case 'docx':
      case 'xls':
      case 'xlsx':
      case 'ppt':
      case 'pptx':
        return (
          <DocViewer
            documents={[{ uri: fileUrl }]}
            pluginRenderers={DocViewerRenderers}
            className='w-full h-full'
          />
        )
      case 'txt':
        return <iframe src={fileUrl} className="w-full h-full border-none" title="Text file preview" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <img src={fileUrl} alt="File preview" className="max-w-full max-h-full object-contain" />
      default:
        return <div className="text-center text-gray-700">Unsupported file type</div>
    }
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100 p-4">
      <div className="mb-4">
        <Button onClick={handleGoBack} variant="default" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
      <div className="flex-grow w-full bg-white shadow-lg rounded-lg overflow-hidden">
        {renderFilePreview()}
      </div>
    </div>
  )
}