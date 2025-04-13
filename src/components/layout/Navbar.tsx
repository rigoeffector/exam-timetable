
import { Link } from "react-router-dom";
import { CalendarIcon, Upload, BrainCircuit, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="border-b shadow-sm bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <CalendarIcon className="h-6 w-6 text-exam-primary" />
          <span className="font-bold text-xl text-exam-primary">Exam Genie</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/upload">
            <Button variant="ghost" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload Timetable</span>
            </Button>
          </Link>
          
          <Link to="/generate">
            <Button variant="ghost" className="flex items-center space-x-2">
              <BrainCircuit className="h-4 w-4" />
              <span>AI Generate</span>
            </Button>
          </Link>
          
          <Link to="/permits">
            <Button variant="ghost" className="flex items-center space-x-2">
              <QrCode className="h-4 w-4" />
              <span>Digital Permits</span>
            </Button>
          </Link>
          
          <Link to="/verify">
            <Button variant="default" className="bg-exam-primary hover:bg-exam-accent text-white">
              Verify Student
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
