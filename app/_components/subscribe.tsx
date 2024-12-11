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
          message: "Thanks for subscribing! Please check your inbox for a confirmation email (it may be in your spam folder)."
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
    <div className="flex flex-col mt-10 items-center justify-center py-10 px-4 text-center border border-neutral-400 dark:border-neutral-800 rounded-xl">
      <h2 className="text-2xl font-bold mb-5 text-foreground">
        Get notified when new patterns are added!
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row gap-2">
            <Input
              placeholder="mail@example.com"
              type="email"
              className="w-full md:w-[300px]"
              value={formState.email}
              onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
              disabled={isLoading}
              required
            />
            <Button
              type="submit"
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
                "mt-2 text-sm",
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
