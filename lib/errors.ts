import { Response } from 'express';

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number,
    public readonly errorList: string[] = [],
  ) {
    super(message);
  }
}

export const handleAPIError = (error: any, res: Response) => {
  if (error instanceof AppError) {
    return res
      .status(error.status)
      .json({ error: error.message, errorList: error.errorList });
  }

  return res.status(400).json({ error });
};
