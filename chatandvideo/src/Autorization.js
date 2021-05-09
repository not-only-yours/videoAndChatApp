import { auth, provider } from "./firebase";
import { actionTypes } from "./reducer";
import TwilioVideo from "twilio-video";

export function signIn(dispatch) {
  return () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch((error) => alert(error.message));
  };
}

export function twillioConnect(token, videoRoomName, localVidRef, remoteVidRef) {
  TwilioVideo.connect(token, {
    video: true,
    audio: true,
    name: videoRoomName,
  }).then((room) => {
    // Attach the local video
    TwilioVideo.createLocalVideoTrack().then((track) => {
      localVidRef.current.appendChild(track.attach());
    });

    const addParticipant = (participant) => {
      console.log("new participant!");
      console.log(participant);
      participant.tracks.forEach((publication) => {
        if (publication.isSubscribed) {
          const track = publication.track;

          remoteVidRef.current.appendChild(track.attach());
          console.log("attached to remote video");
        }
      });

      participant.on("trackSubscribed", (track) => {
        console.log("track subscribed");
        remoteVidRef.current.appendChild(track.attach());
      });
    };

    room.participants.forEach(addParticipant);
    room.on("participantConnected", addParticipant);
  });
  console.log(videoRoomName);
}
