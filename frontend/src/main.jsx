import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import App from "./App";
import { store } from "./redux/store";

const stripePromise = loadStripe("pk_test_51QQ7d3B4Or55ocqNa5nLu4abFOmAgu60HTvqTb04gijBQtJO69PUy5tRM6AvuvWayGSNzYlCk5Kopo9BgrXDDxux00M98rR2TG");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Elements stripe={stripePromise} />
      <App />
    </Provider>
  </StrictMode>
);
