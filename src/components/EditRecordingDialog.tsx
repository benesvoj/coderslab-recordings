import {
	Dialog, DialogClose,
	DialogContent,
	DialogDescription, DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Recording} from "@/App.tsx";
import {FormEvent} from "react";
import {supabase} from "@/utils/supabase.ts";

export const EditRecordingDialog = (props: { recording: Recording }) => {

	const {recording} = props

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		console.log('submit')
		const {error} = await supabase
			.from('recordings')
			.update({title: recording.title, description: recording.description})
			.eq('id', recording.id)

		if (error) throw error;
	}

	return (
		<Dialog>
			<DialogTrigger>
				<Button variant='secondary'>Edit</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Would you like to edit {recording.title}?</DialogTitle>
					<DialogDescription>
						Following fields are editable.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col gap-2">
						<Label htmlFor="title" className='text-sm text-gray-400'>
							Title
						</Label>
						<Input id="title" name="title" value={recording.title} className="col-span-3"/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor='description' className='text-sm text-gray-400'>Description</Label>
						<Textarea id='description' name="description" value={recording.description} className="col-span-3" rows={6}/>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant='secondary'>Close</Button>
						</DialogClose>
						<Button variant='default' type='submit'>Save</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}