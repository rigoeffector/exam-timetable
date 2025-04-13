import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CalendarIcon, CheckCircle, XCircle, Loader2, BrainCircuit } from "lucide-react";
import { api } from "@/services/api";
import { ExamTimetable, Course } from "@/types/exam";
import Navbar from "@/components/layout/Navbar";
import { formatDate } from "@/utils/dateUtils";

const GenerateTimetable = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState<ExamTimetable | null>(null);
  
  const [semester, setSemester] = useState("Fall");
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());
  const [numCourses, setNumCourses] = useState(5);
  const [totalDuration, setTotalDuration] = useState([300]);
  const [locationDiversity, setLocationDiversity] = useState([50]);
  const [timeDiversity, setTimeDiversity] = useState([50]);
  
  const handleGenerateTimetable = async () => {
    setIsGenerating(true);
    
    try {
      const parameters = {
        semester,
        academicYear,
        numCourses,
        totalDuration: totalDuration[0],
        locationDiversity: locationDiversity[0] / 100,
        timeDiversity: timeDiversity[0] / 100,
      };
      
      const timetable = await api.generateTimetable(parameters);
      setGeneratedTimetable(timetable);
      
      toast({
        title: "Timetable Generated",
        description: "New timetable has been generated successfully!",
        duration: 5000,
      });
    } catch (error: any) {
      console.error("Error generating timetable:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate timetable",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-exam-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <BrainCircuit className="h-8 w-8 text-exam-primary mr-3" />
            <h1 className="text-3xl font-bold text-exam-primary">
              AI Timetable Generator
            </h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Customize the parameters below to generate an optimized exam timetable using AI.
            Adjust the settings to fit your institution's specific needs and preferences.
          </p>
          
          <div className="grid grid-cols-1 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Generation Parameters</CardTitle>
                <CardDescription>
                  Configure the settings to tailor the exam timetable generation
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select value={semester} onValueChange={setSemester}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fall">Fall</SelectItem>
                        <SelectItem value="Spring">Spring</SelectItem>
                        <SelectItem value="Summer">Summer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="academic-year">Academic Year</Label>
                    <Input
                      id="academic-year"
                      placeholder="Enter year"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="num-courses">Number of Courses</Label>
                  <Input
                    id="num-courses"
                    type="number"
                    placeholder="Enter number of courses"
                    value={numCourses}
                    onChange={(e) => setNumCourses(parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="total-duration">Total Exam Duration (minutes)</Label>
                  <Slider
                    id="total-duration"
                    defaultValue={totalDuration}
                    max={720}
                    step={30}
                    onValueChange={setTotalDuration}
                  />
                  <p className="text-sm text-gray-500">
                    Selected Duration: {totalDuration[0]} minutes
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location-diversity">Location Diversity (%)</Label>
                    <Slider
                      id="location-diversity"
                      defaultValue={locationDiversity}
                      max={100}
                      step={10}
                      onValueChange={setLocationDiversity}
                    />
                    <p className="text-sm text-gray-500">
                      Selected Diversity: {locationDiversity[0]}%
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time-diversity">Time Diversity (%)</Label>
                    <Slider
                      id="time-diversity"
                      defaultValue={timeDiversity}
                      max={100}
                      step={10}
                      onValueChange={setTimeDiversity}
                    />
                    <p className="text-sm text-gray-500">
                      Selected Diversity: {timeDiversity[0]}%
                    </p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  onClick={handleGenerateTimetable}
                  disabled={isGenerating}
                  className="w-full bg-exam-primary hover:bg-exam-accent"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Timetable"
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {generatedTimetable && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Timetable</CardTitle>
                  <CardDescription>
                    Review the generated timetable details below
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                          </th>
                        </tr>
                      </thead>
                      
                      <tbody className="bg-white divide-y divide-gray-200">
                        {generatedTimetable.courses.map((course) => (
                          <tr key={course.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{course.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatDate(course.examDate)} {course.examTime}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{course.examLocation}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{course.duration} minutes</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                
                <CardFooter className="justify-end">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Timetable
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateTimetable;

import { Download } from "lucide-react";
