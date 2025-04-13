
import React from "react";
import { QrCode, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExamPermit } from "@/types/exam";
import { formatDate } from "@/utils/dateUtils";

interface PermitLibraryProps {
  permits: ExamPermit[];
}

const PermitLibrary = ({ permits }: PermitLibraryProps) => {
  return (
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
                      {formatDate(permit.examDate)} {permit.examTime}
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
  );
};

export default PermitLibrary;
