"use client";

import { OrbitControls, useGLTF, useAnimations, Text } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { CapsuleCollider, Physics, RigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import Lights from "./lights";
import Level from "./level";
import { Player } from "./player";
import { Suspense, useState, useEffect, useRef } from "react";
import MalePlayer from "./actors/male";

interface Client {
  position: [number, number, number];
  rotation: [number, number, number];
}

const generateDummyClients = (num: number) => {
  const clients: Record<string, Client> = {};
  for (let i = 0; i < num; i++) {
    clients[i.toString()] = {
      // p ** 2 + (num / Math.round(Object.keys(clients) / 2)) => sphere sparse redux
      position: [Math.random() * 10, 1, Math.random() * 10],
      rotation: [0, 0, 0],
    };
  }
  return clients;
};

export default function Experience(props: any) {
  const [clients, setClients] = useState<Record<string, Client>>({});

  const knightCharacter = useGLTF("/KnightCharacter.gltf");
  const knightAnimations = useAnimations(
    knightCharacter.animations,
    knightCharacter.scene
  );

  useEffect(() => {
    if (props.socketClient) {
      props.socketClient.emit("populate", {});

      // @ts-ignore
      props.socketClient.on("move", (clients: Record<string, Client>) => {
        setClients(clients);
      });
    }
  }, [props.socketClient]);

  const { orbitControls, debug } = useControls("Debug", {
    orbitControls: false,
    debug: true,
  });

  const PlayerWrapper = (props: any) => {
    const playerCharacter = useGLTF("/KnightCharacter.gltf");
    const playerAnimations = useAnimations(
      playerCharacter.animations,
      playerCharacter.scene
    );

    const { id, position, rotation } = props;
    return (
      <RigidBody
        lockRotations={true}
        colliders={false}
        position={[position[0], position[1], position[2]]}
        rotation={[rotation[0], rotation[1], rotation[2]]}
        restitution={0.2}
        friction={1}
      >
        {/* <primitive object={playerCharacter.scene} scale={0.2} position-y={-1} /> */}
        {/* <MalePlayer /> */}
        {/* <Text
          color="black"
          anchorX="center"
          anchorY="middle"
          scale={0.25}
          position={[0, 0.25, 0]}
        >
          {id}
        </Text> */}
        <CapsuleCollider args={[0.3, 0.25]} position={[0, -0.45, 0]} />
      </RigidBody>
    );
  };

  return (
    <>
      <Perf position="top-left" />
      {orbitControls && <OrbitControls makeDefault />}
      <Physics timeStep="vary" debug={true}>
        <Lights />
        <Level />
        <Suspense fallback={null}>
          <Player
            orbitControls={orbitControls}
            socketClient={props.socketClient}
          />
          {Object.keys(clients)
            .filter((clientKey) => clientKey !== props.socketClient.id)
            .map((client) => {
              const { position, rotation } = clients[client];
              return (
                <PlayerWrapper
                  key={client}
                  id={client}
                  position={position}
                  rotation={rotation}
                />
              );
            })}
        </Suspense>
      </Physics>
    </>
  );
}
