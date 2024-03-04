export interface Recording {
	id: string
	title: string
	description: string
	url: string
	date: string
	lector: string
	tags?: string[] | null
}

export const tagTypes = ['React', 'Vanilla JS', 'HTML/CSS']