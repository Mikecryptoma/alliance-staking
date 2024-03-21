import { BinaryReader } from '../../../binary';
import { Rpc } from '../../../helpers';
import { MsgCreateVestingAccount, MsgCreateVestingAccountResponse, MsgCreatePermanentLockedAccount, MsgCreatePermanentLockedAccountResponse, MsgCreatePeriodicVestingAccount, MsgCreatePeriodicVestingAccountResponse } from './tx';
/** Msg defines the bank Msg service. */
export interface Msg {
  /**
   * CreateVestingAccount defines a method that enables creating a vesting
   * account.
   */
  createVestingAccount(request: MsgCreateVestingAccount): Promise<MsgCreateVestingAccountResponse>;
  /**
   * CreatePermanentLockedAccount defines a method that enables creating a permanent
   * locked account.
   *
   * Since: cosmos-sdk 0.46
   */
  createPermanentLockedAccount(request: MsgCreatePermanentLockedAccount): Promise<MsgCreatePermanentLockedAccountResponse>;
  /**
   * CreatePeriodicVestingAccount defines a method that enables creating a
   * periodic vesting account.
   *
   * Since: cosmos-sdk 0.46
   */
  createPeriodicVestingAccount(request: MsgCreatePeriodicVestingAccount): Promise<MsgCreatePeriodicVestingAccountResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }

  /*
   * CreateVestingAccount defines a method that enables creating a vesting
   * account.
   */
  createVestingAccount = async (request: MsgCreateVestingAccount): Promise<MsgCreateVestingAccountResponse> => {
    const data = MsgCreateVestingAccount.encode(request).finish();
    const promise = this.rpc.request(
      'cosmos.vesting.v1beta1.Msg', 'CreateVestingAccount', data,
    );
    return promise.then((data) => MsgCreateVestingAccountResponse.decode(new BinaryReader(data)));
  };

  /*
   * CreatePermanentLockedAccount defines a method that enables creating a permanent
   * locked account.
   *
   * Since: cosmos-sdk 0.46
   */
  createPermanentLockedAccount = async (request: MsgCreatePermanentLockedAccount): Promise<MsgCreatePermanentLockedAccountResponse> => {
    const data = MsgCreatePermanentLockedAccount.encode(request).finish();
    const promise = this.rpc.request(
      'cosmos.vesting.v1beta1.Msg', 'CreatePermanentLockedAccount', data,
    );
    return promise.then((data) => MsgCreatePermanentLockedAccountResponse.decode(new BinaryReader(data)));
  };

  /*
   * CreatePeriodicVestingAccount defines a method that enables creating a
   * periodic vesting account.
   *
   * Since: cosmos-sdk 0.46
   */
  createPeriodicVestingAccount = async (request: MsgCreatePeriodicVestingAccount): Promise<MsgCreatePeriodicVestingAccountResponse> => {
    const data = MsgCreatePeriodicVestingAccount.encode(request).finish();
    const promise = this.rpc.request(
      'cosmos.vesting.v1beta1.Msg', 'CreatePeriodicVestingAccount', data,
    );
    return promise.then((data) => MsgCreatePeriodicVestingAccountResponse.decode(new BinaryReader(data)));
  };
}
