import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Create Supabase client
const supabase = createClientComponentClient()

export async function fetchFiles(schoolName: string, searchQuery: string = '') {
  try {
    let query = supabase
      .from('files')
      .select('*')
      .eq('school_name', schoolName)
      .order('created_at', { ascending: false })

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching files:', error)
    return []
  }
}

export async function fetchFilesOfType(schoolName: string, searchQuery: string = '', course_type: string) {
  try {
    let query = supabase
      .from('files')
      .select('*')
      .eq('school_name', schoolName)
      .eq('course_type', course_type)
      .order('created_at', { ascending: false })

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching files:', error)
    return []
  }
}

export async function uploadFile(userId: string, file: File, classCode: string, classType: string, fileName: string) {
  try {
    // Fetch user profile to get school name
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('school_name')
      .eq('id', userId)
      .single()

    if (userError) {
      console.error('Error fetching user profile:', userError)
      throw userError
    }

    if (!userData) {
      console.error('No user data found')
      return null
    }

    // Create file path for storage
    const filePath = `${userData.school_name}/${classCode}/${file.name}`

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('study-materials')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Error uploading file to Supabase storage:', uploadError)
      throw uploadError
    }

    // Generate public URL for the uploaded file
    const { data: publicUrlData, error: urlError = null }: { data: { publicUrl: string; }; error?: any } = supabase.storage
      .from('study-materials')
      .getPublicUrl(filePath)

    if (urlError) {
      console.error('Error getting public URL:', urlError)
      throw urlError
    }

    const publicUrl = publicUrlData?.publicUrl

    // Log metadata before insertion
    console.log('Inserting file metadata:', {
      name: file.name,
      path: filePath,
      class_code: classCode,
      user_id: userId,
      school_name: userData.school_name,
      public_url: publicUrl,
    })

    // Insert file metadata into Supabase database
    const { data: fileData, error: insertError } = await supabase
      .from('files')  // Ensure the correct table name for file metadata
      .insert({
        name: fileName,
        path: filePath,
        class_code: classCode,
        user_id: userId,
        school_name: userData.school_name,
        public_url: publicUrl, 
        course_type: classType,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting file metadata into Supabase database:', insertError)
      throw insertError
    }

    return fileData
  } catch (error) {
    console.error('General error during file upload process:', error)
    return null
  }
}
