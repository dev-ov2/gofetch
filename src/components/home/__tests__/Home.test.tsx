import { render, screen } from "@testing-library/react";
import { createTestStore, withProviders } from "../../../testing/utils";
import Home from "../Home";

test("renders Available for adoption", () => {
  const testStore = createTestStore({
    main: { loggedIn: true, dogs: [], favorites: [] },
  });

  render(withProviders(testStore, <Home />));

  const title = screen.getByText(/Available for adoption/);
  expect(title).toBeInTheDocument();

  const pagination = screen.getByLabelText(/pagination/);
  expect(pagination).toBeInTheDocument();
});
