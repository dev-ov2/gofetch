import { Box, Divider, Grid, TablePagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { Dog, SearchParamProps, fetchDogs } from "../../network/requests";
import { AppBar, DogCard, FilterButton } from "./components";
import "./HomeComponents.css";

export const QUERY_KEY_DOG_IDS = "dog-ids";

const HomeScreen = styled.div`
  margin: 16px;
`;

const Header = styled.div`
  z-index: 4;
  position: sticky;
  top: 0;
  height: 56px;
  width: 100%;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #121212;
  );
`;

const Title = styled.p`
  font-size: 24px;
  text-align: center;
`;

const Table = styled.div`
  margin: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 2px solid rgba(81, 81, 81, 1);
  border-radius: 4px;
`;

const Home = () => {
  const [page, setPage] = useState(0);

  const [params, setParams] = useState<SearchParamProps>({
    ageMin: "",
    ageMax: "",
    zipCodes: [],
    breeds: [],
    size: 25,
    from: page * 25,
  });
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [dogs, setDogs] = useState<Dog[]>([]);

  const { data, refetch } = useQuery(
    [QUERY_KEY_DOG_IDS],
    () => fetchDogs(params),
    { manual: true } as any
  );

  useEffect(() => {
    // Refetch when params is finished updating to prevent potential rate limits
    const delay = setTimeout(() => {
      refetch();
    }, 500);

    return () => clearTimeout(delay);
  }, [params, refetch]);

  useEffect(() => {
    if (!!data) {
      setDogs(data.dogs);
    }
  }, [data, dogs]);

  const updatePage = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPageChange = (_: any, newPage: number) => {
    setParams({ ...params, from: newPage * (params.size ?? 25) });
    updatePage(newPage);
  };

  const onRowsPerPageChange = (event: any) => {
    const value = event.target.value;
    setRowsPerPage(event.target.value);
    setParams({ ...params, from: 0, size: value });
    updatePage(0);
  };

  const [fadeIn, setFadeIn] = useState<boolean>(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <HomeScreen className={`home ${fadeIn ? "fade-in" : ""}`}>
      <AppBar />
      <Table>
        <Header>
          <Box p={4} />
          <Title>{`Available for adoption`}</Title>
          <FilterButton
            params={params}
            setParams={setParams}
            setPage={setPage}
          />
        </Header>
        <Divider style={{ margin: "8px" }} />
        <Grid style={{ justifyContent: "center" }} container spacing={2}>
          {dogs.map((dog: Dog) => (
            <Grid key={dog.id} item spacing={2}>
              <DogCard dog={dog} />
            </Grid>
          ))}
        </Grid>

        <TablePagination
          aria-label="pagination"
          style={{
            marginTop: "8px",
            position: "sticky",
            bottom: 0,
            backgroundColor: "#121212",
          }}
          rowsPerPageOptions={[25, 50, 100]}
          count={data && data.total ? data.total : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </Table>
    </HomeScreen>
  );
};

export default Home;
