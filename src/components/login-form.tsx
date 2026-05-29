import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import useSWRMutation from 'swr/mutation';
import fetcher from '../app/api/fetcher';
import { TypeLoginForm, TypeLoginResponse } from '@/app/types';
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { trigger } = useSWRMutation<
    TypeLoginResponse, 
    unknown,                
    string,                
    TypeLoginForm
  >('login', fetcher);
  const router = useRouter();
  const handleLoginSubmit = async(values: TypeLoginForm) => {
    
    const result = await trigger(values);
    if(result.status)
      router.push('/')

  }
  return (
    
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Login to your account</CardTitle>
          <CardDescription className="text-sm">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
        <Formik
                    initialValues={{ email: '', password: ''}}
                    validate={values => {
                      const errors: Partial<TypeLoginForm> = {};
                      if (!values.email) {
                        errors.email = 'Required';
                      } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                      ) {
                        errors.email = 'Invalid email address';
                      }
                      return errors;
                    }}
                    onSubmit={(values) => {
                      console.log(values)
                      handleLoginSubmit(values)
                    }}
                  >
                    {({
                 values,
                 handleChange,
                 handleBlur,
                 handleSubmit,
                 /* and other goodies */
               }) => (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-md">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="h-12 text-md"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-md">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" name="password"
                value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-12 text-md"
                required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full h-12 text-md">
                  Login
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-xs">
              Don&apos;t have an account?{" "}
              <a href="/register" className="underline underline-offset-4 text-md">
                Sign up
              </a>
            </div>
          </form>
          )}
        </Formik>
        </CardContent>
      </Card>
    </div>
  )
}
