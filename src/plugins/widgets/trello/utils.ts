// check if trello session token exists and has not expired

import { BoardPreferences } from "./types";

// returns true if user is properly authenticated
export const checkAuth = async () => {
    try {
        const token = await getToken();
        if (!token) {
            return false;
        }
        
        const payload = JSON.parse(atob(token.split('.')[1]));
        const authenticated = payload.exp * 1000 > Date.now();
        return authenticated;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const setPreferences = async (boardID: string | null, preferences: BoardPreferences) => {
    if (!boardID) {
        throw new Error("Received NULL boardID");
    }

    try {
        console.log("Setting preference");
        await browser.storage.local.set({ [boardID]: preferences });
    } catch (error) {
        console.error(error);
        throw error;
    }
    
}

export const getPreferences = async (boardID: string | null) => {
    if (!boardID) {
        throw new Error("Received NULL boardID");
    }

    try {
        console.log("Getting preference for board ", boardID);
        const obj = await browser.storage.local.get(boardID);
        return obj[boardID] as BoardPreferences;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getToken = async () => {
    const obj = await browser.storage.local.get("trelloSessionToken");
    const token: string | null = typeof obj["trelloSessionToken"] === "string" ? obj["trelloSessionToken"] : null;

    if (!token) {
        return null;
    }
    return token
}

// returns the id of the authenticated user based on the token provided
export const getAuthenticatedUser = async (token: string) => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
}