declare module "*.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare var process: {
  env: {
    API_BASE_URL?: string;
    [key: string]: string | undefined;
  };
};
