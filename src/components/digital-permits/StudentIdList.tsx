
import React from "react";
import { Button } from "@/components/ui/button";

interface StudentIdListProps {
  studentIds: string[];
  onRemoveStudent: (id: string) => void;
}

const StudentIdList = ({ studentIds, onRemoveStudent }: StudentIdListProps) => {
  if (studentIds.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No students added yet
      </div>
    );
  }

  return (
    <ul className="divide-y max-h-40 overflow-y-auto">
      {studentIds.map((id) => (
        <li key={id} className="flex justify-between items-center px-4 py-2">
          <span>{id}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveStudent(id)}
          >
            &times;
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default StudentIdList;
