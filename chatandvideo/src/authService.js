import { auth, provider } from './firebase';
import { actionTypes } from './reducer';
import TwilioVideo from 'twilio-video';
import React from 'react';

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
    };

    room.participants.forEach(addParticipant);
    room.on('participantConnected', addParticipant);
    sRN(room);
  });
  console.log(vRN);
}
