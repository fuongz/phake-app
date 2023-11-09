import * as bcrypt from 'bcrypt';

export const hash = async (str: string) => {
  const saltOrRounds = 10;
  return await bcrypt.hash(str, saltOrRounds);
};
