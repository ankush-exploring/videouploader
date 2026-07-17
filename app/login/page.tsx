"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import { NotificationProvider, useNotification } from "../components/Notification";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        showNotification(result.error || "Login failed", "error");
      } else if (result?.ok) {
        showNotification("Login successful!", "success");
        router.push("/");
      }
    } catch {
      showNotification("An error occurred during login", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
            <p className="text-base-content/70">Sign in to your account</p>
          </div>

          <div className="card bg-base-100 w-full shadow-lg">
            <form onSubmit={handleSubmit} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input input-bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>

              <div className="divider">OR</div>

              <div className="text-center">
                <p className="text-sm text-base-content/70 mb-2">
                  Don&apos;t have an account?
                </p>
                <Link href="/register" className="link link-primary">
                  Create one now
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <NotificationProvider>
      <LoginContent />
    </NotificationProvider>
  );
}
