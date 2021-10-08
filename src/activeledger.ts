import {
  Connection,
  IBaseTransaction,
  TransactionHandler,
  ILedgerResponse,
  LedgerEvents,
} from '@activeledger/sdk';
import { ActiveRequest } from '@activeledger/activeutilities';

/**
 * Manges Activeledger transactions in a central location
 *
 * @export
 * @class Activeledger
 */
export class Activeledger {
  /**
   * Current Ledger node connection
   *
   * @private
   * @type {Connection}
   * @memberof Activeledger
   */
  private connection: Connection;

  constructor(private config: any) {
    // Create Connection
    this.connection = new Connection(
      config.connection.scheme,
      config.connection.address,
      config.connection.port,
    );
  }

  /**
   * Return Activeledger SDK Event Object
   *
   * @returns {LedgerEvents}
   * @memberof Activeledger
   */
  public getEvents(): LedgerEvents {
    return new LedgerEvents(this.config.core);
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
      (await ActiveRequest.send(`${this.config.core}/api/stream/${id}`, 'GET'))
        .data as any
    ).stream;
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
  public async send(tx: IBaseTransaction): Promise<ILedgerResponse> {
    // Transaction Handler
    const txHandler = new TransactionHandler();
    return await txHandler.sendTransaction(tx, this.connection);

    // Implement Generic error handling here
  }
}
