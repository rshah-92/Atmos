export const getTime = (op: any, timezone: string, time: number) => {
	if (time) {
		return new Date(time * 1000).toLocaleString("en-US", {
			...op,
			timeZone: timezone,
		})
	} else return "Unknown"
}
export const getDay = (op: any, timezone: string, time: number) => {
	if (
		new Date(time * 1000).toLocaleString("en-US", {
			day: "2-digit",
			timeZone: timezone,
		}) ==
		new Date(Date.now()).toLocaleString("en-US", {
			day: "2-digit",
			timeZone: timezone,
		})
	)
		return "Today"
	return new Date(time * 1000).toLocaleString("en-US", {
		...op,
		timeZone: timezone,
	})
}

export const getIfDay = (sunrise: number, sunset: number) => {
	return Date.now() > sunrise * 1000 && Date.now() < sunset * 1000
}

export const setBodyClass = (id: string, time: boolean) => {
	if (id == "800") {
		time
			? (document.body.className = "clear-day")
			: (document.body.className = "clear-night")
		return
	}
	let className = ""
	switch (id[0]) {
		case "2":
			className = "thunderstorm"
			break
		case "3":
			className = "drizzle"
			break
		case "5":
			className = "rain"
			break
		case "6":
			className = "snow"
			break
		case "7":
			className = "atmosphere"
			break
		case "8":
			if (time) className = "clouds-day"
			else className = "clouds-night"
			break
		default:
			className = "drizzle"
			break
	}
	document.body.className = className
}
const getMinutes = (now: number, dt: number) => {
	return Math.ceil((dt - now / 1000) / 60)
}
export const tellMeRain = (minutely: any) => {
	const rainTime = minutely.filter((i: any) => i.precipitation)
	if (rainTime.length === 0) return `No Precipitation within an Hour`
	if (rainTime.length === 61) return `Precipitation won't end within an Hour`
	if (minutely[0].precipitation)
		return `Precipitation will end within ${getMinutes(
			Date.now(),
			rainTime[rainTime.length - 1].dt
		)} Minutes`
	return `Precipitation will start in ${getMinutes(
		Date.now(),
		rainTime[0].dt
	)} Minutes`
}
