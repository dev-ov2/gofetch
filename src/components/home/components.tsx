import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FilterIcon from "@mui/icons-material/FilterList";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  Card,
  Checkbox,
  Collapse,
  InputLabel,
  MenuItem,
  Modal,
  Popover,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import MUIAppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import styledComp from "styled-components";
import icon from "../../assets/icon.png";
import {
  Dog,
  SearchParamProps,
  fetchBreeds,
  fetchMatch,
  logoutUser,
} from "../../network/requests";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setLoginStatus,
  updateFavorites,
  updateLocation,
  updateMatch,
} from "../../store/reducer";
import store from "../../store/store";
import "./HomeComponents.css";

const paperBackground = {
  backgroundColor: "#121212",
  backgroundImage:
    "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
};

const paperBackgroundLighter = {
  backgroundColor: "#121212",
  backgroundImage:
    "linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))",
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////////////////// AppBar ////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

export const AppBar = () => {
  const mainState = useAppSelector((state) => state.main);

  const [profileAnchorEl, setProfileAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [toastState, setToastState] = useState<any>({});
  const [matchModalOpen, setMatchModalOpen] = useState<boolean>(false);

  const isMenuOpen = Boolean(profileAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const onMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const onMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const onMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const onMenuClose = () => {
    setProfileAnchorEl(null);
    onMobileMenuClose();
  };

  const showToast = (message: string, severity: AlertColor) => {
    setToastState({ message, severity, open: true });
  };

  const hideToast = () => {
    setToastState({});
  };

  const menuId = "more-options-menu";
  const renderMenu = (
    <Menu
      anchorEl={profileAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={onMenuClose}
    >
      <MenuItem
        onClick={async () => {
          onMenuClose();
          await logoutUser();
          store.dispatch(setLoginStatus(false));
        }}
      >
        Log Out
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "more-options-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={onMobileMenuClose}
    >
      <MenuItem
        onClick={async () => {
          onMenuClose();
          await logoutUser();
          store.dispatch(setLoginStatus(false));
        }}
      >
        Log Out
      </MenuItem>
    </Menu>
  );

  return (
    <Box flexGrow={1}>
      <MUIAppBar position="static">
        <Toolbar>
          <img
            alt={"icon"}
            src={icon}
            style={{ marginRight: 16, width: "48px", height: "48px" }}
          />
          <Typography
            display={{ sx: "none", sm: "block" }}
            variant="h6"
            noWrap
            component="div"
          >
            GoFetch!
          </Typography>
          <Box flexGrow={1} />
          <Box display={{ sx: "none", md: "flex" }}>
            <Button
              variant="contained"
              onClick={() => {
                if (mainState.favorites.length > 0) {
                  setMatchModalOpen(true);
                } else {
                  showToast(
                    "Please mark some puppies as your favorite first.",
                    "warning"
                  );
                }
              }}
            >
              {mainState.match ? "View my match" : "Find my match"}
            </Button>
            <Toast
              open={toastState.open}
              message={toastState.message}
              severity={toastState.severity}
              onClose={hideToast}
            />
            <IconButton
              size="large"
              edge="end"
              aria-label="show more on desktop"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={onMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box display={{ xs: "flex", md: "none" }}>
            <IconButton
              size="large"
              aria-label="show more on mobile"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={onMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </MUIAppBar>
      {renderMobileMenu}
      {renderMenu}
      <MatchModal open={matchModalOpen} setOpen={setMatchModalOpen} />
    </Box>
  );
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////////////// Filter Button  ////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

interface FilterButtonProps {
  params: SearchParamProps;
  setParams: React.Dispatch<React.SetStateAction<SearchParamProps>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const FilterButton = ({
  params,
  setParams,
  setPage,
}: FilterButtonProps) => {
  const { data: breedData } = useQuery("breeds", fetchBreeds);
  const mainState = useAppSelector((state) => state.main);

  const [filterType, setFilterType] = useState("All");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  useEffect(() => {
    if (filterType === "favorites") {
      setParams({ ...params, ids: mainState.favorites });
    } else {
      setParams({ ...params, ids: undefined });
    }
    // Otherwise, we're in a recursive loop since params is a dependent (and we update params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, mainState.favorites, setParams]);

  const handleFilterClick = (event: any) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const resetPage = () => {
    setPage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isFilterOpen = Boolean(filterAnchorEl);

  const renderFilterMenu = (
    <Popover
      open={isFilterOpen}
      anchorEl={filterAnchorEl}
      onClose={handleFilterClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box p={2} position={"relative"}>
        <Box
          position="sticky"
          p={1}
          sx={paperBackgroundLighter}
          zIndex={1}
          top={0}
        >
          <Typography variant={"subtitle1"}>Filter by</Typography>
          <Select
            inputProps={{ "data-testid": "select" }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ marginBottom: 16 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="breed">Breed</MenuItem>
            <MenuItem value="zip">Zip Codes</MenuItem>
            <MenuItem value="age">Age</MenuItem>
            <MenuItem value="favorites">Favorites</MenuItem>
          </Select>
        </Box>
        {filterType === "breed" && (
          <Box
            display="flex"
            flexDirection={"column"}
            justifyContent={"flex-start"}
          >
            {(breedData || []).map((currentBreed: string) => {
              const checked = (params.breeds || []).includes(currentBreed);
              return (
                <Box
                  key={currentBreed}
                  display={"flex"}
                  flexDirection={"row"}
                  alignItems={"center"}
                >
                  <Checkbox
                    aria-label={`Checkbox for breed ${currentBreed}`}
                    checked={checked}
                    onClick={() => {
                      const breeds = (params.breeds || []).filter(
                        (breed) => breed !== currentBreed
                      );
                      if (!checked) {
                        breeds.push(currentBreed);
                      }
                      setParams({ ...params, from: 0, breeds });
                      resetPage();
                    }}
                  />
                  <InputLabel>{currentBreed}</InputLabel>
                </Box>
              );
            })}
          </Box>
        )}
        {filterType === "age" && (
          <Box display="flex" alignItems="center" margin={2}>
            <TextField
              label="Min"
              value={params.ageMin}
              inputProps={{
                pattern: "[0-9]*",
                inputMode: "numeric",
              }}
              onChange={(e) => {
                const sanitized = e.target.value.replace(/[^0-9]/, "");
                setParams({ ...params, from: 0, ageMin: sanitized });
                resetPage();
              }}
              style={{ marginRight: 8 }}
            />
            <TextField
              label="Max"
              value={params.ageMax}
              inputProps={{
                pattern: "[0-9]*",
                inputMode: "numeric",
              }}
              onChange={(e) => {
                const sanitized = e.target.value.replace(/[^0-9]/, "");
                setParams({ ...params, from: 0, ageMax: sanitized });
                resetPage();
              }}
              style={{ marginRight: 8 }}
            />
          </Box>
        )}
        {filterType === "zip" && (
          <Box
            display="flex"
            alignItems="center"
            margin={2}
            flexDirection="column"
          >
            <Typography variant={"subtitle1"}>
              Enter one zip code on each new line
            </Typography>
            <TextField
              type="number"
              maxRows={5}
              multiline
              label="Zip Codes"
              value={(params.zipCodes || []).join(`\n`)}
              onChange={(e) => {
                const sanitized = e.target.value.replace(/[^0-9\n]/, "");
                const sanitizedSplit = sanitized.split("\n");
                const zipCodes =
                  (sanitizedSplit || [])[0].length === 0
                    ? undefined
                    : sanitizedSplit;
                setParams({ ...params, from: 0, zipCodes });
                resetPage();
              }}
              style={{ marginRight: 8 }}
            />
          </Box>
        )}
        <Box
          position="sticky"
          p={1}
          sx={paperBackgroundLighter}
          zIndex={1}
          bottom={0}
        >
          {/* <Button variant="contained" onClick={reload}>
            {`Apply Filter ${filterType}`}
          </Button> */}
        </Box>
      </Box>
    </Popover>
  );

  return (
    <Box p={2}>
      <IconButton
        aria-label="filter"
        size="large"
        edge="end"
        onClick={handleFilterClick}
        color="inherit"
      >
        <FilterIcon />
      </IconButton>
      {renderFilterMenu}
    </Box>
  );
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
/////////////////////// DogCard ////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

const DogImage = styledComp.img`
  border-radius: 4px;
  width: 200px;
  height: 200px;
  object-fit: cover;
`;

const DogName = styledComp.p`
  font-size: 20px;
`;

const DogInfo = styledComp.p`
  font-size: 18px;
`;

export const DogCard = ({ dog }: { dog: Dog }) => {
  const mainState = useAppSelector((state) => state.main);
  const dispatch = useAppDispatch();

  const isFavorite = mainState.favorites.includes(dog.id);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const updateFavorite = () => {
    // Display the favorite animation.
    dispatch(updateFavorites(dog.id));
  };

  return (
    <Card
      aria-label="dog card"
      elevation={isHovered ? 3 : 1}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: "200px",
        height: "auto",
        alignSelf: "center",
        position: "relative",
      }}
    >
      {isFavorite && (
        <Box
          className="favorite-animation"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            ...paperBackground,
          }}
        >
          <div style={{ fontSize: "200px" }}>
            <FavoriteIcon fontSize="inherit" className="bounce-animation" />
          </div>
        </Box>
      )}
      <Box
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
          textAlign: "center",
        }}
      >
        <Collapse
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            ...paperBackground,
          }}
          in={isHovered}
          timeout="auto"
          unmountOnExit
        >
          <DogInfo>{dog.breed}</DogInfo>
          <DogInfo>
            {dog.age} year{dog.age !== 1 ? "s" : ""} old
          </DogInfo>
          <DogInfo>Near {dog.zip_code}</DogInfo>
        </Collapse>
        <DogImage
          alt={`${dog.name}, age ${dog.age}, breed ${dog.breed}`}
          src={dog.img}
        />
        <Box
          flexDirection={"row"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          marginX={"16px"}
          height={"200"}
        >
          <DogName>
            <b>{dog.name}</b>, {dog.age}
          </DogName>
          <IconButton onClick={updateFavorite}>
            {isFavorite ? (
              <FavoriteIcon sx={{ zIndex: 8, color: "#FF22AA" }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////////////////// Toast /////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

export interface ToastProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
}

export const Toast = ({ open, message, severity, onClose }: ToastProps) => {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////// MatchModal //////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

export interface MatchModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MatchModal = ({ open, setOpen }: MatchModalProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { match, favorites, location } = useAppSelector((state) => state.main);

  const onClose = () => {
    setOpen(false);
  };

  const { data, isLoading } = useQuery("match", () => fetchMatch(favorites), {
    manual: true,
    enabled: false,
  } as any);

  useEffect(() => {
    if (open && !match) {
      // Enable the query and run
      queryClient.prefetchQuery("match");
      queryClient.invalidateQueries("match");
    }

    if (data?.match && !match) {
      dispatch(updateMatch(data.match));
      dispatch(updateLocation(data.location));
    }
  }, [
    data?.match,
    isLoading,
    match,
    open,
    queryClient,
    dispatch,
    data?.location,
  ]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          {!!match ? "Match found!" : "Finding your match..."}
        </Typography>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ alignSelf: "center" }}
        >
          {match?.name}
        </Typography>
        <DogImage
          style={{ width: "400px", height: "400px", margin: "16px" }}
          alt={`${match?.name}, age ${match?.age}, breed ${match?.breed}`}
          src={match?.img}
        />
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ alignSelf: "center" }}
        >
          {match?.age} year{match?.age !== 1 ? "s" : ""} old
        </Typography>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ alignSelf: "center" }}
        >
          {match?.breed}
        </Typography>

        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ alignSelf: "center" }}
        >
          {location
            ? `${location.city}, ${location.state}, ${location.zip_code}`
            : ""}
        </Typography>

        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};
