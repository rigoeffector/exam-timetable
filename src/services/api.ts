
import { ExamTimetable, Course, Student, ExamPermit } from "@/types/exam";

// Base URL for the Spring Boot API
const API_BASE_URL = "http://localhost:8080/api";

// Real API service that connects to Spring Boot backend
export const api = {
  // Timetable endpoints
  uploadTimetable: async (file: File): Promise<ExamTimetable> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(`${API_BASE_URL}/timetables/upload`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload timetable");
    }
    
    return response.json();
  },
  
  getAllTimetables: async (): Promise<ExamTimetable[]> => {
    const response = await fetch(`${API_BASE_URL}/timetables`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch timetables");
    }
    
    return response.json();
  },
  
  // AI/ML Generation endpoints
  generateTimetable: async (parameters: any): Promise<ExamTimetable> => {
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
  },
  
  // QR and Permit endpoints
  generatePermits: async (timetableId: string, studentIds: string[]): Promise<ExamPermit[]> => {
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
  },
  
  verifyPermit: async (qrData: string): Promise<ExamPermit | null> => {
    const response = await fetch(`${API_BASE_URL}/permits/verify?qrData=${encodeURIComponent(qrData)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to verify permit");
    }
    
    return response.json();
  },
  
  getStudentPermits: async (studentId: string): Promise<ExamPermit[]> => {
    const response = await fetch(`${API_BASE_URL}/permits/student/${studentId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error("Failed to fetch student permits");
    }
    
    return response.json();
  }
};
