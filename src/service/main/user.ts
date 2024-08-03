import dyRequest from "../index";

import { IDataType } from "../types";

export function getUserInfo(): Promise<IDataType> {
  return dyRequest.post<IDataType>({
    url: "/user/login",
  });
}
