import { Download, FileText, BookOpen } from 'lucide-react'
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
  classCode: string;
  publicUrl: string;
  uploadUser: string;
}

export function FileCard({ name, classCode, publicUrl, uploadUser }: FileCardProps) {
  return (
    <TooltipProvider>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-6 h-6 text-indigo-500 mr-2" />
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{name}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is the name of the file that was uploaded.</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardDescription>Class: {classCode}</CardDescription>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is the class code for the class this file was uploaded to.</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardDescription>Uploaded by: {uploadUser}</CardDescription>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is the user's anonymous unique identifier.</p>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
        <Tooltip>
          <TooltipTrigger asChild>
            <CardContent>
              <Button onClick={() => window.open(publicUrl, '_blank')}>
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
              <Link href={`/dashboard/viewer?url=${encodeURIComponent(publicUrl)}`} passHref>
                <Button className='ml-2'>
                  <BookOpen className="h-4 w-4 mr-2" /> View
                </Button>
              </Link>
            </CardContent>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click here to view or download the file.</p>
          </TooltipContent>
        </Tooltip>
      </Card>
    </TooltipProvider>
  );
}