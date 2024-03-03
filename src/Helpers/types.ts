export interface weatherType {
	current: any
	daily: any
	hourly: any
	timezone: string
	lat: number
	lon: number
	minutely: any
}

export type city = {
	cityName: string
	fullCity: string
	timezone: string
}

type location = {
	center: [number, number]
	place_name: string
	text: string
}

export type locationType = {
	features: location[]
}

export interface searchProps {
	refresh: () => void
	geo: () => void
	search: (
		e: React.FormEvent<HTMLFormElement>,
		inpRef: React.RefObject<HTMLInputElement>
	) => void
}
