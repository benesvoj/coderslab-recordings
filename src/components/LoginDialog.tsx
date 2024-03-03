import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form.tsx";

export const LoginDialog = () => {

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			username: "",
			password: "",
		},
	})

	const onSubmit = (values: z.infer<typeof schema>) => {
		console.log('submitted')
		console.log(values)
	}

	return (
		<Dialog>
			<DialogTrigger>
				<Button variant='default'>Login</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Login</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<FormField name='username' control={form.control}
								   render={({field}) => (
									   <FormItem>
										   <FormLabel>Username</FormLabel>
										   <FormControl>
											   <Input placeholder="Enter username" {...field} />
										   </FormControl>
										   <FormMessage/>
									   </FormItem>
								   )}
						/>
						<FormField name='password' control={form.control}
								   render={({field}) => (
									   <FormItem>
										   <FormLabel>Password</FormLabel>
										   <FormControl>
											   <Input type='password' placeholder="Enter password" {...field} />
										   </FormControl>
										   <FormMessage/>
									   </FormItem>
								   )}
						/>
					</form>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant='secondary'>Return</Button>
						</DialogClose>
						<Button variant='default' type='submit'>Login</Button>
					</DialogFooter>
				</Form>
			</DialogContent>
		</Dialog>
	)
}


const schema = z.object({
	username: z.string()
		.min(3, {message: "Username must be at least 3 characters."})
		.max(25),
	password: z.string()
		.min(6, {message: "Username must be at least 3 characters."})
		.max(25)
})