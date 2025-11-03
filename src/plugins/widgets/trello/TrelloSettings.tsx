import React, { FC } from "react";
import { defaultData, Props } from "./types";
import Button from "../../../views/shared/Button";
import { FormattedMessage } from "react-intl";

const TrelloSettings: FC<Props> = ({ data = defaultData, setData}) => {
  const CALLBACK_URL = "https://trellocallback-rrswz5h5iq-de.a.run.app";
  const AUTH_URL = "https://trello.com/1/authorize" +
      "?expiration=1day" +
      "&callback_method=fragment" + 
      `&return_url=${encodeURIComponent(CALLBACK_URL)}` + 
      "&scope=read" + 
      "&response_type=token" + 
      `&key=${TRELLO_API_KEY}`

  const onAuthenticateClick = () => {
    window.location.href = AUTH_URL
  }

  return (
    <>
      <div className="TrelloSettings">
        <label>
          <FormattedMessage
            id="plugins.trello.authenticate"
            defaultMessage="Sign in With Trello"
            description="Sign in with Trello"
          />
        </label>
        <Button primary onClick={onAuthenticateClick}>Authenticate</Button>
      </div>
    </>
  )
}

export default TrelloSettings;