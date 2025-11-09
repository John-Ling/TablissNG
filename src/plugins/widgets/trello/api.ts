import { Board, List } from "./types";

export const getBoards = async () => {
    await new Promise((r) => setTimeout(r, 2000));
    return [
        {id: "1", name: "board1", enabledLists: undefined} as Board, 
        {id: "2", name: "board2", enabledLists: undefined} as Board, 
        {id: "3", name: "board3", enabledLists: undefined} as Board,
        {id: "4", name: "board4", enabledLists: undefined} as Board 
    ]
}

export const getLists = async (boardID: string) => {
    // add code to send off jwt

    // simulate api
    await new Promise((r) => setTimeout(r, 2000));
    return [
          { id: "1", name: "list1", boardID: "1", items: [], watch: false } as List,
          { id: "2", name: "list2", boardID: "1", items: [], watch: false } as List,
          { id: "3", name: "list3", boardID: "3", items: [], watch: false } as List,
          { id: "4", name: "list4", boardID: "1", items: [], watch: false } as List,
          { id: "5", name: "list5", boardID: "2", items: [], watch: false } as List,
          { id: "6", name: "list6", boardID: "2", items: [], watch: false } as List,
          { id: "7", name: "list7", boardID: "3", items: [], watch: false } as List,
          { id: "8", name: "list8", boardID: "3", items: [], watch: false } as List,
        ]
}