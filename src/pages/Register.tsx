import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

// Redux
import { useDispatch } from "react-redux";
import { login } from "@/features/Auth/authSlice";

// --- SCHEMA WALIDACJI (zod) ---
const registerSchema = z
  .object({
    name: z.string().min(2, "Imię jest za krótkie"),
    email: z.string().email("Podaj poprawny adres email"),
    password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być takie same",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      // rejestracja
      const res = await axios.post("http://localhost:5000/api/users/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      // backend zwraca token po rejestracji
      if (res.data.token) {
        dispatch(login(res.data.token));
        setMessage("Rejestracja udana! Zalogowano pomyślnie.");
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage("Rejestracja udana! Możesz się zalogować.");
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Błąd rejestracji");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle>Rejestracja</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Imię</Label>
                    <Input placeholder="Twoje imię" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <Input type="password" placeholder="******" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <Label>Powtórz hasło</Label>
                    <Input type="password" placeholder="******" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Zarejestruj się
              </Button>

              {message && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  {message}
                </p>
              )}

              <div className="flex justify-center text-gray-500 mt-2">
                <NavLink
                  to="/login"
                  className="hover:underline text-blue-600 font-medium"
                >
                  Masz już konto?
                </NavLink>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
