推荐大家使用 vscode 编辑器
## 1. 安装依赖

```bash
$ npm install
```

## 2. 添加地址和私钥
在项目目录下新建`private/avax.txt`文件，格式为`地址|私钥`，多个钱包则多行。 示例：

```bash
xxasdasdasdasd|asdasdasdasdasdasdasdasdasdasdasdasd
xxasdasdasdasd|asdasdasdasdasdasdasdasdasdasdasdasd
xxasdasdasdasd|asdasdasdasdasdasdasdasdasdasdasdasd
xxasdasdasdasd|asdasdasdasdasdasdasdasdasdasdasdasd
```

## 3. 修改配置文件
`src/constant.ts`

```typescript
// true: 只冲1次
// false: 一直冲
export const AVAX_TEST = false;

// RPC节点地址
export const AVAX_RPCURL = 'https://api.avax.network/ext/bc/C/rpc';

// 铭文的Json串
export const AVAX_TOKEN_JSON = 'data:,{"p":"asc-20","op":"mint","tick":"bull","amt":"100000000"}';

// gas费倍率
export const GAS_RATE = 1.5;

/// 单位：AVAX
/// 价格超过这个值，则不交易。
export const AVAX_MAX_FEE = 0.001;

```

## 4. 运行
- F5运行
- 命令行执行
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

