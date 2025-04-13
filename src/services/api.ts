
import { ExamTimetable, Course, Student, ExamPermit } from "@/types/exam";

// Base URL for the Spring Boot API
const API_BASE_URL = "http://localhost:8080/api";

// Mock data for testing without a backend
const mockTimetables: ExamTimetable[] = [
  {
    id: "t1",
    name: "Fall Semester Final Exams",
    semester: "Fall",
    academicYear: "2025-2026",
    courses: [
      {
        id: "c101",
        name: "Introduction to Computer Science",
        examDate: new Date("2025-12-15T00:00:00.000Z"),
        examTime: "09:00 - 11:00",
        examLocation: "Main Hall A",
        duration: 120
      },
      {
        id: "c102",
        name: "Data Structures and Algorithms",
        examDate: new Date("2025-12-16T00:00:00.000Z"),
        examTime: "13:00 - 15:00",
        examLocation: "Science Building 101",
        duration: 120
      }
    ],
    createdAt: new Date("2025-09-01T00:00:00.000Z"),
    lastModified: new Date("2025-09-01T00:00:00.000Z")
  },
  {
    id: "t2",
    name: "Spring Semester Midterms",
    semester: "Spring",
    academicYear: "2025-2026",
    courses: [
      {
        id: "c201",
        name: "Database Systems",
        examDate: new Date("2026-03-10T00:00:00.000Z"),
        examTime: "10:00 - 12:00",
        examLocation: "Engineering Hall B",
        duration: 120
      },
      {
        id: "c202",
        name: "Software Engineering",
        examDate: new Date("2026-03-12T00:00:00.000Z"),
        examTime: "14:00 - 16:00",
        examLocation: "Computer Lab 3",
        duration: 120
      }
    ],
    createdAt: new Date("2026-01-15T00:00:00.000Z"),
    lastModified: new Date("2026-01-15T00:00:00.000Z")
  }
];

// Mock permits
const mockPermits: ExamPermit[] = [];

// Flag to determine whether to use mock data or real API
const USE_MOCK_DATA = true;

// Real API service that connects to Spring Boot backend with fallback to mock data
export const api = {
  // Timetable endpoints
  uploadTimetable: async (file: File): Promise<ExamTimetable> => {
    if (USE_MOCK_DATA) {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return a mock timetable
      return {
        ...mockTimetables[0],
        id: `t${Date.now()}`,
        name: file.name.replace(".xlsx", "").replace(".csv", ""),
        createdAt: new Date(),
        lastModified: new Date()
      };
    }
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await fetch(`${API_BASE_URL}/timetables/upload`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload timetable");
      }
      
      return response.json();
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  },
  
  getAllTimetables: async (): Promise<ExamTimetable[]> => {
    if (USE_MOCK_DATA) {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return [...mockTimetables];
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/timetables`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch timetables");
      }
      
      return response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  },
  
  // AI/ML Generation endpoints
  generateTimetable: async (parameters: any): Promise<ExamTimetable> => {
    if (USE_MOCK_DATA) {
      // Simulate a delay for AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        id: `t${Date.now()}`,
        name: `AI Generated - ${parameters.name || 'Untitled'}`,
        semester: parameters.semester || 'Spring',
        academicYear: parameters.academicYear || '2025-2026',
        courses: [
          {
            id: `c${Date.now()}1`,
            name: "AI-Generated Course 1",
            examDate: new Date(new Date().getTime() + 86400000), // tomorrow
            examTime: "10:00 - 12:00",
            examLocation: "Room A101",
            duration: 120
          },
          {
            id: `c${Date.now()}2`,
            name: "AI-Generated Course 2",
            examDate: new Date(new Date().getTime() + 172800000), // day after tomorrow
            examTime: "14:00 - 16:00",
            examLocation: "Room B202",
            duration: 120
          }
        ],
        createdAt: new Date(),
        lastModified: new Date()
      };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/timetables/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parameters),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate timetable");
      }
      
      return response.json();
    } catch (error) {
      console.error("Generation error:", error);
      throw error;
    }
  },
  
  // QR and Permit endpoints
  generatePermits: async (timetableId: string, studentIds: string[]): Promise<ExamPermit[]> => {
    if (USE_MOCK_DATA) {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Find the timetable
      const timetable = mockTimetables.find(t => t.id === timetableId);
      if (!timetable) {
        throw new Error("Timetable not found");
      }
      
      // Generate permits for each student and course
      const newPermits: ExamPermit[] = [];
      
      for (const studentId of studentIds) {
        for (const course of timetable.courses) {
          const permit: ExamPermit = {
            id: `p${Date.now()}-${studentId}-${course.id}`,
            studentId: studentId,
            studentName: `Student ${studentId}`,
            courseId: course.id,
            courseName: course.name,
            examDate: course.examDate!,
            examTime: course.examTime!,
            examLocation: course.examLocation!,
            qrCodeData: `PERMIT-${timetableId}-${studentId}-${course.id}-${Date.now()}`,
            isValid: true
          };
          
          newPermits.push(permit);
          mockPermits.push(permit);
        }
      }
      
      return newPermits;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/permits/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timetableId,
          studentIds,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate permits");
      }
      
      return response.json();
    } catch (error) {
      console.error("Permit generation error:", error);
      throw error;
    }
  },
  
  verifyPermit: async (qrData: string): Promise<ExamPermit | null> => {
    if (USE_MOCK_DATA) {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if we have a permit with matching QR code
      const permit = mockPermits.find(p => p.qrCodeData === qrData);
      
      if (!permit) {
        // No permit found with this QR code
        return null;
      }
      
      return permit;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/permits/verify?qrData=${encodeURIComponent(qrData)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to verify permit");
      }
      
      return response.json();
    } catch (error) {
      console.error("Verification error:", error);
      throw error;
    }
  },
  
  getStudentPermits: async (studentId: string): Promise<ExamPermit[]> => {
    if (USE_MOCK_DATA) {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Filter permits by student ID
      return mockPermits.filter(p => p.studentId === studentId);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/permits/student/${studentId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error("Failed to fetch student permits");
      }
      
      return response.json();
    } catch (error) {
      console.error("Student permits fetch error:", error);
      throw error;
    }
  }
};
