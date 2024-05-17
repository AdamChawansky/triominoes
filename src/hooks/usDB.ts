// import { useEffect, useRef, useState } from "react";
// import { RoomApi } from "../lib/apiRoom";
// import { RoomInit, RoomState } from "../lib/types";

// export function useDB(props: {
//   init: RoomInit;
// }) {
//   const api = useRef(new RoomApi(props.init));
//   const [room, setRoom] = useState<RoomState | null>();

//   useEffect(() => {
//     (async() => {
//       await api.current.connect(state => setRoom(state));
//     })();
//   }, [setRoom]);

//   return {
//     api,
//     room,
//   }
// }