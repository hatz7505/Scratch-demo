import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import Home from "./containers/Home";
import { AppContext } from "./libs/contextLib";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Router>
      <App />
    </Router>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it("app matches snapshot", function () {
  const { asFragment } = render(
    <Router>
      <App />
    </Router>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("home matches snapshot", function () {
  let isAuthenticated = true;
  const { asFragment } = render(
    <Router>
      <AppContext.Provider value={{ isAuthenticated }}>
        <Home />
      </AppContext.Provider>
    </Router>
  );
  expect(asFragment()).toMatchSnapshot();
});
