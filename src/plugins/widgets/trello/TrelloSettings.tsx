import React, { FC, useEffect, useState } from "react";
import { defaultData, Props } from "./types";
import Button from "../../../views/shared/Button";
import { FormattedMessage } from "react-intl";
import { checkAuth } from "./utils";

const TrelloSettings: FC<Props> = ({ data = defaultData, setData}) => {
  const [authenticated, setAuthenticated] = useState<boolean>(true);

  const AUTH_URL_BASE = "https://trello.com/1/authorize" +
    "?expiration=1day" +
    "&callback_method=fragment" + 
    "&scope=read" + 
    "&response_type=token" + 
    `&key=${TRELLO_API_KEY}`

  useEffect(() => {
    console.log("Checking auth status");
    checkAuth();
  }, [authenticated]);
  
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
    // convert token into JWT and alter user data in Firestore
    const callbackResult = await fetch("https://trellocallback-rrswz5h5iq-de.a.run.app", { 
                                      method: "POST", 
                                      headers: { "Content-Type": "application/json"}, 
                                      body: JSON.stringify({ token: token })} 
                                  );

    if (callbackResult.ok) {
      const json = await callbackResult.json(); 
      const token = json.token;
      browser.storage.local.set({ trelloSessionToken: token });
      setAuthenticated(true);
    } else {
      // handle error
      console.log("ERROR");
    }
  }

  const onSignout = async () => {
    await browser.storage.local.remove("trelloSessionToken");
    console.log("Logged out");
    setAuthenticated(false);
  }

  if (authenticated) {
    return (
      <>
        <h5>Authenticated!!</h5>
        <Button primary onClick={onSignout}>Logout</Button>
      </>
    )
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