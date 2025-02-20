import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Cart from "../components/Cart";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";

jest.mock("axios");

const mockCartItems = [
  { id: 1, name: "Item 1", price: 10, quantity: 1 },
  { id: 2, name: "Item 2", price: 20, quantity: 2 },
];

describe("Cart Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockCartItems });
  });

  test("renders Cart component and fetches cart items", async () => {
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });
  });

  test("removes an item from the cart", async () => {
    axios.delete.mockResolvedValue({});

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    expect(await screen.findByText("Item 1")).toBeInTheDocument();

    const removeButton = screen.getAllByText(/remove/i)[0];
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    });
  });

  test("proceeds to checkout", async () => {
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    expect(await screen.findByText("Item 1")).toBeInTheDocument();

    const checkoutButton = screen.getByText(/checkout/i);
    fireEvent.click(checkoutButton);

    expect(window.location.pathname).toBe("/checkout");
  });
});
