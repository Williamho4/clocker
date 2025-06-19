"use client";

import { signUpUser } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { z } from "zod";

export default function SignUpForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  const handleForSubmit = async (data: z.infer<typeof signUpSchema>) => {
    const { error } = await signUpUser(data);

    if (error) {
      setError("root", {
        message: error,
      });
    } else {
      router.push("/application/start");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleForSubmit)}>
      <Card className="w-100 p-10">
        <Label>Email</Label>
        <Input id="email" {...register("email", { required: true })}></Input>
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <Label>First name</Label>
        <Input
          id="firstName"
          {...register("firstName", { required: true })}
        ></Input>
        {errors.firstName && (
          <p className="text-red-500">{errors.firstName.message}</p>
        )}

        <Label>Last name</Label>
        <Input
          id="lastName"
          {...register("lastName", { required: true })}
        ></Input>
        {errors.lastName && (
          <p className="text-red-500">{errors.lastName.message}</p>
        )}

        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          {...register("password", { required: true })}
        ></Input>
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        {errors.root && <p className="text-red-500">{errors.root.message}</p>}

        <Button>Sign Up</Button>
      </Card>
    </form>
  );
}
