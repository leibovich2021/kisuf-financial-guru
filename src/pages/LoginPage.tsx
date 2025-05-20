
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole, User } from "lucide-react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // הגדר את פרטי ההתחברות הקבועים
    const validUsername = "avinoam";
    const validPassword = "233406073";

    // בדוק את הנתונים
    setTimeout(() => {
      if (username === validUsername && password === validPassword) {
        // שמור מידע על התחברות מוצלחת
        localStorage.setItem("isLoggedIn", "true");
        
        // הצג הודעת הצלחה
        toast({
          title: "התחברות מוצלחת",
          description: "ברוך הבא למערכת ניהול הכספים",
        });
        
        // הפנה למסך הראשי
        navigate("/dashboard");
      } else {
        // הצג הודעת שגיאה
        toast({
          title: "התחברות נכשלה",
          description: "שם משתמש או סיסמה שגויים",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000); // השהייה קצרה ליצירת אפקט טעינה
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">התחברות למערכת</CardTitle>
          <CardDescription>הזן את פרטי הכניסה שלך כדי להתחבר למערכת ניהול הכספים</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">שם משתמש</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="הכנס שם משתמש"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="הכנס סיסמה"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={isLoading}
            >
              {isLoading ? "מתחבר..." : "התחבר"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
