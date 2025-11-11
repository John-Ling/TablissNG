export const runAuthFlow = async () => {
    const AUTH_URL_BASE = "https://trello.com/1/authorize" +
        "?expiration=1day" +
        "&callback_method=fragment" +
        "&scope=read" +
        "&response_type=token" +
        `&key=${TRELLO_API_KEY}`    

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
                                      body: JSON.stringify({ token: token })
                                    });

    if (callbackResult.ok) {
      const json = await callbackResult.json();
      const token = json.token;
      await browser.storage.local.set({ trelloSessionToken: token });
      return true;
    } else {
      // handle error
      console.log("ERROR");
      return false;
    }
}

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