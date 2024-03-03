import Typography from "@material-ui/core/Typography"
import Link from "@material-ui/core/Link"
import Divider from "@material-ui/core/Divider"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
	divider: {
		width: "60%",
		margin: "1rem 0",
		marginInline: "auto",
	},
})

const Footer = () => {
	const classes = useStyles()
	return (
		<>
			<Divider classes={{ root: classes.divider }} />
			<Typography
				variant="caption"
				align="center"
				color="textSecondary"
				component="footer"
			>
				Developed by{" "}
				<Link
					color="textSecondary"
					underline="always"
					href="https://github.com/AnilSeervi"
					rel="noopener noreferrer"
				>
					Anil Seervi
				</Link>
			</Typography>
		</>
	)
}

export default Footer
