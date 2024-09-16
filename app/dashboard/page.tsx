'use client';

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, LogOut, Filter, Cog, Cross, CrossIcon, X } from 'lucide-react'
import { UploadDialog } from '@/components/UploadDialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchFiles, fetchFilesOfType, uploadFile } from '@/lib/database'
import { FileCard } from '@/components/FileCard'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Cross1Icon, Cross2Icon, CrossCircledIcon } from '@radix-ui/react-icons';
import { Skeleton } from '@/components/ui/skeleton';

interface ClassType {
  value: string;
  label: string;
  icon: string;
}

const classTypes: ClassType[] = [
  { value: "math", label: "Math", icon: "📐" },
  { value: "science", label: "Science", icon: "🔬" },
  { value: "english", label: "English", icon: "📚" },
  { value: "history", label: "History", icon: "🏛️" },
  { value: "geography", label: "Geography", icon: "🌍" },
  { value: "physics", label: "Physics", icon: "⚛️" },
  { value: "chemistry", label: "Chemistry", icon: "🧪" },
  { value: "biology", label: "Biology", icon: "🧬" },
  { value: "computerscience", label: "Computer Science", icon: "💻" },
  { value: "art", label: "Art", icon: "🎨" },
  { value: "music", label: "Music", icon: "🎵" },
  { value: "foreignlanguage", label: "Foreign Language", icon: "🌐" },
];

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [classCodeSearch, setClassCodeSearch] = useState('')
  const [files, setFiles] = useState<any[]>([])
  const [selectedClassType, setSelectedClassType] = useState<string | null>(null)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [filterClassCode, setFilterClassCode] = useState('')
  const [filterFileName, setFilterFileName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => { 
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !user.id) {
        console.error('User not properly authenticated');
        router.push('/');
        return;
      }
      setUser(user)
      
      let { data: profileData, error } = await supabase
        .from('profiles')
        .select('school_name')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        router.push('/');
        return;
      }

      if (!profileData) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ id: user.id, school_name: 'default_school' })
          .select('school_name')
          .single()

        if (insertError) {
          console.error('Error creating user profile:', insertError);
          router.push('/');
          return;
        }

        profileData = newProfile
      }

      if (profileData) {
        setSchoolName(profileData.school_name);
        setIsLoading(true);
        const fetchedFiles = await fetchFiles(profileData.school_name);
        setFiles(fetchedFiles);
        setIsLoading(false);
      } else {
        console.error('Failed to fetch or create profile');
        router.push('/');
      }
    }
    getUser()
  }, [supabase, router])

  useEffect(() => {
    const fetchFilesForClassType = async () => {
      if (schoolName && selectedClassType) {
        setIsLoading(true);
        const fetchedFiles = await fetchFilesOfType(schoolName, '', selectedClassType);
        setFiles(fetchedFiles);
        setIsLoading(false);
      }
    }
    fetchFilesForClassType();
  }, [selectedClassType, schoolName]);    

  const FileCardSkeleton = () => (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );

  const handleSearch = async () => {
    if (schoolName) {
      setIsLoading(true);
      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      let searchedFiles;
      if (selectedClassType) {
        searchedFiles = await fetchFilesOfType(schoolName, classCodeSearch, selectedClassType);
      } else {
        searchedFiles = await fetchFiles(schoolName, classCodeSearch);
      }
      setFiles(searchedFiles);
      setIsLoading(false);
    }
  }

  const handleFileUpload = async (file: File, classCode: string, classType: string, fileName: string) => {
    if (user) {
      setIsLoading(true);
      const newFile = await uploadFile(user.id, file, classCode, classType, fileName)
      if (newFile) {
        setFiles(prevFiles => [newFile, ...prevFiles])
      }
      setIsLoading(false);
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleClassTypeClick = async (classType: string) => {
    setSelectedClassType(classType)
    setClassCodeSearch('')
    setFilterClassCode('')
    setFilterFileName('')
    setIsLoading(true);
    if (schoolName) {
      const fetchedFiles = await fetchFilesOfType(schoolName, '', classType)
      setFiles(fetchedFiles)
      console.log(schoolName);
    }
    setIsLoading(false);
  }

  const handleFilter = async () => {
    if (schoolName) {
      setIsLoading(true);
      let query = supabase
        .from('files')
        .select('*')
        .eq('school_name', schoolName)
        .order('created_at', { ascending: false })

      if (selectedClassType) {
        query = query.eq('course_type', selectedClassType)
      }

      if (filterClassCode) {
        query = query.ilike('class_code', `%${filterClassCode}%`)
      }
      if (filterFileName) {
        query = query.ilike('name', `%${filterFileName}%`)
      }

      const { data, error } = await query
      if (error) {
        console.error('Error fetching files:', error)
        return
      }
      setFiles(data)
      setIsLoading(false);
    }
    setIsFilterDialogOpen(false)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <header className="bg-white shadow-md p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600">EduShare</h1>
          <div className="flex items-center space-x-4">
            {/* <p className="text-gray-600">Welcome, {user.email}</p> */}
            <Button variant="default" size="sm" className="flex items-center">
              <Cog className="w-4 h-4 mr-1" /> Settings
            </Button>
            <Button onClick={handleSignOut} variant="destructive" size="sm" className="flex items-center">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto mt-12 p-6">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <div className="flex gap-4 mb-8">
            {selectedClassType && (
              <Button 
                variant="ghost" 
                onClick={() => setSelectedClassType(null)} 
                className="text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5 mr-2" />
                Back
              </Button>
            )}
            <div className="flex-grow relative">
              <Input
                type="text"
                placeholder="Search by class code..."
                value={classCodeSearch}
                onChange={(e) => setClassCodeSearch(e.target.value)}
                className="pr-10 text-black"
              />
              <Button 
                onClick={handleSearch} 
                disabled={!classCodeSearch}
                variant={"default"}
                className="absolute right-0 top-1/2 transform -translate-y-1/2"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default"><Filter className="w-5 h-5 mr-1" /> Filter</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-indigo-600">Filter Files</DialogTitle>
                  <DialogDescription>Refine your search by class code or file name</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <label htmlFor="filterClassCode" className="text-sm font-medium text-gray-700">Class Code</label>
                    <Input
                      id="filterClassCode"
                      value={filterClassCode}
                      onChange={(e) => setFilterClassCode(e.target.value)}
                      className="text-black"
                      placeholder="Enter class code..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="filterFileName" className="text-sm font-medium text-gray-700">File Name</label>
                    <Input
                      id="filterFileName"
                      value={filterFileName}
                      onChange={(e) => setFilterFileName(e.target.value)}
                      className="text-black"
                      placeholder="Enter file name..."
                    />
                  </div>
                </div>
                <Button onClick={handleFilter} className="w-full">Apply Filter</Button>
              </DialogContent>
            </Dialog>
            <UploadDialog onUpload={handleFileUpload} />
          </div>
          
          {selectedClassType ? (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-indigo-600">
                {classTypes.find(t => t.value === selectedClassType)?.icon} {' '}
                {classTypes.find(t => t.value === selectedClassType)?.label}
              </h2>
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, index) => (
                    <FileCardSkeleton key={index} />
                  ))}
                </div>
              ) : files.length === 0 ? (
                <p className="text-gray-600 text-center py-12">No files found. Start by uploading a file!</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {files.map((file) => (
                    <FileCard
                      key={file.id} 
                      name={file.name}
                      classCode={file.class_code}
                      publicUrl={file.public_url}
                      uploadUser={file.user_id.slice(0, 8)}
                      rep={file.rating} // rating on the file, not the user
                      path={file.path}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {classTypes.map((classType) => (
                <Card 
                  key={classType.value} 
                  onClick={() => handleClassTypeClick(classType.value)} 
                  className="cursor-pointer hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
                >
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                      <span className="text-3xl mr-2">{classType.icon}</span>
                      {classType.label}
                    </CardTitle>
                    <CardDescription>Explore {classType.label.toLowerCase()} resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">View Files</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}