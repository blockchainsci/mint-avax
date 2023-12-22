// true: 只冲1次
// false: 一直冲
export const AVAX_TEST = false;

export const AVAX_RPCURL = 'https://api.avax.network/ext/bc/C/rpc';

export const AVAX_TOKEN_JSON = 'data:,{"p":"asc-20","op":"mint","tick":"bull","amt":"100000000"}';

// gas费倍率
export const GAS_RATE = 1.5;

/// 单位：AVAX
/// 价格超过这个值，则不交易。
export const AVAX_MAX_FEE = 0.001;
