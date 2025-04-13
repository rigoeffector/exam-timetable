import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Download, Printer, UserPlus, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { ExamPermit, ExamTimetable } from "@/types/exam";
import Navbar from "@/components/layout/Navbar";
import { ensureDate } from "@/utils/dateUtils";

const DigitalPermits = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [timetables, setTimetables] = useState<ExamTimetable[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<string>("");
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [newStudentId, setNewStudentId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [permits, setPermits] = useState<ExamPermit[]>([]);
  
  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const fetchedTimetables = await api.getAllTimetables();
        setTimetables(fetchedTimetables);
        if (fetchedTimetables.length > 0) {
          setSelectedTimetable(fetchedTimetables[0].id);
        }
      } catch (error) {
        console.error("Error fetching timetables:", error);
        toast({
          title: "Error",
          description: "Failed to load timetables",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTimetables();
  }, [toast]);
  
  const handleAddStudent = () => {
    if (!newStudentId.trim()) {
      toast({
        title: "Error",
        description: "Student ID cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (studentIds.includes(newStudentId)) {
      toast({
        title: "Duplicate ID",
        description: "This student ID is already in the list",
        variant: "destructive"
      });
      return;
    }
    
    setStudentIds([...studentIds, newStudentId]);
    setNewStudentId("");
  };
  
  const handleRemoveStudent = (idToRemove: string) => {
    setStudentIds(studentIds.filter(id => id !== idToRemove));
  };
  
  const handleGeneratePermits = async () => {
    if (!selectedTimetable) {
      toast({
        title: "No timetable selected",
        description: "Please select a timetable first",
        variant: "destructive"
      });
      return;
    }
    
    if (studentIds.length === 0) {
      toast({
        title: "No students added",
        description: "Please add at least one student ID",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const generatedPermits = await api.generatePermits(selectedTimetable, studentIds);
      setPermits(generatedPermits);
      
      toast({
        title: "Permits generated",
        description: `Successfully generated ${generatedPermits.length} exam permits`
      });
    } catch (error) {
      console.error("Error generating permits:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate exam permits",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-exam-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <QrCode className="h-8 w-8 text-exam-primary mr-3" />
            <h1 className="text-3xl font-bold text-exam-primary">
              Digital Exam Permits
            </h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Generate digital exam permits with QR codes that can be verified at exam venues.
            These permits ensure only eligible students can participate in exams.
          </p>
          
          <Tabs defaultValue="generate">
            <TabsList className="mb-6">
              <TabsTrigger value="generate">Generate Permits</TabsTrigger>
              <TabsTrigger value="view">View Permits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Permit Generation</CardTitle>
                    <CardDescription>
                      Select a timetable and add students to generate permits
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-exam-primary" />
                      </div>
                    ) : timetables.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No timetables available</p>
                        <Button 
                          onClick={() => window.location.href = '/upload'}
                          variant="outline"
                        >
                          Upload Timetable
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="timetable">Select Timetable</Label>
                          <select
                            id="timetable"
                            value={selectedTimetable}
                            onChange={(e) => setSelectedTimetable(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            {timetables.map((timetable) => (
                              <option key={timetable.id} value={timetable.id}>
                                {timetable.name} - {timetable.semester} {timetable.academicYear}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Student IDs</Label>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter student ID"
                              value={newStudentId}
                              onChange={(e) => setNewStudentId(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddStudent()}
                            />
                            <Button
                              onClick={handleAddStudent}
                              variant="outline"
                              className="shrink-0"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="border rounded-md mt-2">
                            {studentIds.length === 0 ? (
                              <div className="p-4 text-center text-gray-500">
                                No students added yet
                              </div>
                            ) : (
                              <ul className="divide-y max-h-40 overflow-y-auto">
                                {studentIds.map((id) => (
                                  <li key={id} className="flex justify-between items-center px-4 py-2">
                                    <span>{id}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveStudent(id)}
                                    >
                                      &times;
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      onClick={handleGeneratePermits} 
                      disabled={isLoading || isGenerating || studentIds.length === 0 || !selectedTimetable}
                      className="w-full bg-exam-primary hover:bg-exam-accent"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Digital Permits"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                
                <div>
                  {permits.length > 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Generated Permits</CardTitle>
                        <CardDescription>
                          {permits.length} permits have been generated
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="max-h-[400px] overflow-y-auto border rounded-md">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 sticky top-0">
                              <tr>
                                <th className="px-4 py-2 text-left">Student</th>
                                <th className="px-4 py-2 text-left">Course</th>
                                <th className="px-4 py-2 text-left">Date & Time</th>
                                <th className="px-4 py-2 text-left">QR Code</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {permits.map((permit) => (
                                <tr key={permit.id}>
                                  <td className="px-4 py-2">{permit.studentName}</td>
                                  <td className="px-4 py-2">{permit.courseName}</td>
                                  <td className="px-4 py-2">
                                    {ensureDate(permit.examDate).toLocaleDateString()} {permit.examTime}
                                  </td>
                                  <td className="px-4 py-2">
                                    <QrCode className="h-6 w-6 text-exam-primary" />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" className="flex items-center">
                          <Download className="mr-2 h-4 w-4" />
                          Download All
                        </Button>
                        <Button variant="outline" className="flex items-center">
                          <Printer className="mr-2 h-4 w-4" />
                          Print All
                        </Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
                      <QrCode className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-xl font-medium text-gray-500 mb-2">No Permits Generated</h3>
                      <p className="text-gray-400">
                        Select a timetable, add student IDs, and click "Generate Digital Permits"
                        to create QR code permits.
                      </p>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="view">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Search Permits</CardTitle>
                  <CardDescription>
                    Look up permits by student ID or course
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="student-search" className="mb-2 block">Student ID</Label>
                      <Input id="student-search" placeholder="Enter student ID" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="course-search" className="mb-2 block">Course</Label>
                      <Input id="course-search" placeholder="Enter course name or ID" />
                    </div>
                    <div className="flex items-end">
                      <Button className="bg-exam-primary hover:bg-exam-accent">Search</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Permit Library</CardTitle>
                  <CardDescription>All generated permits in the system</CardDescription>
                </CardHeader>
                
                <CardContent>
                  {permits.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Student</th>
                            <th className="px-4 py-2 text-left">Course</th>
                            <th className="px-4 py-2 text-left">Date & Time</th>
                            <th className="px-4 py-2 text-left">Location</th>
                            <th className="px-4 py-2 text-left">Valid</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {permits.map((permit) => (
                            <tr key={permit.id}>
                              <td className="px-4 py-2">{permit.studentName}</td>
                              <td className="px-4 py-2">{permit.courseName}</td>
                              <td className="px-4 py-2">
                                {ensureDate(permit.examDate).toLocaleDateString()} {permit.examTime}
                              </td>
                              <td className="px-4 py-2">{permit.examLocation}</td>
                              <td className="px-4 py-2">
                                {permit.isValid ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                    Valid
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                    Invalid
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2">
                                <Button variant="ghost" size="sm">
                                  <QrCode className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No permits have been generated yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DigitalPermits;
