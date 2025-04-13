
export interface Student {
  id: string;
  name: string;
  email: string;
  courseIds: string[];
}

export interface Course {
  id: string;
  name: string;
  examDate?: Date | string; // Allow both Date objects and ISO strings
  examTime?: string;
  examLocation?: string;
  duration: number; // in minutes
}

export interface ExamTimetable {
  id: string;
  name: string;
  semester: string;
  academicYear: string;
  courses: Course[];
  createdAt: Date | string; // Allow both Date objects and ISO strings
  lastModified: Date | string; // Allow both Date objects and ISO strings
}

export interface ExamPermit {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  examDate: Date | string; // Allow both Date objects and ISO strings
  examTime: string;
  examLocation: string;
  qrCodeData: string;
  isValid: boolean;
}
