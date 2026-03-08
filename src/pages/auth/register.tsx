import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, User, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ROLE_OPTIONS } from "@/constants";

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState<"student" | "teacher">("student");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await signUp.email({
            email,
            password,
            name,
            role,
        }, {
            onRequest: () => {
                setLoading(true);
            },
            onSuccess: () => {
                toast.success("Account created successfully!");
                navigate("/");
            },
            onError: (ctx) => {
                toast.error(ctx.error.message);
                setLoading(false);
            },
        });

        if (error) {
            // Error already handled in onError
        }
    };

    return (
        <div className="sign-up">
            <div className="logo">
                <div className="flex items-center gap-2 mb-8">
                    <GraduationCap className="h-10 w-10 text-primary" />
                    <span className="text-2xl font-bold tracking-tight">Classroom</span>
                </div>
            </div>

            <Card className="card shadow-2xl">
                <CardHeader className="header text-center">
                    <CardTitle className="title">Create an account</CardTitle>
                    <CardDescription className="description">
                        Enter your details to create your classroom account
                    </CardDescription>
                </CardHeader>
                <CardContent className="content">
                    <form onSubmit={handleRegister} className="form">
                        <div className="field">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="field">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="field">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="field">
                            <Label>I am a...</Label>
                            <div className="roles">
                                <button
                                    type="button"
                                    className={cn(
                                        "role-button",
                                        role === "student" && "is-active"
                                    )}
                                    onClick={() => setRole("student")}
                                >
                                    <User className="h-6 w-6" />
                                    <span>Student</span>
                                </button>
                                <button
                                    type="button"
                                    className={cn(
                                        "role-button",
                                        role === "teacher" && "is-active"
                                    )}
                                    onClick={() => setRole("teacher")}
                                >
                                    <ShieldCheck className="h-6 w-6" />
                                    <span>Teacher</span>
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="submit h-12 text-lg font-semibold" disabled={loading}>
                            {loading ? "Creating account..." : "Register"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="footer mt-6">
                    <p className="text-sm text-center w-full">
                        <span>Already have an account?</span>
                        <Link to="/login" className="text-primary hover:underline font-bold">
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RegisterPage;
