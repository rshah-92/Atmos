import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Skeleton from "@material-ui/lab/Skeleton"
import { getTime, tellMeRain } from "../Helpers/getTime"
import { queryClient } from "../main"
import { weatherType } from "../Helpers/types"

const options = {
	timeStyle: "short",
}
const Stats = ({ loading }: { loading: boolean }) => {
	const weatherData = queryClient.getQueryState<weatherType>(["weather"])
	const timezone = weatherData?.data?.timezone ?? "Asia/Kolkata"
	const minutely = weatherData?.data?.minutely ?? []
	const current = weatherData?.data?.current ?? {}
	const daily = weatherData?.data?.daily ?? []

	return (
		<section className="current-stats">
			{loading ? (
				<Skeleton animation="wave" />
			) : (
				<Typography variant="body2" align="center" color="textSecondary">
					{minutely ? tellMeRain(minutely) : `No Precipitation Data`}
				</Typography>
			)}
			{loading ? (
				<Skeleton variant="rect" animation="wave" height={240} />
			) : (
				<Paper elevation={0}>
					<div className="weather-stats">
						<div className="weather_stats-row1">
							<div className="stats-card">
								<i className="wi wi-fw wi-sunrise"></i>
								<div>
									<Typography
										variant="caption"
										component="p"
										color="textSecondary"
									>
										Sunrise
									</Typography>
									<Typography variant="subtitle2" component="span">
										{getTime(options, timezone, current.sunrise)}
									</Typography>
								</div>
							</div>
							<div className="stats-card">
								<i
									className={`wi wi-fw ${
										current.snow?.["1h"]
											? "wi-snow"
											: current.rain?.["1h"]
											? "wi-rain"
											: "wi-barometer"
									}`}
								></i>
								<div>
									<Typography
										variant="caption"
										component="p"
										color="textSecondary"
									>
										{current.snow?.["1h"]
											? "Snow"
											: current.rain?.["1h"]
											? "Rain"
											: "Pressure"}
									</Typography>
									<Typography variant="subtitle2" component="span">
										{current.snow?.["1h"]
											? `${current.snow["1h"]} mm`
											: current.rain?.["1h"]
											? `${current.rain["1h"]} mm`
											: `${current.pressure} hPa`}
									</Typography>
								</div>
							</div>
							<div className="stats-card">
								<i className="wi wi-fw wi-cloudy "></i>
								<div>
									<Typography
										variant="caption"
										component="p"
										color="textSecondary"
									>
										Clouds
									</Typography>
									<Typography variant="subtitle2" component="span">
										{current.clouds}%
									</Typography>
								</div>
							</div>
							<div className="stats-card">
								<i className="wi wi-fw wi-humidity"></i>
								<div>
									<Typography
										variant="caption"
										component="p"
										color="textSecondary"
									>
										Humidity
									</Typography>
									<Typography variant="subtitle2" component="span">
										{current.humidity}%
									</Typography>
								</div>
							</div>
						</div>
						<div className="weather_stats-row2">
							<div className="stats-card">
								<i className="wi wi-fw wi-sunset"></i>
								<div>
									<Typography
										variant="caption"
										component="p"
										color="textSecondary"
									>
										Sunset
									</Typography>
									<Typography variant="subtitle2" component="span">
										{getTime(options, timezone, current.sunset)}
									</Typography>
								</div>
							</div>
							<div className="stats-card">
								<i className="wi wi-fw wi-strong-wind"></i>
								<div>
									<Typography
										variant="caption"
										component="p"
										color="textSecondary"
									>
										Wind
									</Typography>
									<Typography variant="subtitle2" component="span">
										{current.wind_speed} m/s
									</Typography>
								</div>
							</div>
							<div className="stats-card">
								<i className="wi wi-fw wi-raindrops"></i>
								<div>
									<Typography
										variant="caption"
										component="p"
										color="textSecondary"
									>
										Precipitation
									</Typography>
									<Typography variant="subtitle2" component="span">
										{Math.round(daily[0].pop * 100)}%
									</Typography>
								</div>
							</div>
							<div className="stats-card">
								<i className="wi wi-fw wi-umbrella"></i>
								<div>
									<Typography
										variant="caption"
										component="p"
										color="textSecondary"
									>
										UV Index
									</Typography>
									<Typography variant="subtitle2" component="span">
										{current.uvi}
									</Typography>
								</div>
							</div>
						</div>
					</div>
				</Paper>
			)}
		</section>
	)
}

export default Stats
