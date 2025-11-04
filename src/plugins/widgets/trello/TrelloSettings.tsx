import React, { FC, useEffect } from "react";
import { defaultData, Props } from "./types";
import Button from "../../../views/shared/Button";
import { FormattedMessage } from "react-intl";

const TrelloSettings: FC<Props> = ({ data = defaultData, setData}) => {
  const CALLBACK_URL = "https://trellocallback-rrswz5h5iq-de.a.run.app";
  console.log(CALLBACK_URL);
  const AUTH_URL = "https://trello.com/1/authorize" +
      "?expiration=1day" +
      "&callback_method=fragment" + 
      "&scope=read" + 
      "&response_type=token" + 
      `&key=${TRELLO_API_KEY}`
  
  const onAuthenticateClick = async () => {
    const redirectUrl = browser.identity.getRedirectURL();
    console.log(redirectUrl);
    const authUrl = `${AUTH_URL}&return_url=${encodeURIComponent(redirectUrl)}`;
    console.log(authUrl);
    const redirectResponse = await browser.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    });
    const tokenMatch = redirectResponse.match(/token=([^&]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    console.log(token);
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