import { getToken } from "./utils";

export const getBoards = async () => {
    const token = await getToken();
    if (!token) {
        return null;
    }

    const fetchBoardRes = await fetch("https://getboards-rrswz5h5iq-de.a.run.app", { 
                                    method: "POST", 
                                    headers: { "Authorization": `Bearer ${token}` },
                                });

    if (!fetchBoardRes.ok) {
        return null;
    }

    const boards = (await fetchBoardRes.json()).boards;
    return boards;
}

export const getLists = async (boardID: string) => {
    const token = await getToken();
    if (!token) {
        return null;
    }

    const fetchListRes = await fetch("https://getlists-rrswz5h5iq-de.a.run.app", {
                                    method: "POST",
                                    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                                    body: JSON.stringify({ boardID: boardID })
                                });

    if (!fetchListRes.ok) {
        return null;
    }

    const lists = (await fetchListRes.json()).lists;
    return lists;
}