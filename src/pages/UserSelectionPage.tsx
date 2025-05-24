
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, LogIn } from "lucide-react";
import { userService } from "@/services/userService";

const UserSelectionPage = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const users = userService.getUsers();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const user = userService.login(loginUsername, password);
      
      if (user) {
        toast({
          title: "התחברות מוצלחת",
          description: `ברוך הבא ${user.displayName}`,
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "התחברות נכשלה",
          description: "שם משתמש או סיסמה שגויים",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 500);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newUser = userService.createUser(newUsername, newPassword, newDisplayName);
      
      toast({
        title: "משתמש נוצר בהצלחה",
        description: `המשתמש ${newUser.displayName} נוצר ומחובר`,
      });
      
      // התחבר אוטומטית עם המשתמש החדש
      userService.login(newUsername, newPassword);
      navigate("/dashboard");
      
    } catch (error) {
      toast({
        title: "שגיאה ביצירת משתמש",
        description: error instanceof Error ? error.message : "שגיאה לא ידועה",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-accent/30 to-background p-4">
      <Card className="w-full max-w-md animate-fade-in shadow-lg border-accent/20">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">בחירת משתמש</CardTitle>
          <CardDescription className="text-base">התחבר למשתמש קיים או צור משתמש חדש</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                התחברות
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                משתמש חדש
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">שם משתמש</Label>
                  <Input
                    id="username"
                    placeholder="הכנס שם משתמש"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">סיסמה</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="הכנס סיסמה"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "מתחבר..." : "התחבר"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-display-name">שם מלא</Label>
                  <Input
                    id="new-display-name"
                    placeholder="הכנס שם מלא"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-username">שם משתמש</Label>
                  <Input
                    id="new-username"
                    placeholder="הכנס שם משתמש"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">סיסמה</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="הכנס סיסמה"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "יוצר משתמש..." : "צור משתמש חדש"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSelectionPage;
