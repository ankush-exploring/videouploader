"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import { NotificationProvider, useNotification } from "../components/Notification";

function RegisterContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    if (password.length < 6) {
      showNotification("Password must be at least 6 characters", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      showNotification("Account created successfully! Redirecting to login...", "success");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      showNotification(message, "error");
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
            <h1 className="text-4xl font-bold mb-2">Create Account</h1>
            <p className="text-base-content/70">Join our community today</p>
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
                <label className="label">
                  <span className="label-text-alt">Minimum 6 characters</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Confirm Password</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>

              <div className="divider">OR</div>

              <div className="text-center">
                <p className="text-sm text-base-content/70 mb-2">
                  Already have an account?
                </p>
                <Link href="/login" className="link link-primary">
                  Sign in here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function RegisterPage() {
  return (
    <NotificationProvider>
      <RegisterContent />
    </NotificationProvider>
  );
}
