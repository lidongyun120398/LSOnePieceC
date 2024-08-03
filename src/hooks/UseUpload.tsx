import { ElMessage } from "element-plus";

import upload from "@/utils/upload";

// const props = defineProps<{

// }>

const UseUpload: () => JSX.Element = (): JSX.Element => {
  const handleUpload = () => {};

  let file: File | null = null;
  const inputChange = async (e: Event) => {
    file = (e.target as HTMLInputElement)?.files?.[0] as File;
    const success: boolean = await upload(file);
    if (success)
      ElMessage({
        message: "上传成功",
        type: "success",
      });
  };

  return (
    <>
      <div class="w-fit h-fit flex justify-center items-center m-2">
        <input type="file" class="w-48" onChange={inputChange} />
        <el-button click={handleUpload}>上传文件</el-button>
      </div>
    </>
  );
};

export default UseUpload;
