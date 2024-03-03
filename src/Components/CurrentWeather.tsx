import { makeStyles } from "@material-ui/core"
import Divider from "@material-ui/core/Divider"
import Typography from "@material-ui/core/Typography"
import KeyboardArrowDownRoundedIcon from "@material-ui/icons/KeyboardArrowDownRounded"
import KeyboardArrowUpRoundedIcon from "@material-ui/icons/KeyboardArrowUpRounded"
import Skeleton from "@material-ui/lab/Skeleton"
import { getIfDay } from "../Helpers/getTime"
import { queryClient } from "../main"
import { weatherType } from "../Helpers/types"

const useStyles = makeStyles({
	currentWeather: {
		marginTop: 10,
	},
	divider: {
		margin: "1rem 0",
	},
})

const CurrentWeathter = ({ loading }: { loading: boolean }) => {
	const weatherData = queryClient.getQueryState<weatherType>(["weather"])
	const daily = weatherData?.data?.daily ?? []
	const current = weatherData?.data?.current ?? {}
	const classes = useStyles()
	return (
		<>
			<section className="current-weather">
				<div>
					{loading ? (
						<Skeleton animation="wave" height={122} width={120}>
							<Typography variant="h1" component="p">
								.
							</Typography>
						</Skeleton>
					) : (
						<Typography
							variant="h1"
							component="p"
							className={classes.currentWeather}
						>
							{Math.round(current.temp)}&deg;
						</Typography>
					)}
					<div className="low-high">
						{loading ? (
							<Skeleton animation="wave" width={25} />
						) : (
							<Typography variant="caption">
								<KeyboardArrowDownRoundedIcon
									color="disabled"
									fontSize="small"
								/>
								{Math.round(daily[0].temp.min)}&deg;
							</Typography>
						)}
						{loading ? (
							<Skeleton animation="wave" width={25} />
						) : (
							<Typography variant="caption">
								<KeyboardArrowUpRoundedIcon color="disabled" fontSize="small" />
								{Math.round(daily[0].temp.max)}&deg;
							</Typography>
						)}
					</div>
					{loading ? (
						<Skeleton animation="wave" width={50} />
					) : (
						<Typography variant="body2">{current.weather[0].main}</Typography>
					)}
					{loading ? (
						<Skeleton animation="wave" />
					) : (
						<Typography variant="caption" color="textSecondary">
							Feels like {Math.round(current.feels_like)}&deg;
						</Typography>
					)}
				</div>
				<div className="current-icon">
					{loading ? (
						<Skeleton
							component="i"
							animation="wave"
							variant="circle"
							width={100}
							height={100}
						>
							<i className="wi wi-moon-full"></i>
						</Skeleton>
					) : (
						<i
							className={`wi wi-owm${
								!getIfDay(current.sunrise, current.sunset) ? "-night" : ""
							}-${current.weather[0].id}`}
						></i>
					)}
					{loading ? (
						<Skeleton width={80} animation="wave" />
					) : (
						<Typography
							color="textSecondary"
							variant="caption"
							className="weather-desc"
						>
							{current.weather[0].description}
						</Typography>
					)}
				</div>
			</section>
			<Divider classes={{ root: classes.divider }} />
		</>
	)
}

export default CurrentWeathter
