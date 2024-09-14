import React from 'react';
import { Download, FileText, BookOpen, ArrowDown, ArrowUp, File } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface FileCardProps {
  name: string;
  path: string;
  classCode: string;
  publicUrl: string;
  uploadUser: string;
  rep: number;
}

export function FileCard({ name, classCode, publicUrl, uploadUser, rep, path }: FileCardProps) {
  const fileExtension = path.split('.').pop()?.toLowerCase();

  const renderPreview = () => {
    switch (fileExtension) {
      case 'pdf':
        return (
          <iframe 
            src={`${publicUrl}#view=FitH`} 
            className="w-full h-48 border-none"
            title={name}
          />
        );
      case 'docx':
        return (
          <iframe 
            src={`https://docs.google.com/gview?url=${encodeURIComponent(publicUrl)}&embedded=true`}
            className="w-full h-48 border-none"
            title={name}
          />
        );
      case 'txt':
        return <TextFilePreview url={publicUrl} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <img 
            src={publicUrl} 
            alt={name} 
            className="w-full h-48 object-contain"
          />
        );
      default:
        return (
          <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-100">
            <File className="w-16 h-16 text-gray-400" />
            <p className="mt-2 text-gray-500">Preview not available</p>
          </div>
        );
    }
  };

  return (
    <TooltipProvider>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <FileText className="w-5 h-5 text-indigo-500 mr-2" />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate">{name}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{name}</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <CardDescription>
            <div>Class: {classCode}</div>
            <div>Uploaded by: {uploadUser}</div>
            <div>Rating: {rep}</div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            {renderPreview()}
          </div>
          <div className='flex justify-center space-x-2'>
            <Button onClick={() => window.open(publicUrl, '_blank')} size="sm">
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
            <Link href={`/dashboard/viewer?url=${encodeURIComponent(publicUrl)}`} passHref>
              <Button size="sm">
                <BookOpen className="h-4 w-4 mr-2" /> View
              </Button>
            </Link>
            <Button variant='outline' size="sm">
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button variant='outline' size="sm">
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

// Helper component for text file preview
function TextFilePreview({ url }: { url: string }) {
  const [content, setContent] = React.useState<string>('Loading...');

  React.useEffect(() => {
    fetch(url)
      .then(response => response.text())
      .then(text => setContent(text.slice(0, 500) + (text.length > 500 ? '...' : '')))
      .catch(() => setContent('Failed to load file content'));
  }, [url]);

  return (
    <div className="w-full h-48 p-2 bg-gray-100 overflow-auto">
      <pre className="text-sm">{content}</pre>
    </div>
  );
}