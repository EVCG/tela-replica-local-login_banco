
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ApiService } from "@/services/apiService";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await ApiService.getCurrentUser();
      
      if (currentUser) {
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-xl font-medium mb-2">Redirecionando...</h1>
        <div className="w-8 h-8 border-t-2 border-vigia-green border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default Index;
