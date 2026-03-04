"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email) {
      toast.error("Please enter an email address");
      return;
    }
    login(loginData.email, loginData.password);
    toast.success("Welcome back!");
    router.push("/account");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.email || !registerData.firstName) {
      toast.error("Please fill in all required fields");
      return;
    }
    register(registerData.email, registerData.password, registerData.firstName, registerData.lastName);
    toast.success("Account created successfully!");
    router.push("/account");
  };

  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            MERIDIAN
          </Link>
          <p className="mt-2 text-muted-foreground">Sign in to your account or create a new one</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-full">
            <TabsTrigger value="login" className="rounded-full">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="register" className="rounded-full">
              Create Account
            </TabsTrigger>
          </TabsList>

          <div className="relative mt-2 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Welcome Back</CardTitle>
                      <CardDescription>
                        Enter any email and password to sign in (demo mode)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <Label htmlFor="login-email">Email</Label>
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="you@example.com"
                            value={loginData.email}
                            onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                            className="mt-1.5 rounded-lg"
                          />
                        </div>
                        <div>
                          <Label htmlFor="login-password">Password</Label>
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="Enter any password"
                            value={loginData.password}
                            onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                            className="mt-1.5 rounded-lg"
                          />
                        </div>
                        <Button type="submit" className="w-full rounded-full" size="lg">
                          Sign In
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === "register" && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Create Account</CardTitle>
                      <CardDescription>
                        Fill in your details to create a demo account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="reg-first">First name</Label>
                            <Input
                              id="reg-first"
                              placeholder="John"
                              value={registerData.firstName}
                              onChange={(e) =>
                                setRegisterData((prev) => ({ ...prev, firstName: e.target.value }))
                              }
                              className="mt-1.5 rounded-lg"
                            />
                          </div>
                          <div>
                            <Label htmlFor="reg-last">Last name</Label>
                            <Input
                              id="reg-last"
                              placeholder="Doe"
                              value={registerData.lastName}
                              onChange={(e) =>
                                setRegisterData((prev) => ({ ...prev, lastName: e.target.value }))
                              }
                              className="mt-1.5 rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="reg-email">Email</Label>
                          <Input
                            id="reg-email"
                            type="email"
                            placeholder="you@example.com"
                            value={registerData.email}
                            onChange={(e) =>
                              setRegisterData((prev) => ({ ...prev, email: e.target.value }))
                            }
                            className="mt-1.5 rounded-lg"
                          />
                        </div>
                        <div>
                          <Label htmlFor="reg-password">Password</Label>
                          <Input
                            id="reg-password"
                            type="password"
                            placeholder="Create a password"
                            value={registerData.password}
                            onChange={(e) =>
                              setRegisterData((prev) => ({ ...prev, password: e.target.value }))
                            }
                            className="mt-1.5 rounded-lg"
                          />
                        </div>
                        <Button type="submit" className="w-full rounded-full" size="lg">
                          Create Account
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
