
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ExamTimetable } from "@/types/exam";
import StudentIdList from "./StudentIdList";

interface PermitGenerationFormProps {
  isLoading: boolean;
  isGenerating: boolean;
  timetables: ExamTimetable[];
  selectedTimetable: string;
  studentIds: string[];
  onTimetableChange: (timetableId: string) => void;
  onAddStudent: (studentId: string) => void;
  onRemoveStudent: (studentId: string) => void;
  onGeneratePermits: () => void;
}

const PermitGenerationForm = ({
  isLoading,
  isGenerating,
  timetables,
  selectedTimetable,
  studentIds,
  onTimetableChange,
  onAddStudent,
  onRemoveStudent,
  onGeneratePermits
}: PermitGenerationFormProps) => {
  const { toast } = useToast();
  const [newStudentId, setNewStudentId] = useState("");

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
    
    onAddStudent(newStudentId);
    setNewStudentId("");
  };

  return (
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
                onChange={(e) => onTimetableChange(e.target.value)}
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
                <StudentIdList 
                  studentIds={studentIds} 
                  onRemoveStudent={onRemoveStudent} 
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={onGeneratePermits} 
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
  );
};

export default PermitGenerationForm;
