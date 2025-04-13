
import { Link } from "react-router-dom";
import { CalendarIcon, Upload, BrainCircuit, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-exam-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-exam-primary mb-4">
            Exam Genie Schedule AI
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Streamline your exam management with AI-powered scheduling and digital permits
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Upload className="h-12 w-12 text-exam-primary mx-auto mb-4" />
                <CardTitle>Upload Timetable</CardTitle>
                <CardDescription>Import your existing exam schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Upload Excel files to quickly import your exam schedules and manage them digitally.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/upload" className="w-full">
                  <Button className="w-full bg-exam-primary hover:bg-exam-accent">Get Started</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BrainCircuit className="h-12 w-12 text-exam-primary mx-auto mb-4" />
                <CardTitle>AI Generation</CardTitle>
                <CardDescription>Create optimized exam schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Let our AI create the perfect exam schedule based on your constraints and requirements.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/generate" className="w-full">
                  <Button className="w-full bg-exam-primary hover:bg-exam-accent">Generate Schedule</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <QrCode className="h-12 w-12 text-exam-primary mx-auto mb-4" />
                <CardTitle>Digital Permits</CardTitle>
                <CardDescription>QR code verification system</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Generate and verify digital exam permits with secure QR codes for seamless student verification.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/permits" className="w-full">
                  <Button className="w-full bg-exam-primary hover:bg-exam-accent">Manage Permits</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
