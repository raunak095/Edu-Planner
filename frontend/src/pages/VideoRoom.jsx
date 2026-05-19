import { useEffect, useRef, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { io } from "socket.io-client";

import Peer from "simple-peer/simplepeer.min.js";

const socket = io(
  "https://edu-planner-backrnd.onrender.com",
  {
    transports: ["websocket"],
  }
);

export default function VideoRoom() {

  const [stream, setStream] =
    useState(null);

  const [peerId, setPeerId] =
    useState("");

  const [remoteSignal, setRemoteSignal] =
    useState("");

  const [mySignal, setMySignal] =
    useState("");

  const myVideo = useRef();

  const userVideo = useRef();

  const peerRef = useRef();

  // ================= GET CAMERA =================

  useEffect(() => {

    navigator.mediaDevices

      .getUserMedia({

        video: true,

        audio: true,

      })

      .then((currentStream) => {

        setStream(currentStream);

        if (myVideo.current) {

          myVideo.current.srcObject =
            currentStream;

        }

      });

  }, []);

  // ================= CREATE ROOM =================

  const createRoom = () => {

    const peer = new Peer({

      initiator: true,

      trickle: false,

      stream,

    });

    peer.on("signal", (data) => {

      const signalData =
        JSON.stringify(data);

      setMySignal(signalData);

    });

    peer.on("stream", (remoteStream) => {

      userVideo.current.srcObject =
        remoteStream;

    });

    peerRef.current = peer;

  };

  // ================= JOIN ROOM =================

  const joinRoom = () => {

    const peer = new Peer({

      initiator: false,

      trickle: false,

      stream,

    });

    peer.on("signal", (data) => {

      const signalData =
        JSON.stringify(data);

      setMySignal(signalData);

    });

    peer.on("stream", (remoteStream) => {

      userVideo.current.srcObject =
        remoteStream;

    });

    peer.signal(JSON.parse(remoteSignal));

    peerRef.current = peer;

  };

  // ================= CONNECT PEERS =================

  const connectPeers = () => {

    peerRef.current.signal(
      JSON.parse(peerId)
    );

  };

  return (

    <DashboardLayout role="student">

      <div
        className="card"
        style={{
          borderRadius: "24px",
        }}
      >

        <h2>🎥 Video Meeting Room</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "20px",
            marginTop: "24px",
          }}
        >

          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            style={{
              width: "100%",
              borderRadius: "20px",
              background: "#000",
            }}
          />

          <video
            playsInline
            ref={userVideo}
            autoPlay
            style={{
              width: "100%",
              borderRadius: "20px",
              background: "#000",
            }}
          />

        </div>

        <div
          style={{
            marginTop: "24px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >

          <button
            onClick={createRoom}
            style={{
              padding: "12px 18px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >

            🎥 Create Room

          </button>

          <button
            onClick={joinRoom}
            style={{
              padding: "12px 18px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >

            🔗 Join Room

          </button>

          <button
            onClick={connectPeers}
            style={{
              padding: "12px 18px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >

            ⚡ Connect

          </button>

        </div>

        <textarea
          value={mySignal}
          readOnly
          placeholder="Your Room Code"
          style={{
            width: "100%",
            height: "120px",
            marginTop: "20px",
            borderRadius: "14px",
            padding: "14px",
          }}
        />

        <textarea
          value={remoteSignal}
          onChange={(e) =>
            setRemoteSignal(
              e.target.value
            )
          }
          placeholder="Paste Other User Code"
          style={{
            width: "100%",
            height: "120px",
            marginTop: "20px",
            borderRadius: "14px",
            padding: "14px",
          }}
        />

      </div>

    </DashboardLayout>

  );

}