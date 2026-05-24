"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : "";
}

export async function signUpCreator(formData: FormData) {
  const fullName = text(formData, "full_name");
  const email = text(formData, "email");
  const password = text(formData, "password");
  const confirmPassword = text(formData, "confirm_password");

  if (password !== confirmPassword) {
    redirect("/signup/creator?error=Passwords%20do%20not%20match");
  }

  if (!isSupabaseConfigured()) {
    redirect("/signup/creator?config=required");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "creator"
      }
    }
  });

  if (error) {
    redirect(`/signup/creator?error=${encodeURIComponent(error.message)}`);
  }

  if (!data.session || !data.user) {
    redirect("/login?notice=Check%20your%20email%20to%20confirm%20your%20account");
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: data.user.id,
      email: data.user.email,
      full_name: fullName,
      role: "creator"
    },
    { onConflict: "id" }
  );

  if (profileError) {
    redirect(`/signup/creator?error=${encodeURIComponent(profileError.message)}`);
  }

  redirect("/create-profile/free");
}
