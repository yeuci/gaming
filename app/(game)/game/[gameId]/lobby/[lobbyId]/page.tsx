"use client";

import {
  KeyboardControls,
  KeyboardControlsEntry,
  Loader,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useMemo, useEffect, useState } from "react";
import { Leva } from "leva";
import Experience from "@/components/experience";
import { io } from "socket.io-client";

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
};

type Action = {
  name: string;
  keys: string[];
};

export default function Lobby() {
  const [socketClient, setSocketClient] = useState(null);
  const map = useMemo(
    () => [
      { name: "forward", keys: ["ArraowUp", "KeyW"] },
      { name: "backward", keys: ["ArraowDown", "KeyS"] },
      { name: "leftward", keys: ["ArraowLeft", "KeyA"] },
      { name: "rightward", keys: ["ArraowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );

  useEffect(() => {
    // On mount initialize the socket connection
    // @ts-ignore
    setSocketClient(io("http://localhost:4444"));

    // Dispose gracefuly
    return () => {
      // @ts-ignore
      if (socketClient) socketClient.disconnect();
    };
  }, []);

  return (
    socketClient && (
      <>
        <Leva />
        <KeyboardControls map={map}>
          <Canvas
            shadows
            camera={{
              fov: 45,
              near: 0.1,
              far: 200,
              position: [2.5, 4, 6],
            }}
          >
            <Suspense fallback={null}>
              <Experience
                socketClient={socketClient}
                setSocketClient={setSocketClient}
              />
            </Suspense>
          </Canvas>
          <Loader />
        </KeyboardControls>
      </>
    )
  );
}
