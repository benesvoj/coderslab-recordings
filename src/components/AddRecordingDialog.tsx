import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {supabase} from "@/utils/supabase.ts";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useToast} from "@/components/ui/use-toast.ts";

const recording = {
	title: '',
	description: '',
	url: '',
	date: '',
	lector: ''
}

export const AddRecordingDialog = ({isOpen, onOpenChange}: {
	isOpen: boolean,
	onOpenChange: (isOpen: boolean) => void
}) => {

	const {toast} = useToast()

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: recording
	})

	const onSubmit = async (values: z.infer<typeof schema>) => {
		console.log(values)
		const {error} = await supabase
			.from('recordings')
			.insert({
				title: values.title,
				description: values.description,
				url: values.url,
				date: values.date,
				lector: values.lector
			})
		onOpenChange(false)

		if (error) throw error;
		toast({description: 'Recording added'})
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add new recording</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className="grid gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							name='title'
							control={form.control}
							render={({field}) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input {...field}  />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							name='url'
							control={form.control}
							render={({field}) => (
								<FormItem>
									<FormLabel>Link</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							name='description'
							control={form.control}
							render={({field}) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea {...field} rows={6}/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							name='lector'
							control={form.control}
							render={({field}) => (
								<FormItem>
									<FormLabel>Lector</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							name='date'
							control={form.control}
							render={({field}) => (
								<FormItem>
									<FormLabel>Recording Date</FormLabel>
									<FormControl>
										<Input {...field} type='date'/>
									</FormControl>
								</FormItem>
							)}
						/>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant='secondary'>Close</Button>
							</DialogClose>
							<Button variant='default' type='submit'>Save</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

const schema = z.object({
	title: z.string(),
	description: z.string(),
	url: z.string(),
	date: z.string(),
	lector: z.string().optional()
})