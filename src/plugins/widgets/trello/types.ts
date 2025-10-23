import { API } from "../../types";

export type TrelloList = {
    // can either use list id or name for identification
    listID?: string;
    name: string;
    boardID: string;
}

export type Data = {
    lists: TrelloList[];
};

export type Props = API<Data>;

export const defaultData: Data = {
  lists: []
};
