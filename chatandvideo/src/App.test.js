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
import LeftChats from "./LeftChats";
import { BrowserRouter as Router } from "react-router-dom";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Leftpart from "./Leftpart";
import Login from "./Login";
import App from "./App";
import Video from "./video";
import { createSerializer } from "enzyme-to-json";
import renderer from "react-test-renderer";
import React from "react";
import Chat from "./Chat";

expect.addSnapshotSerializer(createSerializer({ mode: "deep" }));
configure({ adapter: new Adapter() });

beforeEach(() => {
  const mockSetState = jest.fn();
  jest.mock("react", () => ({
    useState: (initial) => [initial, mockSetState],
    useContext: (initial) => [initial, mockSetState],
    useParams: "sss",
  }));
  jest.mock("./StateProvider", () => ({
    useStateValue: () => ["initial", mockSetState],
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
  const container = renderer.create(<LeftChats addProp />);
  expect(container).toMatchSnapshot();
});

test("Video", () => {
  const container = renderer.create(<Video />).toJSON();
  expect(container).toMatchSnapshot();
});
