const uploadFile = [
  {
    url: "/upload",
    mothod: "post",
    response: () => {
      return {
        code: 0,
        message: "ok",
        data: {
          fileInfo: {},
        },
      };
    },
  },
];

export default uploadFile;
