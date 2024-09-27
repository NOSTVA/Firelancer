"use client";
import { Icons } from "@/components/custom/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { signUpAction } from "./sign-up-action";
import { signUpSchema } from "./sign-up-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function SignUpForm() {
  const { form, action, handleSubmitWithAction } = useHookFormAction(signUpAction, zodResolver(signUpSchema), {
    actionProps: {},
    formProps: {},
    errorMapProps: {},
  });

  return (
    <div className={"grid gap-6"}>
      <Form {...form}>
        <form onSubmit={handleSubmitWithAction}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel htmlFor="username" className="sr-only">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input {...field} id="username" placeholder="Username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel htmlFor="email" className="sr-only">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      placeholder="Email"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel htmlFor="password" className="sr-only">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input {...field} id="password" placeholder="Password" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel htmlFor="confirm_password" className="sr-only">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input {...field} id="confirm_password" placeholder="Confirm Password" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormMessage>{action.result.serverError}</FormMessage>
            <FormMessage>{action.result.data?.failure}</FormMessage>

            <Button disabled={action.isExecuting}>
              {action.isExecuting && <Icons.spinner className="mr-2 animate-spin h-4 w-4" />}
              Join Firelancer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
