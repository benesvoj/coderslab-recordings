import {supabase} from "@/utils/config.tsx";

export const fetchRecordings = async () => {
	const {data, error} = await supabase
		.from('recordings')
		.select()

	return data
}
