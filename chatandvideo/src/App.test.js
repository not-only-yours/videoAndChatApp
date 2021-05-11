import LeftChats from "./LeftChats";
import { BrowserRouter as Router } from "react-router-dom";
import { MemoryRouter } from "react-router";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Leftpart from "./Leftpart";
import Login from "./Login";
import App from "./App";
import Video from "./video";
import { createSerializer } from "enzyme-to-json";
import renderer from "react-test-renderer";
import React from "react";
import Chat from "./Chat";
import {
  send,
  jwtExists,
  roomNameExists,
  sendMessageFun,
  idExists,
  createRoom,
  signIn,
  refreshDB,
  twillioConnect,
} from "./service";
import { StateContext, StateProvider, useStateValue } from "./StateProvider";
import reducer, { actionTypes, initialState } from "./reducer";
import "firebase/firestore";
import FirestoreMock from "./mockedFirebase";
import db, { auth, provider } from "./firebase";
import IconButton from "@material-ui/core/IconButton";
import sinon from "sinon";
import { cleanup } from "@testing-library/react";
expect.addSnapshotSerializer(createSerializer({ mode: "deep" }));
configure({ adapter: new Adapter() });
const firestoreMock = new FirestoreMock();

beforeEach(() => {
  const mockSetState = jest.fn();
  jest.mock("./StateProvider", () => ({
    useStateValue: () => ["initial", mockSetState],
  }));
  jest.mock("react", () => ({
    useState: (initial) => [
      [
        { room: initial, id: "asa", data: { name: "aaa" } },
        { room: initial, id: "asa", data: { name: "aaa" } },
      ],
      mockSetState,
    ],
    useContext: (initial) => [initial, mockSetState],
    useRef: jest.fn(),
    useEffect: jest.fn(),
    useReducer: (initial, setter) => [initial, setter],
    createContext: jest.fn(),
  }));
  jest.mock("./Chat", () => ({
    handleSubmit: jest.fn().mockResolvedValue("test"),
  }));
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
      roomId: "group1",
    }),
  }));
  jest.mock("./service", () => ({
    jwtExists: jest.fn(),
    sendMessageFun: jest.fn(),
    send: jest.fn().mockResolvedValue("test"),
    idExists: jest.fn(),
    createRoom: jest.fn(),
    refreshDB: jest.fn(),
    signIn: jest.fn().mockResolvedValue("test"),
    twillioConnect: (token, videoRoomName, localVidRef, remoteVidRef) => "aaa",
  }));
});

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

test("LeftChats key, id, name", () => {
  const room = {
    id: "11",
    data: {
      name: "name",
    },
  };

  const container = shallow(
    <LeftChats key={room.id} id={room.id} name={room.data.name} />
  );
  expect(container).toMatchSnapshot();
});

test("LeftChats addProp", () => {
  const container = shallow(<LeftChats addProp />);
  expect(container).toMatchSnapshot();
});

test("LeftChats onclick func", () => {
  const app = shallow(<LeftChats />);
  // jest.mock("./LeftChats", () => ({
  //   createChat: jest.fn(() => {}),
  // }));

  const p = app.find(".leftpart_chat");
  const ans = p.simulate("click");
  expect(ans).toEqual({});
});

test("Video", () => {
  const container = renderer.create(<Video />).toJSON();
  expect(container).toMatchSnapshot();
});

test("firebase", () => {
  const firebase = require("firebase/app");
  firebase.firestore = firestoreMock;
  firestoreMock.reset();
  firestoreMock.collection = {
    rooms: [
      {
        roomId: "aaa",
        name: "asa",
        messages: [{ message: "asa", name: "aaa", timestamp: "2211122" }],
      },
    ],
  };
  const user = {
    displayName: "dsa",
  };
  sendMessageFun("sdfs", "dsds", user);
  jwtExists("d", "sasa");
  send("user");
  idExists("id", "setMessages");
  createRoom("roomName");
  refreshDB("setRooms");
  expect(db.collection("rooms"));
});

test("Chat", () => {
  const container = shallow(<Chat />);
  container.find("button").simulate("click", { preventDefault: () => {} });
  expect(container).toMatchSnapshot();
});

test("simulate click on material-ui iconbutton", () => {
  const onSearchClick = sinon.spy();
  const wrapper = shallow(<Chat onSearchClick={onSearchClick} />);
  wrapper.find(IconButton).simulate("click", { preventDefault: () => {} });
  expect(onSearchClick.called);
});

test("Login", () => {
  const container = shallow(<Login />);
  expect(container).toMatchSnapshot();
});

test("Leftpart", () => {
  const container = shallow(<Leftpart />);
  expect(container).toMatchSnapshot();
});

test("StateProvider", () => {
  const container = shallow(
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  );
  expect(container).toMatchSnapshot();
});

test("reducer", () => {
  const actionTypes = {
    SET_USER: "SET_USER",
    SET_TOKEN: "SET_TOKEN",
    SET_ROOMNAME: "SET_ROOMNAME",
  };

  reducer("aa", { type: actionTypes.SET_USER });
  expect(reducer);
  reducer("aa", "sss");
  expect(reducer);
  reducer("aa", { type: actionTypes.SET_TOKEN });
  expect(reducer);
  reducer("aa", { type: actionTypes.SET_ROOMNAME });
  expect(reducer);
});

test("state provider variables", () => {
  expect(StateContext).toStrictEqual(React.createContext());
  expect(useStateValue);
});

test("app without user", () => {
  const container = shallow(<App />);
  expect(container).toMatchSnapshot();
});

test("app with user, token", () => {
  jest.resetModules();
  jest.mock("./StateProvider", () => ({
    useStateValue: () => [{ user: "adas", token: "sas" }, jest.fn()],
  }));
  const container = shallow(<App />);
  expect(container).toMatchSnapshot();
});

test("app without token (with user)", () => {
  jest.resetModules();
  jest.mock("./StateProvider", () => ({
    useStateValue: () => [{ user: "adas" }, jest.fn()],
  }));
  const container = shallow(<App />);
  expect(container).toMatchSnapshot();
});

test("service roomNameExists", () => {
  const roomId = "aaa";
  const dispatchRoomName = () => "nothing";
  const setRoomName = () => "nothing";
  const setMessages = () => "nothing";
  roomNameExists(roomId, dispatchRoomName, setRoomName, setMessages);

  db.collection("rooms")
    .doc(roomId)
    .onSnapshot((snapshot) => {
      expect(snapshot.data().name).toEqual("asa");
    });
});
