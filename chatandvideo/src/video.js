import React, { useEffect, useRef } from "react";

import TwilioVideo from "twilio-video";

function Video({ token, videoRoomName }) {
  const localVidRef = useRef();
  const remoteVidRef = useRef();

  useEffect(() => {
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
  }, [token]);

  return (
    <div>
      <div ref={localVidRef} />
      <div ref={remoteVidRef} />
    </div>
  );
}

export default Video;
