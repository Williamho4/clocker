"use client";

import { signInUser } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useState } from "react";

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const handleForSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    const { error } = await signInUser(data);

    if (error) {
      setError("root", {
        message: error,
      });
    } else {
      router.push("/application/start");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleForSubmit)}>
      <Card className="w-100 p-10">
        <Label>Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email", { required: true })}
        ></Input>
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password", { required: true })}
        ></Input>
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        {errors.root && <p className="text-red-500">{errors.root.message}</p>}

        <Button disabled={isLoading}>Sign In</Button>
      </Card>
    </form>
  );
}
