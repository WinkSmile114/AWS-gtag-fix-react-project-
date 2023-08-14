const logOrange = (messageTitle: string, message: any) => {
  console.log(
    `%c${messageTitle}`,
    'color:#eb8334; font-size: 40px; text-shadow: 3px 3px 0 rgb(0, 26, 140)',
    message,
  );
};

const logGreen = (messageTitle: string, message: any) => {
  console.log(
    `%c${messageTitle}`,
    'color:#94d1ac; font-size: 40px; text-shadow: 3px 3px 0 rgb(74, 79, 76)',
    message,
  );
};

export { logOrange, logGreen };
