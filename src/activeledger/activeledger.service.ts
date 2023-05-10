import { ActiveRequest } from "@activeledger/activeutilities";
import {
  LedgerEvents,
  IBaseTransaction,
  ILedgerResponse,
  TransactionHandler,
  Connection,
} from "@activeledger/sdk";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ActiveledgerService {
  private connection: Connection;

  constructor() {
    // Create Connection
    this.connection = new Connection(
      process.env.ACTIVESCHEME,
      process.env.ACTIVEADDRESS,
      process.env.ACTIVEPORT
    );
  }

  /**
   * Return Activeledger SDK Event Object
   *
   * @returns {LedgerEvents}
   * @memberof Activeledger
   */
  public getEvents(): LedgerEvents {
    return new LedgerEvents(process.env.ACTIVECORE);
  }

  public async getPublicAddress(id: string): Promise<unknown> {
    return (
      await ActiveRequest.send(
        `${process.env.ACTIVECORE}/api/getPublic/${id}`,
        "GET"
      )
    ).data as any;
  }

  /**
   * Get Stream for node API server.
   *
   * @param {string} id
   * @returns {Promise<unknown>}
   * @memberof Activeledger
   */
  public async getStream(id: string): Promise<unknown> {
    return (
      await ActiveRequest.send(
        `${process.env.ACTIVECORE}/api/getStream/${id}`,
        "GET"
      )
    ).data as any;  
  }

  /**
   * Generic Transaction Sender (Single Intput)
   *
   * @param {string} namespace
   * @param {string} contract
   * @param {transHelperInput} data
   * @param {IKey} [key]
   * @param {boolean} [self=false]
   * @returns
   * @memberof Activeledger
   */
  public async send(tx: string | IBaseTransaction): Promise<ILedgerResponse> {
    // Transaction Handler
    const txHandler = new TransactionHandler();
    const parsedTx =
      typeof tx === "string"
        ? JSON.parse(Buffer.from(tx, "base64").toString())
        : tx;
    console.log(parsedTx);
    return await txHandler.sendTransaction(parsedTx, this.connection);
    // Implement Generic error handling here
  }
}
