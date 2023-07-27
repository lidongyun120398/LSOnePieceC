import dyRequest from "../index";

import { IDataType } from "../types";

export function getUserInfo(url: string) {
  return dyRequest.post<IDataType>({
    url: url,
  });
}
