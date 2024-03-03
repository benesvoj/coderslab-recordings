import {Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Recording} from "@/lib/types.ts";
import {supabase} from "@/utils/supabase.ts";
import {useToast} from "@/components/ui/use-toast.ts";

export const RemoveRecordingDialog = ({recording, isOpen, onOpenChange}: {
	recording: Recording,
	isOpen: boolean,
	onOpenChange: (isOpen: boolean) => void
}) => {

	const {toast} = useToast()

	const handleRemoveRecoding = async () => {
		const {error} = await supabase
			.from('recordings')
			.delete()
			.eq('id', recording.id)

		if (error) {
			console.error('Error removing recording:', error)
		}

		onOpenChange(false)
		toast({description: 'Recording removed'})
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogTitle>Remove Recording</DialogTitle>
				<p>Are you sure you want to remove this recording?</p>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant='secondary'>Cancel</Button>
					</DialogClose>
					<Button variant='destructive' onClick={handleRemoveRecoding}>Remove</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}