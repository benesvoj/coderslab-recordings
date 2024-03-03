import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button, buttonVariants} from "@/components/ui/button"
import {useEffect, useState} from "react";
import {supabase} from "@/utils/supabase.ts";
import {EditRecordingDialog} from "@/components/EditRecordingDialog.tsx";
import {AddRecordingDialog} from "@/components/AddRecordingDialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {LoginDialog} from "@/components/LoginDialog.tsx";
import {Recording} from "@/lib/types.ts";
import {ExternalLinkIcon, Pencil2Icon, PlusCircledIcon, TrashIcon} from "@radix-ui/react-icons";
import {useAuth} from "@/context/AuthProvider.tsx";
import {RemoveRecordingDialog} from "@/components/RemoveRecordingDialog.tsx";

export const App = () => {
	const auth = useAuth()

	const user = auth ? auth.user : null
	const logout = auth ? auth.logout : null

	const [recordings, setRecordings] = useState<Recording[]>([])
	const [searching, setSearching] = useState<string>('')
	const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
	const [isLoginDialogOpen, setIsLoginDialogOpen] = useState<boolean>(false)
	const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
	const [editRecording, setEditRecording] = useState<Recording | null>(null)
	const [isRemoveDialogOpen, setRemoveDialogOpen] = useState<boolean>(false)
	const [removeRecording, setRemoveRecording] = useState<Recording | null>(null)

	useEffect(() => {
		const loadData = async () => {
			const {data} = await supabase
				.from('recordings')
				.select()
				.order('date', {ascending: false})

			setRecordings(data || [])
		}
		loadData()
	}, [])

	const filteredRecordings = recordings.filter((item) => {
		return item.title.toLowerCase().includes(searching.toLowerCase())
	})

	const handleEditRecord = (item: Recording) => {
		setEditRecording(item)
		setIsEditDialogOpen(!isEditDialogOpen)
	}

	const handleRemoveRecord = async (item: Recording) => {
		setRemoveRecording(item)
		setRemoveDialogOpen(!isRemoveDialogOpen)
	}

	return (
		<>
			<div className='p-24'>
				<div className='w-full flex justify-between p-2'>
					<h1 className='text-2xl font-semibold my-4'>CodersLab recordings</h1>
					<div className='flex gap-4 items-center'>
						<Input type='search' placeholder='Searching ...' value={searching}
							   onChange={(e) => setSearching(e.target.value)}/>
						{user
							? (<>
								<Button onClick={() => setIsAddDialogOpen(!isAddDialogOpen)}>
									<PlusCircledIcon className='mr-2 h-4 w-4'/>Add new
								</Button>
								{logout &&
                                    <Button onClick={() => logout()}>Logout</Button>
								}
							</>)
							: <Button onClick={() => setIsLoginDialogOpen(!isLoginDialogOpen)}>Login</Button>
						}
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
									{user && (
										<>
											<Button variant='destructive' size='icon'
													onClick={() => handleRemoveRecord(item)}
											><TrashIcon /></Button>
											<Button size='icon' variant='secondary'
													onClick={() => handleEditRecord(item)}><Pencil2Icon/></Button>
											{item.url
												? (<a className={buttonVariants({variant: "default"})} href={item.url}
													  target='_blank'>Show me<ExternalLinkIcon
													className='ml-2 h-4 w-4'/></a>)
												: null
											}
										</>
									)}
								</CardFooter>
							</Card>
						)
					)}
				</div>
			</div>
			{isLoginDialogOpen &&
                <LoginDialog isOpen={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}/>
			}
			{isAddDialogOpen &&
                <AddRecordingDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}/>
			}
			{isEditDialogOpen && editRecording &&
                <EditRecordingDialog recording={editRecording} isOpen={isEditDialogOpen}
                                     onOpenChange={() => setIsEditDialogOpen(!isEditDialogOpen)}/>}
			{isRemoveDialogOpen && removeRecording &&
				<RemoveRecordingDialog recording={removeRecording} isOpen={isRemoveDialogOpen} onOpenChange={() => setRemoveDialogOpen(!isRemoveDialogOpen)} />}
		</>
	)
}