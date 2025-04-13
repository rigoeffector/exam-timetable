
import { ExamTimetable, Course, Student, ExamPermit } from "@/types/exam";

// This is a frontend mock service that simulates API calls to a Spring Boot backend
// In a real application, these would make actual HTTP requests

// Mock data storage
let timetables: ExamTimetable[] = [];
let students: Student[] = [];
let permits: ExamPermit[] = [];

// Simulate API endpoints
export const api = {
  // Timetable endpoints
  uploadTimetable: async (file: File): Promise<ExamTimetable> => {
    // In a real app, this would send the file to Spring Boot
    console.log("Uploading file:", file.name);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate parsing the file and returning a timetable
        const newTimetable: ExamTimetable = {
          id: Date.now().toString(),
          name: file.name.replace(/\.\w+$/, ''),
          semester: "Spring",
          academicYear: "2025",
          courses: generateMockCourses(5),
          createdAt: new Date(),
          lastModified: new Date()
        };
        
        timetables.push(newTimetable);
        resolve(newTimetable);
      }, 1500);
    });
  },
  
  getAllTimetables: async (): Promise<ExamTimetable[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...timetables]), 500);
    });
  },
  
  // AI/ML Generation endpoints
  generateTimetable: async (parameters: any): Promise<ExamTimetable> => {
    console.log("Generating timetable with parameters:", parameters);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTimetable: ExamTimetable = {
          id: Date.now().toString(),
          name: `AI Generated Timetable - ${new Date().toLocaleDateString()}`,
          semester: parameters.semester || "Fall",
          academicYear: parameters.academicYear || "2025",
          courses: generateOptimizedCourses(parameters.courses || 8),
          createdAt: new Date(),
          lastModified: new Date()
        };
        
        timetables.push(newTimetable);
        resolve(newTimetable);
      }, 3000);
    });
  },
  
  // QR and Permit endpoints
  generatePermits: async (timetableId: string, studentIds: string[]): Promise<ExamPermit[]> => {
    console.log("Generating permits for timetable:", timetableId, "students:", studentIds);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const timetable = timetables.find(t => t.id === timetableId);
        if (!timetable) {
          throw new Error("Timetable not found");
        }
        
        const newPermits: ExamPermit[] = [];
        
        // Create permits for each student and course
        for (const studentId of studentIds) {
          const student = getOrCreateStudent(studentId);
          
          for (const course of timetable.courses) {
            if (Math.random() > 0.3) { // Randomly assign courses to students
              const permit: ExamPermit = {
                id: `${Date.now()}-${studentId}-${course.id}`,
                studentId: student.id,
                studentName: student.name,
                courseId: course.id,
                courseName: course.name,
                examDate: course.examDate || new Date(),
                examTime: course.examTime || "09:00 AM",
                examLocation: course.examLocation || "Main Hall",
                qrCodeData: generateQRData(student.id, course.id),
                isValid: true
              };
              
              newPermits.push(permit);
              permits.push(permit);
            }
          }
        }
        
        resolve(newPermits);
      }, 2000);
    });
  },
  
  verifyPermit: async (qrData: string): Promise<ExamPermit | null> => {
    console.log("Verifying QR data:", qrData);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const permit = permits.find(p => p.qrCodeData === qrData);
        resolve(permit || null);
      }, 1000);
    });
  },
  
  getStudentPermits: async (studentId: string): Promise<ExamPermit[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const studentPermits = permits.filter(p => p.studentId === studentId);
        resolve(studentPermits);
      }, 500);
    });
  }
};

// Helper functions
function generateMockCourses(count: number): Course[] {
  const courses: Course[] = [];
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 30));
    
    courses.push({
      id: `COURSE-${i + 1}`,
      name: `Course ${i + 1}: ${["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"][i % 5]}`,
      examDate: date,
      examTime: `${9 + Math.floor(Math.random() * 8)}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      examLocation: ["Room A", "Room B", "Main Hall", "Auditorium", "Lab 1"][i % 5],
      duration: [60, 90, 120][Math.floor(Math.random() * 3)]
    });
  }
  
  return courses;
}

function generateOptimizedCourses(count: number): Course[] {
  const courses = generateMockCourses(count);
  
  // This would actually use an algorithm to optimize the schedule
  // but for the mock, we'll just sort them by date and add 2 days between each
  courses.sort((a, b) => a.examDate!.getTime() - b.examDate!.getTime());
  
  let currentDate = new Date();
  courses.forEach((course, index) => {
    currentDate.setDate(currentDate.getDate() + 2);
    course.examDate = new Date(currentDate);
    
    // Different times based on course type to avoid conflicts
    if (index % 3 === 0) {
      course.examTime = "09:00 AM";
    } else if (index % 3 === 1) {
      course.examTime = "01:00 PM";
    } else {
      course.examTime = "04:00 PM";
    }
  });
  
  return courses;
}

function getOrCreateStudent(id: string): Student {
  let student = students.find(s => s.id === id);
  
  if (!student) {
    student = {
      id,
      name: `Student ${students.length + 1}`,
      email: `student${students.length + 1}@university.edu`,
      courseIds: []
    };
    students.push(student);
  }
  
  return student;
}

function generateQRData(studentId: string, courseId: string): string {
  // In a real app, this would generate a signed token or encrypted data
  return `PERMIT-${studentId}-${courseId}-${Date.now()}`;
}
