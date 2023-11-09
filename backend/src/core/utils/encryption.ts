import { createCipheriv, createDecipheriv, createHash } from 'crypto';

const ALGORITHM = 'aes-256-cbc';

const encryptionKey = createHash('sha512')
  .update(process.env.ENCRYPT_SECRET_KEY)
  .digest('hex')
  .substring(0, 32);

const encryptionIV = createHash('sha512')
  .update(process.env.ENCRYPT_SECRET_IV)
  .digest('hex')
  .substring(0, 16);

export const encrypt = async (str: string) => {
  const cipher = createCipheriv(ALGORITHM, encryptionKey, encryptionIV);
  return Buffer.from(
    cipher.update(str, 'utf8', 'hex') + cipher.final('hex'),
  ).toString('base64');
};

export const decrypt = async (str: string) => {
  const buff = Buffer.from(str, 'base64');
  const decipher = createDecipheriv(ALGORITHM, encryptionKey, encryptionIV);
  return (
    decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
    decipher.final('utf8')
  );
};
