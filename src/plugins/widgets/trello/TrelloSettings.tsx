import React, { FC, useEffect, useState } from "react";
import { defaultData, Props } from "./types";
import Button from "../../../views/shared/Button";
import { useCachedEffect } from "../../../hooks";
import { FormattedMessage } from "react-intl";
import { checkAuth } from "./utils";
import { Board, List } from "./types";
import Select from "react-dropdown-select";


const TrelloSettings: FC<Props> = ({ data = defaultData, setData}) => {
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  const [availableBoards, setAvailableBoards] = useState<{ boards: Board[], loading: boolean }>({boards: [], loading: true});
  const [availableLists, setAvailableLists] = useState<{ lists: List[], loading: boolean }>({ lists: [], loading: true });

  // const AUTH_URL_BASE = "https://trello.com/1/authorize" +
  //   "?expiration=1day" +
  //   "&callback_method=fragment" + 
  //   "&scope=read" + 
  //   "&response_type=token" + 
  //   `&key=${TRELLO_API_KEY}`

  // useEffect(() => {
  //   const effect = async () => {
  //     console.log("Checking auth status");
  //     setAuthenticated(await checkAuth());
  //   }
  //   effect();
  // }, []);
  
  // const onAuthenticateClick = async () => {
  //   const redirectUrl = browser.identity.getRedirectURL();
  //   const AUTH_URL = `${AUTH_URL_BASE}&return_url=${encodeURIComponent(redirectUrl)}`;
  //   const redirectResponse = await browser.identity.launchWebAuthFlow({
  //     url: AUTH_URL,
  //     interactive: true
  //   });

  //   // receive token granted by Trello
  //   const tokenMatch = redirectResponse.match(/token=([^&]+)/);
  //   const token = tokenMatch ? tokenMatch[1] : null;
  //   // convert token into JWT and alter user data in Firestore
  //   const callbackResult = await fetch("https://trellocallback-rrswz5h5iq-de.a.run.app", { 
  //                                     method: "POST", 
  //                                     headers: { "Content-Type": "application/json"}, 
  //                                     body: JSON.stringify({ token: token })} 
  //                                 );

  //   if (callbackResult.ok) {
  //     const json = await callbackResult.json(); 
  //     const token = json.token;
  //     browser.storage.local.set({ trelloSessionToken: token });
  //     setAuthenticated(true);
  //   } else {
  //     // handle error
  //     console.log("ERROR");
  //   }
  // }

  // const onSignout = async () => {
  //   await browser.storage.local.remove("trelloSessionToken");
  //   console.log("Logged out");
  //   setAuthenticated(false);
  // }

  useEffect(() => {
    // fetch available boards for use
    const effect = async () => {
      // simulate api call
      console.log("Fetching boards");
      await new Promise(r => setTimeout(r, 2000));
      setAvailableBoards( { boards: [ {id: "1", name: "board1", enabledLists: undefined} as Board, {id: "2", name: "board2", enabledLists: undefined} as Board, {id: "3", name: "board3", enabledLists: undefined} as Board ], loading: false });
    }
    effect();
  }, []);

  useEffect(() => {
    // when a board is selected pull the lists under it
    // requirws JWT
    const effect = async () => {
      console.log("Fetching lists");
      await new Promise(r => setTimeout(r, 2000));
      setAvailableLists({ lists: [ { id: "1", name: "list1", boardID: "1", items: [] } as List, { id: "2", name: "list2", boardID: "1", items: [] } as List, { id: "3", name: "list3", boardID: "3", items: [] } as List ], loading: false})
    }
    effect();
  }, [data.selectedID])

  if (authenticated) {
    return (
        <>
          <label>
            <FormattedMessage
              id="plugins.trello.boardSelect"
              defaultMessage="Select your board"
              description="Select your board"
            />

            {availableBoards.loading ? <p>Loading</p> :
            <select 
              onChange={(event) => setData({...data, selectedID: event.target.value})}
            >
              {availableBoards.boards.map((board: Board) => {
                return <option key={board.id} value={board.id}>{board.name}</option>
              })}
            </select>
            }
          </label>
          <div className="offset">
            <FormattedMessage
              id="plugins.trello.listSelect"
              defaultMessage="Select up to 4 lists to watch"
              description="Select up to 4 lists to watch"
            />
            <div className="list-select-container">
              <label>
                <input 
                  type="checkbox"
                />{" "}
                Test
              </label>
              <label>
                <input 
                  type="checkbox"
                />{" "}
                Test
              </label>
              <label>
                <input 
                  type="checkbox"
                />{" "}
                Test
              </label>
              <label>
                <input 
                  type="checkbox"
                />{" "}
                Test
              </label>
            </div>
            
          </div>
          
          {/* <Button primary onClick={onSignout}>Logout</Button> */}
        </>
    )
  }

  return (
      <>
        <label>
          <FormattedMessage
            id="plugins.trello.authenticate"
            defaultMessage="Sign in With Trello"
            description="Sign in with Trello"
          />
        </label>
        {/* <Button primary onClick={onAuthenticateClick}>Authenticate</Button> */}
      </>
  )
}

export default TrelloSettings;