
import React from "react";
import { QrCode, Download, Printer } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExamPermit } from "@/types/exam";
import { formatDate } from "@/utils/dateUtils";

interface PermitDisplayPanelProps {
  permits: ExamPermit[];
}

const PermitDisplayPanel = ({ permits }: PermitDisplayPanelProps) => {
  if (permits.length === 0) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
        <QrCode className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-500 mb-2">No Permits Generated</h3>
        <p className="text-gray-400">
          Select a timetable, add student IDs, and click "Generate Digital Permits"
          to create QR code permits.
        </p>
      </Card>
    );
  }

  return (
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
                    {formatDate(permit.examDate)} {permit.examTime}
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
  );
};

export default PermitDisplayPanel;
