import dyRequest from "../index";

import { IDataType } from "../types";

export function uploadFiles(url: string): Promise<IDataType> {
  return dyRequest.post<IDataType>({
    url: url,
  });
}
