"use client";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { cn } from "@/app/_utils/cn";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "../_constants/routes";

type FormStatus = "idle" | "loading" | "success" | "error";

export const SubscribeForm = () => {
  const [formState, setFormState] = useState({
    email: "",
    status: "idle" as FormStatus,
    message: "",
  });

  const isLoading = formState.status === "loading";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, status: "loading", message: "" }));

    try {
      const response = await fetch(ROUTES.email, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formState.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to subscribe");
      }

      if (data.success) {
        setFormState({
          email: "",
          status: "success",
          message: "Thanks for subscribing!"
        });
      } else {
        setFormState((prev) => ({
          ...prev,
          status: "error",
          message: data.message || "Failed to subscribe"
        }));
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setFormState((prev) => ({
        ...prev,
        status: "error",
        message: error instanceof Error ? error.message : "Failed to subscribe"
      }));
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-700/65 px-4 py-10 sm:px-8 mt-10">
      <h2 className="text-2xl font-bold mb-5 text-foreground">
        Get notified when new patterns are added.
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="inline-flex gap-2">
            <Input
              id="subscribe-form"
              placeholder="Your email"
              type="email"
              value={formState.email}
              onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
              disabled={isLoading}
              required
            />
            <Button
              type="submit"
              // className="group relative"
              disabled={isLoading}
              data-loading={isLoading}
              variant="outline"
            >
              <span className="group-data-[loading=true]:text-transparent">
                Subscribe
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoaderCircle
                    className="animate-spin"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>
              )}
            </Button>
          </div>
          {formState.message && (
            <p
              className={cn(
                "mt-2 text-xs",
                formState.status === "error" ? "text-destructive" : "text-muted-foreground",
              )}
              role="alert"
              aria-live="polite"
            >
              {formState.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
