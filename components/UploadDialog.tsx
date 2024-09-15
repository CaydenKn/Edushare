import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';

const classTypes = [
  { value: "math", label: "Math" },
  { value: "science", label: "Science" },
  { value: "english", label: "English" },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "biology", label: "Biology" },
  { value: "computerscience", label: "Computer Science" },
  { value: "art", label: "Art" },
  { value: "music", label: "Music" },
  { value: "physicaleducation", label: "Physical Education" },
  { value: "foreignlanguage", label: "Foreign Language" },
];

interface UploadDialogProps {
  onUpload: (file: File, classCode: string, classType: string, fileName: string) => Promise<void>;
}

export function UploadDialog({ onUpload }: UploadDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [classType, setClassType] = useState('');

  const handleUpload = async () => {
    if (file && classCode && classType && name) {
      await onUpload(file, classCode, classType, name);
      setIsDialogOpen(false);
      setClassCode('');
      setFile(null);
      setClassType('');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-black">Upload Study Material</DialogTitle>
          <DialogDescription>
            Upload study material to share with your classmates
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3   pt-2">
        <div className="grid grid-cols-4 items-center">
            <Input
              id="fileName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-4"
              placeholder='File Name'
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="classCode"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              className="col-span-4"
              placeholder='Class Code'
            />
          </div>
          <div className="grid grid-cols-4 items-center">
            <Select onValueChange={setClassType} value={classType}>
              <SelectTrigger className="col-span-4">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {classTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-0">
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="col-span-4"
            />
          </div>
        </div>
        <Button variant="link" onClick={() => alert("Please do not upload AI generated content or content that you do not have permission to share. You MUST fully own the resource/content you are uploading.")}>Upload Guide</Button>
        <Button onClick={handleUpload}>Upload</Button>
      </DialogContent>
    </Dialog>
  );
}