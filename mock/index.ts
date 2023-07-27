export default [
  {
    url: "/user/login",
    mothod: "post",
    response: () => {
      return {
        code: 0,
        message: "ok",
        data: {
          username: "ldy",
          age: 18,
        },
      };
    },
  },
];
