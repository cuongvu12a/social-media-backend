import { MAX_IDENTITY_NUMBER, MIN_IDENTITY_NUMBER } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';

export const makeModelIdentityNumber = async (
  prisma: PrismaService,
  model: string,
): Promise<string> => {
  const min: number = MIN_IDENTITY_NUMBER;
  const max: number = MAX_IDENTITY_NUMBER;
  let randomNumber: number;
  let identityNumber: string;
  let modelExist: any | null;
  do {
    randomNumber = Math.floor(Math.random() * (max - min) + min);
    identityNumber =
      '0'.repeat(String(max).length - String(randomNumber).length) +
      randomNumber;
    modelExist = await prisma[model].findFirst({
      where: {
        identityNumber,
      },
    });
  } while (modelExist);

  return identityNumber;
};
