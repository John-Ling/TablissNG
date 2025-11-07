// check if trello session token exists and has not expired
// returns true if user is properly authenticated
export const checkAuth = async () => {
    try {
        const obj = await browser.storage.local.get("trelloSessionToken");
        const token: string | null = typeof obj["trelloSessionToken"] === "string" ? obj["trelloSessionToken"] : null;
        console.log(token);

        if (!token) {
            return false;
        }
        
        const payload = JSON.parse(atob(token.split('.')[1]));
        const authenticated = payload.exp * 1000 > Date.now();
        console.log(authenticated);
        return authenticated;
    } catch (error) {
        console.error(error);
        return false;
    }
}