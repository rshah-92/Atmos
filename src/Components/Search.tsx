import React, { useState, useRef } from "react"
import { makeStyles } from "@material-ui/core"
import InputBase from "@material-ui/core/InputBase"
import Divider from "@material-ui/core/Divider"
import SearchRoundedIcon from "@material-ui/icons/SearchRounded"
import AutorenewRoundedIcon from "@material-ui/icons/AutorenewRounded"
import GpsFixedRoundedIcon from "@material-ui/icons/GpsFixedRounded"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import { searchProps } from "../Helpers/types"

const useStyles = makeStyles({
	root: {
		display: "flex",
		alignItems: "center",
	},
	searchIcon: {
		marginLeft: "-10px",
	},
	input: {
		flex: 1,
	},
	dividerVerti: {
		height: 28,
		margin: 4,
	},
})

const Search = ({ search, refresh, geo }: searchProps) => {
	const classes = useStyles()
	const searchRef = useRef<HTMLInputElement>(null!)
	const [searchInp, setSearchInp] = useState(() => "")
	return (
		<>
			<header>
				<form
					className={classes.root}
					autoComplete="off"
					onSubmit={e => {
						setSearchInp("")
						search(e, searchRef)
					}}
				>
					<InputBase
						type="search"
						className={classes.input}
						inputRef={searchRef}
						value={searchInp}
						onChange={e => setSearchInp(e.target.value)}
						placeholder="Search Your City"
						inputProps={{ "aria-label": "search city" }}
						startAdornment={
							<InputAdornment position="end">
								<IconButton
									disabled
									className={classes.searchIcon}
									aria-label="Search Weather"
								>
									<SearchRoundedIcon />
								</IconButton>
							</InputAdornment>
						}
					/>
					<div className={classes.root}>
						<IconButton
							aria-label="Refresh Search"
							title="Refresh"
							onClick={refresh}
						>
							<AutorenewRoundedIcon />
						</IconButton>
						<Divider className={classes.dividerVerti} orientation="vertical" />
						<IconButton
							onClick={geo}
							aria-label="GPS Search"
							title="GPS Search"
						>
							<GpsFixedRoundedIcon />
						</IconButton>
					</div>
				</form>
			</header>
			<Divider />
		</>
	)
}

export default Search
