import React, { FC, useEffect } from "react";
import { defaultData, Props } from "./types";
import "./Trello.sass";

const Trello: FC<Props> = ({data = defaultData, setData}) => {
  const onEvent = (event: MessageEvent<any>) => {
    if (event.origin === "https://trellocallback-rrswz5h5iq-de.a.run.app") {
      console.log("Received event");
      console.log(event.data);
    }
  }

  useEffect(() => {
    console.log("Attaching event listener");
    window.addEventListener("message", onEvent);

    return () => {
      console.log("Removing event listener");
      window.removeEventListener("message", onEvent);
    }
  }, []);


  return (
    <>
    </>
  )
}

export default Trello;