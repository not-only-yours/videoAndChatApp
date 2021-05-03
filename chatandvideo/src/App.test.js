import { send } from "./service";
import React from "react";
import { act } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";
import pretty from "pretty";
import LeftChats from "./LeftChats";
import { BrowserRouter } from "react-router-dom";
import Chat from "./Chat";
import { StateProvider, useStateValue } from "./StateProvider";

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  jest.spyOn(React, "useState").mockImplementationOnce(() => React.useState("ddd"));
});

afterEach(() => {
  // подчищаем после завершения
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("axios reqest", () => {
  const user = `2`;

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(user),
    })
  );

  expect(send(user));
});

test("DOM element LeftChats", () => {
  act(() => {
    render(
      <BrowserRouter>
        <LeftChats />;
      </BrowserRouter>,
      container
    );
  });

  expect(pretty(document.body.innerHTML));

  act(() => {
    render(
      <BrowserRouter>
        <LeftChats id="dd" addProp="ss" name="dd" />;
      </BrowserRouter>,
      container
    );
  });

  expect(pretty(document.body.innerHTML));

  act(() => {
    container
      .querySelector("[data-testid='1']")
      .dispatchEvent(new MouseEvent("click"));
  });
  expect(pretty(document.body.innerHTML));
});

test("DOM element Chat", () => {
  jest.mock("./StateProvider");
  act(() => {
    render(
      <BrowserRouter>
        <Chat />;
      </BrowserRouter>,
      container
    );
  });

  expect(pretty(document.body.innerHTML));
});
