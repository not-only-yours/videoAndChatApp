// import { send } from "./service";
// import React from "react";
// import Adapter from "enzyme-adapter-react-16";
// import { act } from "@testing-library/react";
// import pretty from "pretty";
// import LeftChats from "./LeftChats";
// import { BrowserRouter } from "react-router-dom";
// import Chat from "./Chat";
// import { useStateValue } from "./StateProvider";
// import { shallow, configure } from "enzyme";
//
// configure({ adapter: new Adapter() });
//
// let container = null;
// let realUseContext;
// let useContextMock;
// beforeEach(() => {
//   container = document.createElement("div");
//   document.body.appendChild(container);
//   jest.spyOn(React, "useState").mockImplementationOnce(() => React.useState("ddd"));
//   realUseContext = React.useContext;
//   useContextMock = React.useContext = jest.fn();
// });
//
// afterEach(() => {
//   // подчищаем после завершения
//   unmountComponentAtNode(container);
//   container.remove();
//   container = null;
//   React.useContext = realUseContext;
// });
//
// test("axios reqest", () => {
//   const user = `2`;
//   jest.spyOn(global, "fetch").mockImplementation(() =>
//     Promise.resolve({
//       json: () => Promise.resolve(user),
//     })
//   );
//
//   expect(send(user));
// });
//
// test("DOM element LeftChats", () => {
//   act(() => {
//     render(
//       <BrowserRouter>
//         <LeftChats />;
//       </BrowserRouter>,
//       container
//     );
//   });
//
//   expect(pretty(document.body.innerHTML));
//
//   act(() => {
//     render(
//       <BrowserRouter>
//         <LeftChats id="dd" addProp="ss" name="dd" />;
//       </BrowserRouter>,
//       container
//     );
//   });
//
//   expect(pretty(document.body.innerHTML));
// });
//
//
//
// describe("DOM element Chat", () => {
//   // const state = require("./StateProvider");
//   // useContextMock.mockReturnValue("Text");
//   useStateValue.mockReturnValueOnce("Text");
//   useContextMock.mockReturnValue("Test Value");
//
//   it("ddd", () => {
//     const component = shallow(<Chat />);
//     expect(component);
//   });
// });
import React from "react";
import LeftChats from "./LeftChats";
import { BrowserRouter as Router } from "react-router-dom";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Leftpart from "./Leftpart";
import Login from "./Login";
import Chat from "./Chat";
import App from "./App";
import Video from "./video";
import { createSerializer } from "enzyme-to-json";
import renderer from "react-test-renderer";

expect.addSnapshotSerializer(createSerializer({ mode: "deep" }));
configure({ adapter: new Adapter() });

beforeEach(() => {
  jest.mock("react", () => ({
    useState: "usv",
    useContext: () => "sdss",
    useParams: "sss",
  }));

  jest.mock("./StateProvider", () => ({
    useStateValue: () => "usv",
  }));

  jest.mock("react-router", () => ({
    useParams: jest.fn().mockReturnValue({ id: "123" }),
  }));
});

afterEach(() => {});

test("LeftChats", () => {
  const container = renderer
    .create(
      <Router>
        <LeftChats />
      </Router>
    )
    .toJSON();
  expect(container).toMatchSnapshot();
});

test("LeftChats addProp", () => {
  const container = renderer
    .create(
      <Router>
        <LeftChats addProp />
      </Router>
    )
    .toJson();
  expect(container).toMatchSnapshot();
});

test("Leftpart", () => {
  const container = renderer
    .create(
      <Router>
        <Leftpart />
      </Router>
    )
    .toJson();
  expect(container).toMatchSnapshot();
});

test("Login", () => {
  const container = renderer
    .create(
      <Router>
        <Login />
      </Router>
    )
    .toJson();
  expect(container).toMatchSnapshot();
});

test("App", () => {
  const container = renderer
    .create(
      <Router>
        <App />
      </Router>
    )
    .toJson();
  expect(container).toMatchSnapshot();
});

test("App", () => {
  const container = renderer
    .create(
      <Router>
        <Video />
      </Router>
    )
    .toJson();
  expect(container).toMatchSnapshot();
});
