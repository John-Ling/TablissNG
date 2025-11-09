import React, { FC, useEffect, useState } from "react";
import { BoardPreferences, defaultData, Props } from "./types";
import Button from "../../../views/shared/Button";
import { FormattedMessage } from "react-intl";
import { useCachedEffect } from "../../../hooks";
import { checkAuth, getPreferences , setPreferences } from "./utils";
import { Board, List } from "./types";
import ListCheckbox from "./ui/ListCheckbox";
import { getBoards, getLists } from "./api";

const TrelloSettings: FC<Props> = ({ data = defaultData, setData }) => {
  const MAX_LISTENERS = 4; // maximum lists a user can select
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  const [selectedListCount, setSelectedListCount] = useState<number>(0);

  const [availableBoards, setAvailableBoards] = useState<{
    boards: Board[];
    loading: boolean;
  }>({ boards: [], loading: true });

  const [availableLists, setAvailableLists] = useState<{
    lists: List[];
    loading: boolean;
  }>({ lists: [], loading: true });

  const AUTH_URL_BASE = "https://trello.com/1/authorize" +
    "?expiration=1day" +
    "&callback_method=fragment" +
    "&scope=read" +
    "&response_type=token" +
    `&key=${TRELLO_API_KEY}`

  useEffect(() => {
    const effect = async () => {
      console.log("Checking auth status");
      setAuthenticated(await checkAuth());
    }
    effect();
  }, []);

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
      await browser.storage.local.set({ trelloSessionToken: token });
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

  const onListCheckboxSelect = (listID: string) => {
    // limit to a maximum of 4 
    const found = availableLists.lists.find((list: List) => list.id === listID);
    if (!found) {
      return;
    }

    if (found.watch) {
      // set to unchecked
      setSelectedListCount(count => count - 1);
    } else {
      // set to checked
      if (selectedListCount + 1 > MAX_LISTENERS) {
        return;
      }
      setSelectedListCount(count => count + 1); 
    }
    
    // update UI state
    setAvailableLists({
      lists: availableLists.lists.map((list: List) => { 
        return list.id === listID ? { ...list, watch: !list.watch } : list
      }),
      loading: false,
    });

    // save preferences
    const newPreferences: BoardPreferences = {selectedLists: availableLists.lists.filter((list: List ) => { return list.watch } )}
    setPreferences(data.selectedID, newPreferences);
  }

  useEffect(() => {
    // fetch available boards for use
    const effect = async () => {
      // simulate api call
      console.log("Fetching boards");

      const boards = await getBoards();
      setAvailableBoards({
        boards: boards,
        loading: false
      })
    };
    effect();
  }, []);

  useEffect(() => {
    // when a board is selected pull the lists under it
    setAvailableLists({ ...availableLists, loading: true });
    const effect = async () => {
      let lists = await getLists("placeholder");

      console.log("Loading preferences");
      // load preferences if they exist
      if (!!data.selectedID) {
        const preferences = await getPreferences(data.selectedID);

        if (preferences) {
          // apply preferences
          lists.forEach(list => {
            const match = preferences.selectedLists.find(item => item.id === list.id);
            if (match) {
              list.watch = match.watch;
            }
          });                  
        }
      }

      setAvailableLists({
        lists: lists,
        loading: false,
      });

      
    };
    effect();
  }, [data.selectedID]);

  if (authenticated) {
    return (
      <>
        <label>
          <FormattedMessage
            id="plugins.trello.boardSelect"
            defaultMessage="Select your board"
            description="Select your board"
          />
          <div className="board-select-container">
            {availableBoards.loading ? (
              <p style={{marginLeft: "4px"}}>Loading...</p>
              ) : 
              (
                <select
                  onChange={(event) =>
                    setData({ ...data, selectedID: event.target.value })
                  }
                >
                  {availableBoards.boards.map((board: Board) => {
                    return (
                      <option key={board.id} value={board.id}>
                        {board.name}
                      </option>
                    );
                  })}
                </select>
              )}
          </div>
        </label>
        <div className="offset">
          <label>
            <FormattedMessage
              id="plugins.trello.listSelect"
              defaultMessage="Select up to 4 lists to watch"
              description="Select up to 4 lists to watch"
            />
            <div className="list-select-container">
              {availableLists.loading ? (
                <p>Loading...</p>
              ) : (
                availableLists.lists.map((list: List, index) => {
                  return (
                    <ListCheckbox   
                      key={list.id}
                      checked={list.watch} 
                      index={index} 
                      listID={list.id} 
                      label={list.name} 
                      onChange={onListCheckboxSelect} 
                    />
                  );
                })
              )}
            </div>
          </label>
        </div>
        <div className="offset">
          <label>
            <FormattedMessage
              id="plugins.trello.logout"
              defaultMessage="Sign Out"
              description="Sign Out"
            />
          </label>
          <Button primary onClick={onSignout}>Sign Out</Button>
        </div>
      </>
    );
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
      <Button primary onClick={onAuthenticateClick}>Authenticate</Button>
    </>
  );
};

export default TrelloSettings;
