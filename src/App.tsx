import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {buttonVariants} from "@/components/ui/button"
import {useEffect, useState} from "react";
import {supabase} from "@/utils/supabase.ts";
import {EditRecordingDialog} from "@/components/EditRecordingDialog.tsx";
import {AddRecordingDialog} from "@/components/AddRecordingDialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {LoginDialog} from "@/components/LoginDialog.tsx";

export interface Recording {
	id: string
	title: string
	description: string
	url: string
	date: string
}

export const App = () => {

	const [recordings, setRecordings] = useState<Recording[]>([])
	const [searching, setSearching] = useState<string>('')

	useEffect(() => {
		const loadData = async () => {
			const {data} = await supabase
				.from('recordings')
				.select()
				.order('date')

			setRecordings(data || [])
		}
		loadData()
	}, [])


	const filteredRecordings = recordings.filter((item) => {
		return item.title.toLowerCase().includes(searching.toLowerCase())
	})

	return (
		<div className='p-24'>
			<div className='w-full flex justify-between p-2'>
				<h1 className='text-2xl font-semibold my-4'>CodersLab recordings</h1>
				<div className='flex gap-4 items-center'>
					<Input type='search' value={searching} onChange={(e) => setSearching(e.target.value)} />
					<AddRecordingDialog/>
					<LoginDialog />
				</div>
			</div>
			<div className='w-full grid grid-cols-2'>
				{filteredRecordings.map((item) => (
					<Card key={item.id} className='m-2'>
						<CardHeader>
							<CardTitle className='flex justify-between'>
								<div>{item.title}</div>
								<div className='text-sm text-gray-400'>{item.date}</div>
							</CardTitle>
							<CardDescription>
								{item.description}
							</CardDescription>
						</CardHeader>
						<CardFooter className='flex justify-end gap-4'>
							<EditRecordingDialog recording={item}/>
							<a
								className={buttonVariants({variant: "default"})}
								href={item.url} target='_blank'>Show me</a>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	)
}