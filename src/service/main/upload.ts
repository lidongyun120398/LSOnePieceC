import dyRequest from "../index";

import { IDataType } from "../types";

export function uploadFiles(formData: FormData): Promise<IDataType> {
  return dyRequest.post<IDataType>({
    url: "/upload",
    data: formData,
  });
}
