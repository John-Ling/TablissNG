import React, { FC, useEffect } from "react";
import { defaultData, Props } from "./types";
import Button from "../../../views/shared/Button";
import { FormattedMessage } from "react-intl";

const TrelloSettings: FC<Props> = ({ data = defaultData, setData}) => {
  const AUTH_URL_BASE = "https://trello.com/1/authorize" +
      "?expiration=1day" +
      "&callback_method=fragment" + 
      "&scope=read" + 
      "&response_type=token" + 
      `&key=${TRELLO_API_KEY}`
  
  const onAuthenticateClick = async () => {
    const redirectUrl = browser.identity.getRedirectURL();
    const AUTH_URL = `${AUTH_URL_BASE}&return_url=${encodeURIComponent(redirectUrl)}`;
    const redirectResponse = await browser.identity.launchWebAuthFlow({
      url: AUTH_URL,
      interactive: true
    });

    // receive token granted by Trello    
    const tokenMatch = redirectResponse.match(/token=([^&]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;    
    console.log(token);

    const callbackResult = await fetch("https://trellocallback-rrswz5h5iq-de.a.run.app", { method: "POST", body: JSON.stringify({ token: token })} );
    if (callbackResult.ok) {
      const json = await callbackResult.json();  
      const session = json.session;
      localStorage.setItem("sessionToken", session);
    } else {
      // handle error
    }
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