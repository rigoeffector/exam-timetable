import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/services/api";
import { ExamTimetable } from "@/types/exam";
import Navbar from "@/components/layout/Navbar";
import { formatDate } from "@/utils/dateUtils";

const UploadTimetable = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedTimetable, setUploadedTimetable] = useState<ExamTimetable | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      const validExtensions = ['.xlsx', '.xls', '.csv'];
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: "Please upload an Excel (.xlsx, .xls) or CSV file.",
          variant: "destructive"
        });
        e.target.value = '';
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const timetable = await api.uploadTimetable(file);
      setUploadedTimetable(timetable);
      
      toast({
        title: "Upload successful",
        description: `${file.name} has been processed successfully.`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error processing your file.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-exam-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-exam-primary mb-6">
            Upload Exam Timetable
          </h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Excel or CSV File</CardTitle>
              <CardDescription>
                Import your exam schedule from an Excel or CSV file
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".xlsx,.xls,.csv"
                />
                
                <label 
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-12 w-12 text-exam-primary mb-4" />
                  <span className="text-lg font-medium mb-2">
                    {file ? file.name : "Drag & drop or click to select"}
                  </span>
                  <span className="text-sm text-gray-500 mb-4">
                    Supports Excel (.xlsx, .xls) and CSV files
                  </span>
                  
                  {!file && (
                    <Button 
                      variant="outline" 
                      className="border-exam-primary text-exam-primary hover:bg-exam-primary hover:text-white"
                    >
                      Browse Files
                    </Button>
                  )}
                </label>
                
                {file && (
                  <div className="mt-4 flex items-center justify-center text-sm">
                    <FileSpreadsheet className="h-5 w-5 text-exam-primary mr-2" />
                    <span>{file.name}</span>
                    <Button
                      variant="ghost"
                      className="ml-2 h-8 w-8 p-0 text-red-500"
                      onClick={() => setFile(null)}
                    >
                      <AlertCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="w-full bg-exam-primary hover:bg-exam-accent"
              >
                {isUploading ? "Processing..." : "Upload and Process"}
              </Button>
            </CardFooter>
          </Card>
          
          {uploadedTimetable && (
            <Card>
              <CardHeader className="bg-green-50 border-b">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <CardTitle className="text-green-700">Upload Successful</CardTitle>
                </div>
                <CardDescription>
                  Your timetable has been processed and is ready for use
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Timetable Details</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                      <div className="text-sm font-medium">Name:</div>
                      <div className="text-sm">{uploadedTimetable.name}</div>
                      
                      <div className="text-sm font-medium">Academic Year:</div>
                      <div className="text-sm">{uploadedTimetable.academicYear}</div>
                      
                      <div className="text-sm font-medium">Semester:</div>
                      <div className="text-sm">{uploadedTimetable.semester}</div>
                      
                      <div className="text-sm font-medium">Courses:</div>
                      <div className="text-sm">{uploadedTimetable.courses.length}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Courses</h3>
                    <div className="max-h-60 overflow-y-auto border rounded-md">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Course</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Time</th>
                            <th className="px-4 py-2 text-left">Location</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {uploadedTimetable.courses.map((course) => (
                            <tr key={course.id}>
                              <td className="px-4 py-2">{course.name}</td>
                              <td className="px-4 py-2">
                                {formatDate(course.examDate)} {course.examTime}
                              </td>
                              <td className="px-4 py-2">{course.examLocation || 'TBD'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline">Download</Button>
                <Button 
                  className="bg-exam-primary hover:bg-exam-accent"
                  onClick={() => window.location.href = '/permits'}
                >
                  Generate Permits
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadTimetable;
