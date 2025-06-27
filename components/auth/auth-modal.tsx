"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: "login" | "register"
}

export function AuthModal({ open, onOpenChange, defaultTab = "login" }: AuthModalProps) {
  const { login, register, isLoading } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState(defaultTab)

  const [loginForm, setLoginForm] = useState({
    number: "",
    password: "",
  })

  const [registerForm, setRegisterForm] = useState({
    full_name: "",
    number: "",
    password: "",
    email: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(loginForm)
      toast({
        title: "Muvaffaqiyatli kirish!",
        description: "Siz tizimga muvaffaqiyatli kirdingiz",
      })
      onOpenChange(false)
      setLoginForm({ number: "", password: "" })
    } catch (error) {
      toast({
        title: "Kirish xatosi",
        description: error instanceof Error ? error.message : "Telefon raqam yoki parol noto'g'ri",
        variant: "destructive",
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(registerForm)
      toast({
        title: "Ro'yxatdan o'tish muvaffaqiyatli!",
        description: "Akkauntingiz yaratildi va tizimga kirdingiz",
      })
      onOpenChange(false)
      setRegisterForm({ full_name: "", number: "", password: "", email: "" })
    } catch (error) {
      toast({
        title: "Ro'yxatdan o'tish xatosi",
        description: error instanceof Error ? error.message : "Ro'yxatdan o'tishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Amur Restorani</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Kirish</TabsTrigger>
            <TabsTrigger value="register">Ro'yxatdan o'tish</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-number">Telefon raqam</Label>
                <Input
                  id="login-number"
                  type="tel"
                  placeholder="+ 998 94 700 07 70"
                  value={loginForm.number}
                  onChange={(e) => setLoginForm({ ...loginForm, number: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password">Parol</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kirish
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="register-name">To'liq ism</Label>
                <Input
                  id="register-name"
                  value={registerForm.full_name}
                  onChange={(e) => setRegisterForm({ ...registerForm, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-number">Telefon raqam</Label>
                <Input
                  id="register-number"
                  type="tel"
                  placeholder="+ 998 94 700 07 70"
                  value={registerForm.number}
                  onChange={(e) => setRegisterForm({ ...registerForm, number: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-email">Email (ixtiyoriy)</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="register-password">Parol</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ro'yxatdan o'tish
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
