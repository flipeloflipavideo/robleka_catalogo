import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, LogIn } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout";
import AdminPanel from "@/components/admin-panel";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      apiRequest("POST", "/api/auth/login", data),
    onSuccess: () => {
      setIsAuthenticated(true);
      toast({ title: "Login exitoso" });
    },
    onError: () => {
      toast({ 
        title: "Error de autenticación", 
        description: "Credenciales inválidas",
        variant: "destructive" 
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-poppins font-bold text-dark-navy">
                Acceso de Administrador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="admin"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="admin123"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-deep-blue hover:bg-deep-blue/80 text-white"
                  disabled={loginMutation.isPending}
                >
                  <LogIn className="mr-2" size={16} />
                  {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Credenciales de prueba:</p>
                <p className="text-sm"><strong>Usuario:</strong> admin</p>
                <p className="text-sm"><strong>Contraseña:</strong> admin123</p>
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                  <ArrowLeft className="mr-2" size={16} />
                  Volver al Catálogo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AdminPanel />
    </Layout>
  );
}
