import React, { useCallback, useEffect, useState } from "react"
import { createMuiTheme, ThemeProvider } from "@material-ui/core"
import CssBaseline from "@material-ui/core/CssBaseline"
import Snackbar from "@material-ui/core/Snackbar"
import Typography from "@material-ui/core/Typography"
import Search from "./Components/Search"
import Stats from "./Components/Stats"
import DailyAccord from "./Components/DailyAccord"
import CityDetails from "./Components/CityDetails"
import CurrentWeathter from "./Components/CurrentWeather"
import { getIfDay, setBodyClass } from "./Helpers/getTime"
import HourlyWeather from "./Components/HourlyWeather"
import "./index.css"
import Footer from "./Components/Footer"
import { queryClient } from "./main"
import { londonCity, londonGeo } from "./Helpers/constants"
import { locationType, weatherType } from "./Helpers/types"

const fetchData = async (uri: string) => {
	const res = await fetch(uri)
	if (!res.ok) {
		const message = await res.json()
		throw new Error(message.message)
	}
	const data = await res.json()
	return data
}

const defaultWeatherData = {
	current: {},
	hourly: [],
	daily: [],
	timezone: "Asia/Kolkata",
	minutely: [],
	lat: 51.5074,
	lon: 0.1278,
}

const theme = createMuiTheme({
	overrides: {
		MuiCssBaseline: {
			"@global": {
				body: {
					margin: "1rem 0",
				},
			},
		},
	},
	palette: {
		type: "dark",
		primary: {
			main: "#fff",
		},
		secondary: {
			main: "rgba(150,150,150,0.2)",
		},
		background: {
			paper: "transparent",
		},
	},
	typography: {
		fontFamily: "'Montserrat', sans-serif",
		h1: {
			fontWeight: 500,
		},
	},
})

function App() {
	const [err, setErr] = useState(null)
	const [snackbar, setSnackbar] = useState(false)
	const [loading, setLoading] = useState(true)

	const success = async (pos: GeolocationPosition) => {
		localStorage.setItem("gps-granted", String(true))
		onecall(pos.coords.latitude, pos.coords.longitude)
		try {
			const data = await queryClient.fetchQuery(["location"], () =>
				fetch(
					`${import.meta.env.VITE_MAPBOX_URL}${pos.coords.longitude},${
						pos.coords.latitude
					}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}${
						import.meta.env.VITE_MAPBOX_OPTIONS
					}`
				).then(res => res.json())
			)
			localStorage.setItem(
				"city",
				JSON.stringify({
					city: data.features[0].text,
					fullcity: data.features[0].place_name,
				})
			)
		} catch (err: any) {
			console.log(err)
		}
	}

	const error = useCallback(() => {
		localStorage.removeItem("gps-granted")
	}, [])

	const getGeoLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(success, error, {
				enableHighAccuracy: true,
			})
		}
	}

	useEffect(() => {
		queryClient.setQueryData(["location"], () => {
			const data = JSON.parse(
				localStorage.getItem("city") || JSON.stringify(londonCity)
			)
			return { features: [{ text: data.city, place_name: data.fullcity }] }
		})
		if (localStorage.getItem("gps-granted")) {
			getGeoLocation()
		}

		const geo = JSON.parse(
			localStorage.getItem("geo") || JSON.stringify(londonGeo)
		)
		const lat = geo.lat
		const lon = geo.lon

		onecall(lat, lon)
	}, [])

	const onecall = useCallback(async (lat: number, lon: number) => {
		setLoading(true)
		try {
			const data = await queryClient.fetchQuery(["weather"], () =>
				fetch(`${import.meta.env.VITE_ONECALL_URL}lat=${lat}&lon=${lon}`).then(
					res => res.json()
				)
			)
			setBodyClass(
				data.current.weather[0].id.toString(),
				getIfDay(data.current.sunrise, data.current.sunset)
			)
			localStorage.setItem(
				"geo",
				JSON.stringify({ lat: data.lat, lon: data.lon })
			)
			setLoading(false)
			setErr(null)
		} catch (err: any) {
			setLoading(false)
			setErr(err.message)
			console.log(err)
		}
	}, [])

	const data = queryClient.getQueryData<weatherType>(["weather"])
	const weatherData = data || defaultWeatherData

	const handleRefresh = () => {
		const lat = weatherData.lat
		const lon = weatherData.lon
		onecall(lat, lon)
	}

	const locationData = queryClient.getQueryData<locationType>(["location"])
	const cityName = locationData?.features[0]?.text || "London"

	const handleSearch = async (
		e: React.FormEvent<HTMLFormElement>,
		inpRef: React.RefObject<HTMLInputElement>
	) => {
		e.preventDefault()
		if (
			inpRef.current!.value.trim() === "" ||
			inpRef.current!.value.toLowerCase() === cityName.toLowerCase()
		)
			return
		try {
			setLoading(true)
			const data = await queryClient.fetchQuery(["location"], () =>
				fetch(
					`${import.meta.env.VITE_MAPBOX_URL}${encodeURIComponent(
						inpRef.current!.value
					)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}${
						import.meta.env.VITE_MAPBOX_OPTIONS
					}`
				).then(res => res.json())
			)
			inpRef.current!.blur()
			if (data.features.length === 0) {
				queryClient.setQueryData(["location"], () => {
					const data = JSON.parse(
						localStorage.getItem("city") || JSON.stringify(londonCity)
					)
					return {
						features: [{ text: data.city, place_name: data.fullcity }],
					}
				})
				setSnackbar(true)
				setLoading(false)
			} else {
				onecall(data.features[0].center[1], data.features[0].center[0])
				localStorage.setItem(
					"city",
					JSON.stringify({
						city: data.features[0].text,
						fullcity: data.features[0].place_name,
					})
				)
			}
		} catch (err) {
			setLoading(false)
			console.log(err)
		}
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<main>
				<Search
					search={handleSearch}
					refresh={handleRefresh}
					geo={getGeoLocation}
				/>
				{err ? (
					<Typography align="center" style={{ marginTop: "1rem" }}>
						{err}
					</Typography>
				) : (
					<>
						<CityDetails loading={loading} />
						<CurrentWeathter loading={loading} />
						<Stats loading={loading} />
						<HourlyWeather loading={loading} />
						<DailyAccord loading={loading} />
						<Footer />
					</>
				)}
			</main>
			<Snackbar
				open={snackbar}
				autoHideDuration={5000}
				onClose={() => setSnackbar(false)}
				message="No Such City Found"
			/>
		</ThemeProvider>
	)
}

export default App
