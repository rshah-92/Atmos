import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import { makeStyles } from "@material-ui/core"
import Divider from "@material-ui/core/Divider"
import Typography from "@material-ui/core/Typography"
import Skeleton from "@material-ui/lab/Skeleton"
import { getTime } from "../Helpers/getTime"
import { queryClient } from "../main"
import { weatherType } from "../Helpers/types"

const useStyles = makeStyles({
	tab: {
		minWidth: "76px",
	},
	indicator: {
		display: "none",
	},
	dividerTop: {
		margin: "1rem 0 0.6rem 0",
	},
	dividerBottom: {
		margin: "0.6rem 0 1rem 0",
	},
})

const HourlyWeather = ({ loading }: { loading: boolean }) => {
	const weatherData = queryClient.getQueryState<weatherType>(["weather"])
	const timezone = weatherData?.data?.timezone ?? "Asia/Kolkata"
	const hourly = weatherData?.data?.hourly ?? []

	const classes = useStyles()
	return (
		<>
			<Divider classes={{ root: classes.dividerTop }} />
			<section className="hourly-display">
				{loading ? (
					<Skeleton variant="rect" height={89} animation="wave" />
				) : (
					<Tabs
						classes={{ indicator: classes.indicator }}
						value={0}
						variant="scrollable"
						scrollButtons="auto"
						aria-label="Daily Weather Tabs"
					>
						{hourly.map((i: any) => (
							<Tab
								key={i.dt}
								classes={{ root: classes.tab }}
								disableRipple
								label={
									<>
										<Typography variant="caption">
											{getTime(
												{ hour: "2-digit", hourCycle: "h12" },
												timezone,
												i.dt
											)}{" "}
											/ {getTime({ day: "2-digit" }, timezone, i.dt)}
										</Typography>

										<i
											className={`wi wi-fw wi-owm${
												i.weather[0].icon.includes("n") ? "-night" : ""
											}-${i.weather[0].id} hourly-icon`}
										></i>
										<Typography variant="button" color="inherit">
											{Math.round(i.temp)}&deg;
										</Typography>
									</>
								}
							/>
						))}
					</Tabs>
				)}
			</section>
			<Divider classes={{ root: classes.dividerBottom }} />
		</>
	)
}

export default HourlyWeather
