"use client";

import { RigidBody } from "@react-three/rapier";

const Level = () => {
  return (
    <>
      <RigidBody
        type="fixed"
        restitution={0.2}
        friction={1}
        scale={[10, 0.2, 10]}
      >
        <mesh position={[0, -0.1, 0]} scale={[30, 0.2, 30]} receiveShadow>
          <boxGeometry />
          <meshStandardMaterial color={"DarkSlateGrey"} />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Level;
