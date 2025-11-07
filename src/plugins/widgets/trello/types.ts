import { API } from "../../types";

export type Board = {
  id: string;
  name: string;
  enabledLists?: List[];
}

export type List = {
  id: string;
  name: string;
  boardID: string;
  watch: boolean;
  items?: string[];
}

export type Data = {
  selectedBoard: Board | null;  // user's current board selection
  selectedID: string | null;
};

export type Props = API<Data>;

export const defaultData: Data = {
  selectedBoard: null, 
  selectedID: null,

};
