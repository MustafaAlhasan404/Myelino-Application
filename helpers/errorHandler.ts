export const errorHandler = (error: any) => {
  const message: string =
    typeof error.response.data.message === 'string'
      ? error.response.data.message
      : error.response.data.message[0];

  return message;
};
