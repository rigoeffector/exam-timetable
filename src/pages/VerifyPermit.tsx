
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Camera, XCircle, CheckCircle, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { ExamPermit } from "@/types/exam";
import Navbar from "@/components/layout/Navbar";

const VerifyPermit = () => {
  const { toast } = useToast();
  const [qrData, setQrData] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    permit: ExamPermit | null;
  } | null>(null);
  
  const handleVerify = async () => {
    if (!qrData.trim()) {
      toast({
        title: "Error",
        description: "Please enter QR code data",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    
    try {
      const permit = await api.verifyPermit(qrData);
      
      setVerificationResult({
        success: !!permit && permit.isValid,
        permit
      });
      
      toast({
        title: permit ? "Verification complete" : "Not found",
        description: permit 
          ? permit.isValid 
            ? "Exam permit is valid" 
            : "Exam permit is invalid"
          : "No matching permit found",
        variant: permit ? (permit.isValid ? "default" : "destructive") : "destructive"
      });
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification failed",
        description: "An error occurred during verification",
        variant: "destructive"
      });
      
      setVerificationResult(null);
    } finally {
      setIsVerifying(false);
    }
  };
  
  const resetVerification = () => {
    setQrData("");
    setVerificationResult(null);
  };

  return (
    <div className="min-h-screen bg-exam-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <QrCode className="h-8 w-8 text-exam-primary mr-3" />
            <h1 className="text-3xl font-bold text-exam-primary">
              Verify Exam Permit
            </h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Scan or enter the QR code from a student's digital exam permit to verify eligibility.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Verification</CardTitle>
                <CardDescription>
                  Enter QR code data or scan to verify a student's permit
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="qr-data">QR Code Data</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="qr-data"
                      placeholder="Enter QR code data"
                      value={qrData}
                      onChange={(e) => setQrData(e.target.value)}
                      disabled={isVerifying}
                    />
                    <Button
                      variant="outline"
                      className="shrink-0"
                      disabled={isVerifying}
                      onClick={() => alert("Camera scanning would be implemented here")}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center">
                  <QrCode className="h-16 w-16 text-exam-primary mb-4" />
                  <p className="text-sm text-gray-500">
                    In a real implementation, this would include a QR code scanner
                    using the device camera to scan student permits.
                  </p>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={handleVerify} 
                  disabled={isVerifying || !qrData.trim()}
                  className="w-full bg-exam-primary hover:bg-exam-accent"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Permit"
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <div>
              {isVerifying ? (
                <Card className="h-full flex flex-col items-center justify-center text-center p-8">
                  <Loader2 className="h-12 w-12 text-exam-primary animate-spin mb-4" />
                  <h3 className="text-xl font-medium mb-2">Verifying permit...</h3>
                  <p className="text-gray-500">
                    Checking the validity of the provided QR code.
                  </p>
                </Card>
              ) : verificationResult ? (
                <Card>
                  <CardHeader className={`${
                    verificationResult.success 
                      ? "bg-green-50" 
                      : "bg-red-50"
                  } border-b`}>
                    <div className="flex items-center">
                      {verificationResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <CardTitle className={verificationResult.success ? "text-green-700" : "text-red-700"}>
                        {verificationResult.success ? "Permit Valid" : "Permit Invalid"}
                      </CardTitle>
                    </div>
                    <CardDescription>
                      {verificationResult.success 
                        ? "Student is eligible to take this exam" 
                        : "Student is not eligible for this exam"}
                    </CardDescription>
                  </CardHeader>
                  
                  {verificationResult.permit ? (
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">Student Information</h3>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                            <div className="text-sm font-medium">Name:</div>
                            <div className="text-sm">{verificationResult.permit.studentName}</div>
                            
                            <div className="text-sm font-medium">ID:</div>
                            <div className="text-sm">{verificationResult.permit.studentId}</div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium">Exam Information</h3>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                            <div className="text-sm font-medium">Course:</div>
                            <div className="text-sm">{verificationResult.permit.courseName}</div>
                            
                            <div className="text-sm font-medium">Date:</div>
                            <div className="text-sm">{verificationResult.permit.examDate.toLocaleDateString()}</div>
                            
                            <div className="text-sm font-medium">Time:</div>
                            <div className="text-sm">{verificationResult.permit.examTime}</div>
                            
                            <div className="text-sm font-medium">Location:</div>
                            <div className="text-sm">{verificationResult.permit.examLocation}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="py-6">
                      <div className="text-center">
                        <p className="text-gray-600">
                          No matching permit found in the system.
                        </p>
                      </div>
                    </CardContent>
                  )}
                  
                  <CardFooter>
                    <Button 
                      onClick={resetVerification}
                      className="w-full"
                      variant="outline"
                    >
                      Verify Another
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
                  <QrCode className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-500 mb-2">No Verification Yet</h3>
                  <p className="text-gray-400">
                    Enter QR code data or scan a QR code from a student's exam permit
                    to begin verification.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPermit;
