"use client";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { signInAction } from "./sign-in-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Icons } from "@/components/custom/icons";
import { signInSchema } from "./sign-in-validation";

export function SignInForm() {
  const { form, action, handleSubmitWithAction } = useHookFormAction(
    signInAction,
    zodResolver(signInSchema),
    {
      actionProps: {},
      formProps: {},
      errorMapProps: {}
    }
  );

  return (
    <div className={"grid gap-6"}>
      <Form {...form}>
        <form onSubmit={handleSubmitWithAction}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='grid gap-1'>
                  <FormLabel htmlFor='email' className='sr-only'>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id='email'
                      placeholder='Email'
                      type='email'
                      autoCapitalize='none'
                      autoComplete='email'
                      autoCorrect='off'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='grid gap-1'>
                  <FormLabel htmlFor='password' className='sr-only'>
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id='password'
                      placeholder='Password'
                      type='password'
                      autoCapitalize='none'
                      autoCorrect='off'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormMessage>{action.result.serverError}</FormMessage>
            <FormMessage>{action.result.data?.failure}</FormMessage>

            <Button disabled={action.isExecuting}>
              {action.isExecuting && (
                <Icons.spinner className='mr-2 animate-spin h-4 w-4' />
              )}
              Sign In
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
