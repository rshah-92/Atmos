import React, { useContext, useState } from "react"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core"
import { getDay } from "../Helpers/getTime"
import DailyStats from "./DailyStats"
import Skeleton from "@material-ui/lab/Skeleton"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { queryClient } from "../main"
import { weatherType } from "../Helpers/types"

const useStyles = makeStyles({
	root: {
		boxShadow: "none",
		"&:before": {
			display: "none",
		},
		"&$expanded": {
			margin: "auto",
		},
	},
	expanded: {},
	accordSumRoot: {
		minHeight: 46,
		padding: 0,
		"&$expanded": {
			minHeight: 46,
		},
	},
	accordSumContent: {
		justifyContent: "space-between",
		"&$expanded": {
			margin: "12px 0",
		},
	},
	accordDetailsRoot: {
		display: "block",
		padding: 8,
	},
	padding: {
		padding: "0",
		marginRight: 0,
	},
})
const options = {
	weekday: "long",
}
const DailyAccord = ({ loading }: { loading: boolean }) => {
	const weatherData = queryClient.getQueryState<weatherType>(["weather"])
	const daily = weatherData?.data?.daily ?? []
	const timezone = weatherData?.data?.timezone ?? "Asia/Kolkata"
	const classes = useStyles()

	const [expanded, setExpanded] = useState<string | null>()
	const handleChange =
		(panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
			setExpanded(newExpanded ? panel : null)
		}
	return (
		<section className="daily-accord">
			{loading ? (
				<Skeleton variant="rect" height={46 * 8} animation="wave" />
			) : (
				daily.map((day: any, i: number) => (
					<Accordion
						classes={{ root: classes.root, expanded: classes.expanded }}
						key={day.dt}
						expanded={expanded === `panel${i}`}
						onChange={handleChange(`panel${i}`)}
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon color="disabled" fontSize="small" />}
							classes={{
								root: classes.accordSumRoot,
								content: classes.accordSumContent,
								expanded: classes.expanded,
								expandIcon: classes.padding,
							}}
						>
							<Typography variant="subtitle2" component="p">
								{getDay(options, timezone, day.dt)}
							</Typography>

							<div className="daily-icons">
								<div>
									<i className={`wi wi-owm-${day.weather[0].id}`}></i>
									{day.weather[0].main == "Rain" && (
										<Typography
											variant="caption"
											className="if-rain"
											color="textSecondary"
										>
											{Math.round(day.pop * 100)}%
										</Typography>
									)}
								</div>
								<div className="accord-max-min">
									<Typography variant="subtitle2" component="p">
										{Math.round(day.temp.max)}
									</Typography>
									<Typography variant="caption" color="textSecondary">
										{Math.round(day.temp.min)}
									</Typography>
								</div>
							</div>
						</AccordionSummary>
						<AccordionDetails classes={{ root: classes.accordDetailsRoot }}>
							<DailyStats day={day} loading={loading} />
						</AccordionDetails>
					</Accordion>
				))
			)}
		</section>
	)
}

export default DailyAccord
