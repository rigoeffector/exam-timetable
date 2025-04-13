
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode } from "lucide-react";
import { api } from "@/services/api";
import { ExamPermit, ExamTimetable } from "@/types/exam";
import Navbar from "@/components/layout/Navbar";
import PermitGenerationForm from "@/components/digital-permits/PermitGenerationForm";
import PermitDisplayPanel from "@/components/digital-permits/PermitDisplayPanel";
import PermitSearchForm from "@/components/digital-permits/PermitSearchForm";
import PermitLibrary from "@/components/digital-permits/PermitLibrary";

const DigitalPermits = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [timetables, setTimetables] = useState<ExamTimetable[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<string>("");
  const [studentIds, setStudentIds] = useState<string[]>([]);
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
  
  const handleAddStudent = (studentId: string) => {
    setStudentIds([...studentIds, studentId]);
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
                <PermitGenerationForm
                  isLoading={isLoading}
                  isGenerating={isGenerating}
                  timetables={timetables}
                  selectedTimetable={selectedTimetable}
                  studentIds={studentIds}
                  onTimetableChange={setSelectedTimetable}
                  onAddStudent={handleAddStudent}
                  onRemoveStudent={handleRemoveStudent}
                  onGeneratePermits={handleGeneratePermits}
                />
                
                <PermitDisplayPanel permits={permits} />
              </div>
            </TabsContent>
            
            <TabsContent value="view">
              <PermitSearchForm />
              <PermitLibrary permits={permits} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DigitalPermits;
