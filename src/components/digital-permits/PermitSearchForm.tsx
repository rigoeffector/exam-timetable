
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const PermitSearchForm = () => {
  return (
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
  );
};

export default PermitSearchForm;
