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
import { unmountComponentAtNode } from "react-dom";
import LeftChats from "./LeftChats";
import { BrowserRouter as Router } from "react-router-dom";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Leftpart from "./Leftpart";
import Login from "./Login";
import Chat from "./Chat";
import App from "./App";
import Video from "./video";

configure({ adapter: new Adapter() });
let container = null;

beforeAll(() => {
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

  container = document.createElement("div");
  document.body.appendChild(container);
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("LeftChats", () => {
  const { container } = shallow(
    <Router>
      <LeftChats />
    </Router>
  );
  expect(container).toMatchSnapshot();
});

test("LeftChats addProp", () => {
  const { container } = shallow(
    <Router>
      <LeftChats addProp />
    </Router>
  );
  expect(container).toMatchSnapshot();
});

test("Leftpart", () => {
  const { container } = shallow(
    <Router>
      <Leftpart />
    </Router>
  );
  expect(container).toMatchSnapshot();
});

test("Login", () => {
  const { container } = shallow(
    <Router>
      <Login />
    </Router>
  );
  expect(container).toMatchSnapshot();
});

test("App", () => {
  const { container } = shallow(
    <Router>
      <App />
    </Router>
  );
  expect(container).toMatchSnapshot();
});

test("App", () => {
  const { container } = shallow(
    <Router>
      <Video />
    </Router>
  );
  expect(container).toMatchSnapshot();
});
