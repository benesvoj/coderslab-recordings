import {mockData as data} from './utils/mockData'
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {buttonVariants} from "@/components/ui/button"
import {Link} from "react-router-dom";
import {useState} from "react";

export const App = () => {
	const [recordings, setRecordings] = useState([])

	return (
		<div className='p-24'>
			<h1 className='text-2xl font-semibold my-4'>CodersLab recordings</h1>
			<div className='w-full grid grid-cols-2'>
				{data.map((item) => (
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
						<CardFooter className='flex justify-end'>
							<Link
								className={buttonVariants({variant: "default"})}
								to={item.url}>Show me</Link>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	)
}