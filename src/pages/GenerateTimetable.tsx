
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BrainCircuit, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { ExamTimetable } from "@/types/exam";
import Navbar from "@/components/layout/Navbar";

const GenerateTimetable = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState<ExamTimetable | null>(null);
  
  // Form state
  const [academicYear, setAcademicYear] = useState("2025");
  const [semester, setSemester] = useState("Spring");
  const [examPeriodDays, setExamPeriodDays] = useState(14);
  const [coursesCount, setCoursesCount] = useState(8);
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const timetable = await api.generateTimetable({
        academicYear,
        semester,
        examPeriodDays,
        courses: coursesCount
      });
      
      setGeneratedTimetable(timetable);
      toast({
        title: "Timetable generated",
        description: "AI has successfully created an optimized exam schedule."
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation failed",
        description: "There was an error generating the timetable.",
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
            <BrainCircuit className="h-8 w-8 text-exam-primary mr-3" />
            <h1 className="text-3xl font-bold text-exam-primary">
              AI Exam Schedule Generator
            </h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Let our AI system generate an optimized exam schedule based on your requirements.
            The system will ensure minimal conflicts and optimal spacing between exams.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Generation Parameters</CardTitle>
                <CardDescription>
                  Configure the settings for your AI-generated timetable
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="academic-year">Academic Year</Label>
                  <Input
                    id="academic-year"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select
                    value={semester}
                    onValueChange={setSemester}
                  >
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fall">Fall</SelectItem>
                      <SelectItem value="Spring">Spring</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="exam-period">Exam Period (days)</Label>
                    <span className="text-sm text-gray-500">{examPeriodDays} days</span>
                  </div>
                  <Slider
                    id="exam-period"
                    min={7}
                    max={30}
                    step={1}
                    value={[examPeriodDays]}
                    onValueChange={(value) => setExamPeriodDays(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="courses-count">Number of Courses</Label>
                    <span className="text-sm text-gray-500">{coursesCount} courses</span>
                  </div>
                  <Slider
                    id="courses-count"
                    min={3}
                    max={20}
                    step={1}
                    value={[coursesCount]}
                    onValueChange={(value) => setCoursesCount(value[0])}
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={handleGenerate} 
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
            
            <div>
              {isGenerating ? (
                <Card className="h-full flex flex-col items-center justify-center text-center p-8">
                  <Loader2 className="h-12 w-12 text-exam-primary animate-spin mb-4" />
                  <h3 className="text-xl font-medium mb-2">AI is working...</h3>
                  <p className="text-gray-500">
                    Our AI is creating an optimized exam schedule based on your parameters.
                    This may take a few moments.
                  </p>
                </Card>
              ) : generatedTimetable ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Timetable</CardTitle>
                    <CardDescription>
                      AI-optimized schedule for {generatedTimetable.semester} {generatedTimetable.academicYear}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="max-h-[400px] overflow-y-auto border rounded-md">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left">Course</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Time</th>
                            <th className="px-4 py-2 text-left">Location</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {generatedTimetable.courses.map((course) => (
                            <tr key={course.id}>
                              <td className="px-4 py-2">{course.name}</td>
                              <td className="px-4 py-2">
                                {course.examDate?.toLocaleDateString()}
                              </td>
                              <td className="px-4 py-2">{course.examTime}</td>
                              <td className="px-4 py-2">{course.examLocation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
              ) : (
                <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
                  <BrainCircuit className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-500 mb-2">No Timetable Yet</h3>
                  <p className="text-gray-400">
                    Configure the parameters and click "Generate Timetable" to create an 
                    AI-optimized exam schedule.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateTimetable;
