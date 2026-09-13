/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@prisma/client' {
  export class PrismaClient {
    [key: string]: any;
    constructor(...args: any[]);
    $disconnect(): Promise<void>;
  }
}
