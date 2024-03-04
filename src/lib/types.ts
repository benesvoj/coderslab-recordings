export interface Recording {
	id: string
	title: string
	description: string
	url: string
	date: string
	lector: string
	tags?: string[] | null
}

export const tagTypes = ['React', 'Vanila JS', 'HTML/CSS']