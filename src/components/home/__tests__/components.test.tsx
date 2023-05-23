import { fireEvent, render, screen } from "@testing-library/react";
import { Dog } from "../../../network/requests";
import {
  createTestStore,
  mockUseQuery,
  withProviders,
} from "../../../testing/utils";
import {
  AppBar,
  DogCard,
  FilterButton,
  MatchModal,
  Toast,
} from "../components";

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

test("AppBar renders title, icon, Find my match (but not View my match), and More button", async () => {
  const testStore = createTestStore({
    main: { loggedIn: true, dogs: [], favorites: [] },
  });
  render(withProviders(testStore, <AppBar />));
  const icon = screen.getByAltText(/icon/);
  expect(icon).toBeInTheDocument();
  const title = screen.getByText(/GoFetch!/);
  expect(title).toBeInTheDocument();
  const matchButton = screen.getByText(/Find my match/);
  expect(matchButton).toBeInTheDocument();
  expect(screen.queryByText(/View my match/)).toBeNull();
  const logoutButton = screen.getAllByText(/Log Out/)[0];
  expect(logoutButton).toBeInTheDocument();
});

test("AppBar renders View My Match button when we already have a match in the store", () => {
  const testStore = createTestStore({
    main: {
      loggedIn: true,
      dogs: [],
      favorites: [],
      match: {
        id: "001",
        img: "https://localhost:8080/hosted/img.png",
        name: "Crackle",
        age: 2,
        zip_code: "53597",
        breed: "shi tzu",
      },
    },
  });
  render(withProviders(testStore, <AppBar />));
  expect(screen.queryByText(/Find my match/)).toBeNull();
  const matchedButton = screen.getByText(/View my match/);
  expect(matchedButton).toBeInTheDocument();
});

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

test("FilterButton renders filter menu", async () => {
  mockUseQuery(["a", "b", "c"]);

  const testStore = createTestStore({
    main: { loggedIn: true, dogs: [], favorites: [] },
  });

  const props = {
    params: {},
    setParams: jest.fn(),
    setPage: jest.fn(),
  };
  render(withProviders(testStore, <FilterButton {...props} />));

  fireEvent.click(screen.getByLabelText(/filter/));
  const select = screen.getByTestId(/select/);

  /////////////////////
  ////// breed ////////
  /////////////////////
  fireEvent.change(select, { target: { value: "breed" } });

  // Make sure the checkboxes display when the select box is set to breed
  const checkbox = screen.getByLabelText(/Checkbox for breed a/);
  expect(checkbox).toBeInTheDocument();

  /////////////////////
  /////// age /////////
  /////////////////////
  fireEvent.change(select, { target: { value: "age" } });

  // Make sure the age fields display when the select box is set to breed
  const ageMin = screen.getByLabelText(/Min/);
  expect(ageMin).toBeInTheDocument();

  const ageMax = screen.getByLabelText(/Max/);
  expect(ageMax).toBeInTheDocument();

  /////////////////////
  /////// zip /////////
  /////////////////////
  fireEvent.change(select, { target: { value: "zip" } });

  // Make sure the checkboxes display when the select box is set to breed
  const zip = screen.getByLabelText(/Zip Codes/);
  expect(zip).toBeInTheDocument();
});

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

test("DogCard renders name, image, and hover fields", async () => {
  const dog: Dog = {
    id: "007",
    img: "https://localhost:8080/hosted/img.png",
    name: "Crackle",
    age: 2,
    zip_code: "53597",
    breed: "Shi Tzu",
  };

  const testStore = createTestStore({
    main: { loggedIn: true, dogs: [], favorites: [] },
  });
  render(withProviders(testStore, <DogCard dog={dog} />));
  const name = screen.getByText(/Crackle/);
  expect(name).toBeInTheDocument();
  const shortAge = screen.getByText(/, 2/);
  expect(shortAge).toBeInTheDocument();
  const image = screen.getByAltText(/Crackle, age 2, breed Shi Tzu/);
  expect(image).toBeInTheDocument();

  /////////////////////
  ////// hover ////////
  /////////////////////
  const card = screen.getByLabelText(/dog card/);
  fireEvent.mouseEnter(card);

  const breed = screen.getByText(/Shi Tzu/);
  expect(breed).toBeInTheDocument();

  const extendedAge = screen.getByText(/2 years old/);
  expect(extendedAge).toBeInTheDocument();

  const location = screen.getByText(/Near 53597/);
  expect(location).toBeInTheDocument();
});

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

test("Toast renders message and color", async () => {
  const props = {
    open: true,
    message: "Toast is here!",
    severity: "success" as any,
    onClose: jest.fn(),
  };

  const testStore = createTestStore({
    main: { loggedIn: true, dogs: [], favorites: [] },
  });
  render(withProviders(testStore, <Toast {...props} />));
  const alert = screen.getByText(/Toast is here!/);
  expect(alert).toBeInTheDocument();
});

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

test("MatchModal renders title, image, and info fields when match is provided in state", async () => {
  mockUseQuery({
    match: {
      id: "007",
      img: "https://localhost:8080/hosted/img.png",
      name: "Crackle",
      age: 2,
      zip_code: "53597",
      breed: "Shi Tzu",
    },
    location: {
      state: "Wisconsin",
      city: "Waunakee",
      zip_code: "53597",
    },
  });

  const testStore = createTestStore({
    main: {
      loggedIn: true,
      dogs: [],
      favorites: [],
      match: {
        id: "007",
        img: "https://localhost:8080/hosted/img.png",
        name: "Crackle",
        age: 2,
        zip_code: "53597",
        breed: "Shi Tzu",
      },
      location: {
        state: "Wisconsin",
        city: "Waunakee",
        zip_code: "53597",
        latitude: 67,
        longitude: 54,
        county: "Dane",
      },
    },
  });
  render(
    withProviders(testStore, <MatchModal open={true} setOpen={jest.fn()} />)
  );

  const modalTitle = screen.getByText(/Match found!/);
  expect(modalTitle).toBeInTheDocument();

  const matchName = screen.getByText(/Crackle/);
  expect(matchName).toBeInTheDocument();

  const matchAge = screen.getByText(/2 years old/);
  expect(matchAge).toBeInTheDocument();

  const matchBreed = screen.getByText(/Shi Tzu/);
  expect(matchBreed).toBeInTheDocument();

  const location = screen.getByText(/Waunakee, Wisconsin, 53597/);
  expect(location).toBeInTheDocument();

  const button = screen.getByText(/Close/);
  expect(button).toBeInTheDocument();
});

test("MatchModal renders title as Finding your match when match is not provided in state", async () => {
  mockUseQuery({});

  const testStore = createTestStore({
    main: {
      loggedIn: true,
      dogs: [],
      favorites: [],
    },
  });
  render(
    withProviders(testStore, <MatchModal open={true} setOpen={jest.fn()} />)
  );

  const modalTitle = screen.getByText(/Finding your match.../);
  expect(modalTitle).toBeInTheDocument();
});

test("MatchModal renders no title open is false", async () => {
  mockUseQuery({});

  const testStore = createTestStore({
    main: {
      loggedIn: true,
      dogs: [],
      favorites: [],
    },
  });
  render(
    withProviders(testStore, <MatchModal open={false} setOpen={jest.fn()} />)
  );

  const modalTitle = screen.queryByText(/Finding your match.../);
  expect(modalTitle).toBeNull();
});
