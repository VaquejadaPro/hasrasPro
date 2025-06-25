import { useAuth } from "../hooks/useAuth";
import LoginScreenModern from "./modules/login/screens/LoginScreenModern";
import { Redirect } from "expo-router";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // ou um loading spinner
  }

  if (user) {
    // Se está logado, redireciona para as tabs
    return <Redirect href="/tabs" />;
  }

  // Se não está logado, mostra a tela de login
  return <LoginScreenModern />;
}
