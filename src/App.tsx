import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button, buttonVariants} from "@/components/ui/button"
import {useEffect, useState} from "react";
import {supabase} from "@/utils/supabase.ts";
import {EditRecordingDialog} from "@/components/EditRecordingDialog.tsx";
import {AddRecordingDialog} from "@/components/AddRecordingDialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {LoginDialog} from "@/components/LoginDialog.tsx";
import {Recording, tagTypes} from "@/lib/types.ts";
import {
	ExitIcon,
	ExternalLinkIcon,
	HamburgerMenuIcon,
	Pencil2Icon,
	PlusCircledIcon,
	TrashIcon
} from "@radix-ui/react-icons";
import {useAuth} from "@/context/AuthProvider.tsx";
import {RemoveRecordingDialog} from "@/components/RemoveRecordingDialog.tsx";
import {LoadDataContext} from "@/context/LoadDataContext.ts";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Sheet, SheetContent, SheetHeader, SheetTrigger} from "@/components/ui/sheet.tsx";

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
	const [tagFilter, setTagFilter] = useState<string>('All')

	const loadData = async () => {
		const {data} = await supabase
			.from('recordings')
			.select()
			.order('date', {ascending: false})

		setRecordings(data || [])
	}

	useEffect(() => {
		loadData()
	}, [])

	const filteredRecordings = recordings.filter((item) => {
		return (item.title.toLowerCase().includes(searching.toLowerCase()) || item.description.toLowerCase().includes(searching.toLowerCase())) && (tagFilter === 'All' || (item.tags && item.tags.includes(tagFilter)))
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
		<LoadDataContext.Provider value={loadData}>
			<div className='lg:p-24 p-8'>
				<div className='w-full flex justify-between p-2'>
					<div className='flex flex-col'>
						<h1 className='text-2xl font-semibold my-4'>CodersLab recordings</h1>
						<p className='text-sm text-gray-300'>Logged as: {user ? user.email : 'Guest'}</p>
						<p className='text-sm text-gray-300'>Recordings
							count: {filteredRecordings.length} from {recordings.length}</p>
					</div>
					<Tabs defaultValue='All' className='md:w-[400px] md:flex justify-center items-end hidden '>
						<TabsList>
							<TabsTrigger value='All' onClick={() => setTagFilter('All')}>All</TabsTrigger>
							{tagTypes.map((tag, index) => (
								<TabsTrigger key={index} value={tag} onClick={() => setTagFilter(tag)}>{tag}</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
					<div className='flex flex-col-reverse justify-between lg:flex-row gap-2 items-end'>
						<Input type='search' placeholder='Searching ...' value={searching}
							   onChange={(e) => setSearching(e.target.value)}/>
						<div className='hidden lg:flex'>
						{user
							? (<>
								{logout &&
                                    <Button onClick={() => logout()} variant='outline'>Logout</Button>
								}
								<Button onClick={() => setIsAddDialogOpen(!isAddDialogOpen)}>
									<PlusCircledIcon className='mr-2 h-4 w-4'/>Add new
								</Button>
							</>)
							: <Button onClick={() => setIsLoginDialogOpen(!isLoginDialogOpen)}>Login</Button>
						}
						</div>
						<Sheet>
							<SheetTrigger className='lg:hidden'>
								<HamburgerMenuIcon className='h-6 w-6'/>
							</SheetTrigger>
							<SheetContent>
								<SheetHeader>Menu</SheetHeader>
								<div className='flex flex-col items-start pt-24'>
								{user
									? (<>
										<Button onClick={() => setIsAddDialogOpen(!isAddDialogOpen)} variant='link'>
											<PlusCircledIcon className='mr-2 h-4 w-4'/>Add new
										</Button>
										{logout &&
                                            <Button onClick={() => logout()} variant='link'>
												<ExitIcon className='mr-2 h-4 w-4' />Logout</Button>
										}
									</>)
									: <Button onClick={() => setIsLoginDialogOpen(!isLoginDialogOpen)} variant='link'>Login</Button>
								}
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
				<div className='w-full grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
					{filteredRecordings.map((item) => (
							<Card key={item.id} className='m-2 flex flex-col justify-between'>
								<CardHeader>
									<CardTitle className='flex justify-between'>
										<div>{item.title}</div>
										<div className='text-sm text-gray-400'>{item.date}</div>
									</CardTitle>
									{item.lector &&
                                        <CardDescription>
                                            Lector: {item.lector}
                                        </CardDescription>
									}
								</CardHeader>
								<CardContent>
									{item.description}
								</CardContent>
								<CardFooter className={`${item.tags ? 'justify-between' : 'justify-end'} p-6`}>
									{item.tags &&
                                        <div>
											{item.tags.map((tag) => (
												<span key={tag}
													  className='bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full'>{tag}</span>
											))}
                                        </div>
									}
									{user && (
										<div className='flex gap-2'>
											<Button variant='destructive' size='icon'
													onClick={() => handleRemoveRecord(item)}
											><TrashIcon/></Button>
											<Button size='icon' variant='secondary'
													onClick={() => handleEditRecord(item)}><Pencil2Icon/></Button>
											{item.url
												? (<a className={buttonVariants({variant: "default"})} href={item.url}
													  target='_blank'>Show me<ExternalLinkIcon
													className='ml-2 h-4 w-4'/></a>)
												: null
											}
										</div>
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
                <RemoveRecordingDialog recording={removeRecording} isOpen={isRemoveDialogOpen}
                                       onOpenChange={() => setRemoveDialogOpen(!isRemoveDialogOpen)}/>}
		</LoadDataContext.Provider>
	)
}