import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

// Redux
import { useDispatch } from "react-redux";
import { login } from "@/features/Auth/authSlice";

// --- Schema walidacji ---
const loginSchema = z.object({
  email: z
    .string()
    .email("Nieprawidłowy format email")
    .min(1, "Email jest wymagany"),
  password: z.string().min(6, "Hasło musi mieć min. 6 znaków"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        data
      );

      // zapis tokenu i ustawienie stanu w Redux
      dispatch(login(res.data.token));

      setMessage("Zalogowano pomyślnie!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Błąd logowania");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">🔐 Logowanie</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>Email</Label>
                    <Input placeholder="twoj@email.com" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Hasło</Label>
                    <Input type="password" placeholder="••••••••" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Zaloguj się
              </Button>

              {message && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  {message}
                </p>
              )}

              <div className="flex justify-center text-gray-500">
                <NavLink to="/register" className="hover:underline">
                  Nie masz konta?
                </NavLink>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
