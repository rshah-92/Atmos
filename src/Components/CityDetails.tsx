import Typography from "@material-ui/core/Typography"
import { getTime } from "../Helpers/getTime"
import Skeleton from "@material-ui/lab/Skeleton"
import { queryClient } from "../main"
import { locationType, weatherType } from "../Helpers/types"

const options = {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	timeZoneName: "short",
}

const CityDetails = ({ loading }: { loading: boolean }) => {
	const weatherData = queryClient.getQueryState<weatherType>(["weather"])
	const locationData = queryClient.getQueryState<locationType>(["location"])

	const timezone = weatherData?.data?.timezone ?? "Asia/Kolkata"
	const cityName = locationData?.data?.features?.[0]?.text ?? "City"
	const fullCity = locationData?.data?.features?.[0]?.place_name ?? "Country"

	return (
		<section className="city-details">
			<Typography variant="h5" gutterBottom component="h1">
				{loading ? <Skeleton animation="wave" width={200} /> : cityName}
			</Typography>
			<Typography variant="body2">
				{loading ? <Skeleton animation="wave" width={150} /> : fullCity}
			</Typography>
			<Typography variant="caption" component="p">
				{loading ? (
					<Skeleton animation="wave" width={260} />
				) : (
					getTime(options, timezone, Date.now() / 1000)
				)}
			</Typography>
		</section>
	)
}

export default CityDetails
