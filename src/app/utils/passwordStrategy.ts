import crypto from 'crypto';
import { ScryptOptions } from 'crypto';
import config from '../config';

export const generateStrongPassword = async (
  password: string,
): Promise<string | undefined> => {
  const salt: string = config.SALT_ROUND as string;
  try {
    const options: ScryptOptions = {
      N: 16384, //Math.pow(2, 14)
      r: 8,
      p: 1,
      maxmem: 32 * 1024 * 1024, // 32MB maximum memory
    };
    const derivedKey: Buffer = await new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 64, options, (err, key) => {
        if (err) {
          reject(err);
        } else {
          resolve(key);
        }
      });
    });
    const hashedPassword = derivedKey.toString('base64');
    return hashedPassword;
  } catch (error) {
    console.log('---> scrypt hashing error:: ', error);
  }
};

export const verifyPassword = async (
  inputPassword: string,
  regPassword: string,
) => {
  const salt: string = config.SALT_ROUND as string;
  try {
    const options: ScryptOptions = {
      N: 16384, // Math.pow(2, 14)
      r: 8,
      p: 1,
      maxmem: 32 * 1024 * 1024, // 32MB maximum memory
    };

    const derivedKey: Buffer = await new Promise((resolve, reject) => {
      crypto.scrypt(inputPassword, salt, 64, options, (err, key) => {
        if (err) {
          reject(err);
        } else {
          resolve(key);
        }
      });
    });
    
    const inputHashedPassword: string = derivedKey.toString('base64');
    const isMatched: boolean = inputHashedPassword === regPassword;
    return isMatched;
  } catch (error) {
    console.log('---> scrypt verification error:: ', error);
  }
};

/*
// const salt = crypto.randomBytes(256).toString("base64");
A higher N value (e.g.,1024(default) 16384, 32768, etc.) significantly increases the computational cost, making it more challenging for attackers to perform successful attacks but potentially impacting the performance of your system during the hashing process due to increased computational requirements.

*/
