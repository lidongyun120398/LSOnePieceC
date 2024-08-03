import SparkMD5 from "spark-md5";

import { uploadFiles } from "@/service/main/upload";

let chunkList: Blob[] = [];

const upload = async (file: File) => {
  chunkList = createChunk(file!);
  const fileHash: string = await hash(chunkList);

  const chunkUploadResults = await uploadChunks(fileHash, chunkList);
  const allChunksUploadedSuccessfully = chunkUploadResults.every((result) => result.status === "fulfilled");

  if (allChunksUploadedSuccessfully) {
    return true;
  } else {
    throw new Error("Some chunks failed to upload");
  }
};

const createChunk = (file: File, defaultSize: number = 1024 * 1024 * 1) => {
  const chunkList = [];
  let cur: number = 0;
  while (cur < file.size) {
    chunkList.push(file.slice(cur, cur + defaultSize));
    cur += defaultSize;
  }
  return chunkList;
};

const hash = (chunks: Blob[]): Promise<string> => {
  return new Promise((resolve) => {
    const spark = new SparkMD5();
    const _read = (i: number) => {
      if (i >= chunks.length) {
        resolve(spark.end());
        return;
      }
      const blob: Blob = chunks[i];
      const reader: FileReader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>): void => {
        const bytes = e.target!.result;
        spark.append(bytes as string);
        _read(i + 1);
      };
      reader.readAsArrayBuffer(blob);
    };
    _read(0);
  });
};

const uploadChunks = (hash: string, chunks: Blob[]) => {
  const result = chunks.map((item: Blob, index: number): Promise<any> => {
    const formData = new FormData();
    formData.append("index", String(index));
    formData.append("chunk", item);
    formData.append("fileHash", hash);

    return uploadFiles(formData);
  });

  return Promise.allSettled(result);
};

export default upload;
