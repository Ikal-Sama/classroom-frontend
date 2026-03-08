import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await signIn.email({
            email,
            password,
        }, {
            onRequest: () => {
                setLoading(true);
            },
            onSuccess: () => {
                toast.success("Welcome back!");
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
            <div className="logo text-center">
                <div className="flex items-center gap-2 mb-8 justify-center">
                    <GraduationCap className="h-10 w-10 text-primary" />
                    <span className="text-2xl font-bold tracking-tight">Classroom</span>
                </div>
            </div>

            <Card className="card shadow-2xl">
                <CardHeader className="header text-center">
                    <CardTitle className="title">Welcome back</CardTitle>
                    <CardDescription className="description">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="content">
                    <form onSubmit={handleLogin} className="form">
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <a href="#" className="text-xs text-primary hover:underline font-medium">
                                    Forgot password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="submit h-12 text-lg font-semibold" disabled={loading}>
                            {loading ? "Signing in..." : "Login"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="footer mt-6">
                    <p className="text-sm text-center w-full">
                        <span>Don't have an account?</span>
                        <Link to="/register" className="text-primary hover:underline font-bold">
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;
