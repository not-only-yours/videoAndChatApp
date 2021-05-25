import LeftChats from "./LeftChats";
import { BrowserRouter as Router } from "react-router-dom";
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
  refreshDB,
} from "./service";
import { StateContext, StateProvider } from "./StateProvider";
import reducer, { initialState } from "./reducer";
import "firebase/firestore";
import FirestoreMock from "./mockedFirebase";
import db from "./firebase";
import IconButton from "@material-ui/core/IconButton";
import sinon from "sinon";

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
describe("test modules with router", () => {
  it("test module LeftChats with snapshot", () => {
    const container = renderer
      .create(
        <Router>
          <LeftChats />
        </Router>
      )
      .toJSON();
    expect(container).toMatchSnapshot();
  });

  it("test module Video with snapshot", () => {
    const container = renderer.create(<Video />).toJSON();
    expect(container).toMatchSnapshot();
  });
});

describe("shallow tests of modules", () => {
  it("testing LeftChats with parameters key, id, name", () => {
    const room = {
      id: true,
      data: {
        name: "name",
      },
    };
    const container = shallow(
      <LeftChats id={room.id} name={room.data.name} addProp={false} />
    );
    expect(container).toMatchSnapshot();
  });

  it("testing LeftChats with addProp", () => {
    const container = shallow(<LeftChats addProp />);
    expect(container).toMatchSnapshot();
  });

  it("testing Chat", () => {
    const container = shallow(<Chat />);
    container.find("button").simulate("click", { preventDefault: () => {} });
    expect(container).toMatchSnapshot();
  });

  it("testing Leftpart", () => {
    const container = shallow(<Leftpart />);
    expect(container).toMatchSnapshot();
  });

  it("testing Login", () => {
    const container = shallow(<Login />);
    expect(container).toMatchSnapshot();
  });
  it("app without user", () => {
    const container = shallow(<App />);
    expect(container).toMatchSnapshot();
  });

  it("app with user, token", () => {
    jest.resetModules();
    jest.mock("./StateProvider", () => ({
      useStateValue: () => [{ user: "adas", token: "sas" }, jest.fn()],
    }));
    const container = shallow(<App />);
    expect(container).toMatchSnapshot();
  });

  it("app without token (with user)", () => {
    jest.resetModules();
    jest.mock("./StateProvider", () => ({
      useStateValue: () => [{ user: "adas" }, jest.fn()],
    }));
    const container = shallow(<App />);
    expect(container).toMatchSnapshot();
  });
});

describe("tests of onclick events", () => {
  it("LeftChats onclick func", () => {
    const app = shallow(<LeftChats addProp={true} />);
    // jest.mock("./LeftChats", () => ({
    //   createChat: jest.fn(() => {}),
    // }));
    const ans = app.find(".leftpart_chat").simulate("click");
    expect(ans).toMatchSnapshot();
  });

  it("simulate click on material-ui iconbutton", () => {
    const onSearchClick = sinon.spy();
    const wrapper = shallow(<Chat onSearchClick={onSearchClick} />);
    wrapper.find(IconButton).simulate("click", { preventDefault: () => {} });
    expect(onSearchClick).toMatchSnapshot();
  });
});

describe("firebase tests", () => {
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

  it("function sendMessageFun test", () => {
    sendMessageFun("sdfs", "dsds", user);
    expect(firestoreMock.collection).toEqual({
      rooms: [
        {
          messages: [{ message: "asa", name: "aaa", timestamp: "2211122" }],
          name: "asa",
          roomId: "aaa",
        },
      ],
    });
  });

  it("function jwtExists test", () => {
    jwtExists("d", "sasa");
    expect(firestoreMock.collection).toEqual({
      rooms: [
        {
          messages: [{ message: "asa", name: "aaa", timestamp: "2211122" }],
          name: "asa",
          roomId: "aaa",
        },
      ],
    });
  });

  it("function send test", () => {
    send("user");
    expect(firestoreMock.collection).toEqual({
      rooms: [
        {
          messages: [{ message: "asa", name: "aaa", timestamp: "2211122" }],
          name: "asa",
          roomId: "aaa",
        },
      ],
    });
  });

  it("function idExists test", () => {
    idExists("id", "setMessages");
    expect(firestoreMock.collection).toEqual({
      rooms: [
        {
          messages: [{ message: "asa", name: "aaa", timestamp: "2211122" }],
          name: "asa",
          roomId: "aaa",
        },
      ],
    });
  });
  it("function createRoom test", () => {
    createRoom("roomName");
    expect(firestoreMock.collection).toEqual({
      rooms: [
        {
          messages: [{ message: "asa", name: "aaa", timestamp: "2211122" }],
          name: "asa",
          roomId: "aaa",
        },
      ],
    });
  });
  it("function refreshDb test", () => {
    refreshDB("setRooms");
    expect(firestoreMock.collection).toEqual({
      rooms: [
        {
          messages: [{ message: "asa", name: "aaa", timestamp: "2211122" }],
          name: "asa",
          roomId: "aaa",
        },
      ],
    });
  });
  it("service roomNameExists", () => {
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
});

describe("reducer and state provider tests", () => {
  const actionTypes = {
    SET_USER: "SET_USER",
    SET_TOKEN: "SET_TOKEN",
    SET_ROOMNAME: "SET_ROOMNAME",
  };
  it("StateProvider", () => {
    const container = shallow(
      <StateProvider initialState={initialState} reducer={reducer}>
        <App />
      </StateProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("test state provider variables", () => {
    expect(StateContext).toStrictEqual(React.createContext());
    const sp = require("./StateProvider");
    sp.useStateValue();
    expect(React.useContext).toBeInstanceOf(Function);
  });
  it("reducer SET_USER", () => {
    const a = reducer("aa", { type: actionTypes.SET_USER });
    expect(a).toEqual({ 0: "a", 1: "a", user: undefined });
  });
  it("reducer without params", () => {
    const b = reducer("aa", "sss");
    expect(b).toEqual("aa");
  });
  it("reducer SET_TOKEN", () => {
    const c = reducer("aa", { type: actionTypes.SET_TOKEN });
    expect(c).toEqual({ 0: "a", 1: "a", user: undefined });
  });
  it("reducer SET_ROOMNAME", () => {
    const d = reducer("aa", { type: actionTypes.SET_ROOMNAME });
    expect(d).toEqual({ 0: "a", 1: "a", user: undefined });
  });
});
