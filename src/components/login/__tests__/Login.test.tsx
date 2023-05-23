import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginForm from "../Login";

test("renders welcome text", () => {
  render(<LoginForm onSubmit={jest.fn()} />);
  const welcomeText = screen.getByText(/Hello there./);
  expect(welcomeText).toBeInTheDocument();
});

test("renders Username and Password fields", () => {
  render(<LoginForm onSubmit={jest.fn()} />);
  const nameField = screen.getByLabelText(/Name/);
  expect(nameField).toBeInTheDocument();
  const emailField = screen.getByLabelText(/Email/);
  expect(emailField).toBeInTheDocument();
});

test("onSubmit called with correct values", async () => {
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  fireEvent.change(screen.getByLabelText(/Name/), {
    target: { value: "Orion Wilkinson-Johnson" },
  });

  fireEvent.change(screen.getByLabelText(/Email/), {
    target: { value: "snode4@outlook.com" },
  });

  fireEvent.click(screen.getByText(/Log In/));
  await waitFor(
    () => {
      expect(onSubmit).toHaveBeenCalledWith(
        "Orion Wilkinson-Johnson",
        "snode4@outlook.com"
      );
    },
    { timeout: 4000 }
  );
});
