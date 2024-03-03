import {
	Dialog, DialogClose,
	DialogContent,
	DialogDescription, DialogFooter,
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
import {Recording} from "@/lib/types.ts";

export const EditRecordingDialog = ({recording, isOpen, onOpenChange}: {
	recording: Recording,
	isOpen: boolean,
	onOpenChange: (isOpen: boolean) => void
}) => {

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: recording.title,
			description: recording.description,
			url: recording.url,
			date: recording.date
		}
	})

	const onSubmit = async (values: z.infer<typeof schema>) => {
		const {error} = await supabase
			.from('recordings')
			.update({title: values.title, url: values.url, description: values.description})
			.eq('id', recording.id)

		if (error) throw error;
		onOpenChange(false)
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Would you like to edit {recording.title} session?</DialogTitle>
					<DialogDescription>
						Following fields are editable.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							name='title'
							control={form.control}
							render={({field}) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input {...field}/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							name='url'
							control={form.control}
							render={({field}) => (
								<FormItem>
									<FormLabel>URL</FormLabel>
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
							name='date'
							control={form.control}
							render={({field}) => (
								<FormItem>
									<FormLabel>Date</FormLabel>
									<FormControl>
										<Input {...field} type='date'/>
									</FormControl>
								</FormItem>
							)}
						/>
						<DialogFooter className='mt-4'>
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
	date: z.string()
})