
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PermitSearchFormProps {
  onSearch: (studentId: string, courseQuery: string) => Promise<void>;
  isSearching: boolean;
}

const PermitSearchForm = ({ onSearch, isSearching }: PermitSearchFormProps) => {
  const [studentId, setStudentId] = useState("");
  const [courseQuery, setCourseQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(studentId, courseQuery);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Search Permits</CardTitle>
        <CardDescription>
          Look up permits by student ID or course
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1">
              <Label htmlFor="student-search" className="mb-2 block">Student ID</Label>
              <Input 
                id="student-search" 
                placeholder="Enter student ID" 
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={isSearching}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="course-search" className="mb-2 block">Course</Label>
              <Input 
                id="course-search" 
                placeholder="Enter course name or ID" 
                value={courseQuery}
                onChange={(e) => setCourseQuery(e.target.value)}
                disabled={isSearching}
              />
            </div>
            <div className="flex items-end">
              <Button 
                type="submit"
                className="bg-exam-primary hover:bg-exam-accent w-full md:w-auto"
                disabled={isSearching || (!studentId && !courseQuery)}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PermitSearchForm;
