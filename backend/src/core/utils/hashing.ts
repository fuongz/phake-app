import * as bcrypt from 'bcrypt';

export const hash = async (str: string) => {
  const saltOrRounds = 10;
  return await bcrypt.hash(str, saltOrRounds);
};

export const compareHash = async (str: string, hashStr: string) => {
  return await bcrypt.compare(str, hashStr);
};
