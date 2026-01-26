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
import { Spinner } from "@/components/ui/spinner"
import useSWRMutation from 'swr/mutation';
import fetcher from '../app/api/fetcher';
import { toast } from 'sonner';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { trigger, data, error, isMutating, reset } = useSWRMutation('register', fetcher);
  const handleRegisterSubmit = async(values, context) => {
    const result = await trigger(values);
    if(result)
      router.push('/login')

  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ userName: '', email: '', password: '' , retypePassword: ''}}
            validate={values => {
              const errors = {};
              if (!values.email) {
                errors.email = 'Required';
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = 'Invalid email address';
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              handleRegisterSubmit(values, setSubmitting)
            }}
          >
            {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         isSubmitting,
         /* and other goodies */
       }) => (
            <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
             <div className="grid gap-3">
              <Label htmlFor="userName">User name</Label>
                <Input
                  id="userName"
                  name="userName"
                  type="text"
                  placeholder="john"
                  value={values.userName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email {errors.email}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              <div className="grid gap-3">
              <Label htmlFor="retypePassword">Retype Password</Label>
                <Input
                  id="retypePassword"
                  name="retypePassword"
                  type="password"
                  value={values.retypePassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                 Submit
                </Button>
              </div>
            </div>
            </form>
            )}
            </Formik>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          
        </CardContent>
      </Card>
    </div>
  )
}
