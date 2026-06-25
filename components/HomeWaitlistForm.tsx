"use client";

import { useState, type FormEvent } from "react";
import styles from "./HomeLanding.module.css";

type Status = "idle" | "submitting" | "success" | "error";

export function HomeWaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Registration failed.");
        return;
      }

      setStatus("success");
      setMessage(
        data.alreadyRegistered
          ? "You're already on the list. We'll be in touch soon."
          : "You're on the list! We'll send you an update when we launch."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Registration failed. Please try again in a moment.");
    }
  }

  if (status === "success") {
    return <p className={styles.waitlistStatus}>{message}</p>;
  }

  return (
    <form className={styles.waitlistForm} onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        className={styles.waitlistInput}
        disabled={status === "submitting"}
      />

      <button
        type="submit"
        className={styles.waitlistButton}
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Submitting..." : "Join the waitlist"}
      </button>

      {status === "error" && message ? (
        <p className={styles.waitlistError}>{message}</p>
      ) : null}
    </form>
  );
}
