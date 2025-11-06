export const checkAuth = async () => {
    const sessionToken = await browser.storage.local.get("trelloSessionToken");
    const token = sessionToken.trelloSessionToken;
    console.log(token);
}