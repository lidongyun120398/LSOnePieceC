import dyRequest from "../index";

import { IDataType } from "../types";

export function getUserInfo(url: string): Promise<IDataType> {
  return dyRequest.post<IDataType>({
    url: url,
  });
}
