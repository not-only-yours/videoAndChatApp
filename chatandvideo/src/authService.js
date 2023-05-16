import { auth, provider } from './firebase';
import { actionTypes } from './reducer';
import TwilioVideo from 'twilio-video';

export function signIn(dispatch) {
  return () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        result.user.roles = [];
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch((error) => alert(error.message));
  };
}

export function tC(tk, vRN, lVR, rVR, sRN) {
  TwilioVideo.connect(tk, {
    video: true,
    audio: true,
    name: vRN,
  }).then((room) => {
    // Attach the local video
    TwilioVideo.createLocalVideoTrack().then((track) => {
      lVR.current.appendChild(track.attach());
    });

    const addParticipant = (participant) => {
      console.log('new participant!');
      console.log(participant);
      participant.tracks.forEach((publication) => {
        if (publication.isSubscribed) {
          const track = publication.track;

          rVR.current.appendChild(track.attach());
          console.log('attached to remote video');
        }
      });

      participant.on('trackSubscribed', (track) => {
        console.log('track subscribed');
        rVR.current.appendChild(track.attach());
      });
      participant.on('trackUnsubscribed', (track) =>
        track.detach().forEach((element) => element.remove())
      );
    };

    room.participants.forEach(addParticipant);
    room.on('participantConnected', addParticipant);
    room.on('participantDisconnected', async () => {
      room.participants.forEach(participantDisconnected);
    });
    sRN(room);

    const participantDisconnected = (participant) => {
      room.participants = room.participants.filter(
        (item) => item.identity !== participant.identity
      );

      if (room.activeRoom.participants?.size === 0) room.showRemote = false;
      if (document.getElementById(participant.sid))
        document.getElementById(participant.sid).remove();
    };
  });
  console.log(vRN);
}
