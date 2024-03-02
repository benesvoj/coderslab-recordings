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
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {ChangeEvent, useState} from "react";
import {supabase} from "@/utils/supabase.ts";

const recording = {
	title: '',
	description: '',
	url: '',
	date: ''
}

export const AddRecordingDialog = () => {

	const [value, setValue] = useState(recording)

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue({...value, [e.target.name]: e.target.value})
	}

	const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setValue({...value, [e.target.name]: e.target.value})
	}

	const handleSubmit = async () => {
		console.log(value)
		const {data} = await supabase
			.from('recordings')
			.insert({title: value.title, description: value.description, url: value.url, date: value.date})

		console.log(data)
	}

	return (
		<Dialog>
			<DialogTrigger>
				<Button variant='default'>Add new</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add new recording</DialogTitle>
				</DialogHeader>
				<form className="grid gap-4 py-4" onSubmit={handleSubmit}>
					<div className="flex flex-col gap-2">
						<Label htmlFor="title" className='text-sm text-gray-400'>
							Title
						</Label>
						<Input
							id="title"
							name="title"
							value={value.title}
							className="col-span-3"
							onChange={handleChange}/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="url" className='text-sm text-gray-400'>
							Link
						</Label>
						<Input id="url" name="url" value={value.url} className="col-span-3" onChange={handleChange}/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor='description' className='text-sm text-gray-400'>Description</Label>
						<Textarea
							id='description'
							name="description"
							value={value.description}
							className="col-span-3"
							rows={6} onChange={handleTextAreaChange}/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="date" className='text-sm text-gray-400'>
							Recording Date
						</Label>
						<Input id="date" value={value.date} name="date" type='date' onChange={handleChange}/>
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