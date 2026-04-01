"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6661";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existingToken = localStorage.getItem("admin_token");
    if (existingToken) {
      router.replace("/admin");
    }
  }, [router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      localStorage.setItem("admin_token", data.token);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section grid">
      <section className="card" style={{ maxWidth: 480, margin: "0 auto", width: "100%" }}>
        <h1>Admin Login</h1>
        <p className="muted">Login with admin credentials to manage gallery and events.</p>
        <form onSubmit={onSubmit} className="grid" style={{ gap: "0.75rem" }}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid #cbd5e1" }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid #cbd5e1" }}
          />
          <button className="btn" type="submit" disabled={loading} style={{ border: 0 }}>
            {loading ? "Signing in..." : "Login"}
          </button>
          {error ? <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p> : null}
        </form>
      </section>
    </div>
  );
}
