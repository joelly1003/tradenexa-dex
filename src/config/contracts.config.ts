/**
 * Centralized, type-safe registry of verified smart contracts deployed on Ink Mainnet (Chain ID: 57073).
 * Contains deployment addresses, ABI exports, and verification statuses on explorer.inkonchain.com.
 */

export interface ContractDeployment {
  name: string;
  role: string;
  address: `0x${string}`;
  category: 'core' | 'settlement' | 'oracle' | 'token';
  verified: boolean;
  explorerUrl: string;
  githubUrl?: string;
  abiSummary: string[];
}

export const INK_CHAIN_ID = 57073;

export const INK_VERIFIED_CONTRACTS: ContractDeployment[] = [
  {
    name: 'NadoSettlementRouter',
    role: 'Primary atomic settlement router executing solver-matched EIP-712 batch orders on Ink L2.',
    address: '0x3bB11C18bC6a22D77fD6cE87A4F8b40E600021b3',
    category: 'settlement',
    verified: true,
    explorerUrl: 'https://explorer.inkonchain.com/address/0x3bB11C18bC6a22D77fD6cE87A4F8b40E600021b3',
    githubUrl: 'https://github.com/tradenexa/contracts/blob/main/contracts/settlement/NadoSettlementRouter.sol',
    abiSummary: [
      'executeOrder((address,uint256,int256,uint64,uint64,uint256),bytes)',
      'settleBatch((address,uint256,int256,uint64,uint64,uint256)[],bytes[])',
      'cancelOrder(uint32,uint64)'
    ],
  },
  {
    name: 'IntentVault',
    role: 'Non-custodial collateral management and isolated/cross-margin solvency accounting.',
    address: '0x87eF06DbF4F7c27A598F1D2C67B622c83c078Fa6',
    category: 'core',
    verified: true,
    explorerUrl: 'https://explorer.inkonchain.com/address/0x87eF06DbF4F7c27A598F1D2C67B622c83c078Fa6',
    githubUrl: 'https://github.com/tradenexa/contracts/blob/main/contracts/vault/IntentVault.sol',
    abiSummary: [
      'depositCollateral(address,uint256)',
      'withdrawCollateral(address,uint256)',
      'getAccountSolvency(address)'
    ],
  },
  {
    name: 'PositionManager',
    role: 'On-chain lifecycle tracker for open perpetual positions, funding rate settlement, and liquidations.',
    address: '0x2D5C43f9a7217BFEc914eA54992523d4C8613143',
    category: 'core',
    verified: true,
    explorerUrl: 'https://explorer.inkonchain.com/address/0x2D5C43f9a7217BFEc914eA54992523d4C8613143',
    githubUrl: 'https://github.com/tradenexa/contracts/blob/main/contracts/positions/PositionManager.sol',
    abiSummary: [
      'openPosition(address,uint32,int256,uint256)',
      'closePosition(address,uint32)',
      'liquidatePosition(address,uint32)'
    ],
  },
  {
    name: 'OracleRelayer',
    role: 'Low-latency oracle aggregator linking Pyth/Chainlink benchmark price feeds with on-chain solvers.',
    address: '0x7A9D57C5a6988c5B13D5E7502B52B095147513C0',
    category: 'oracle',
    verified: true,
    explorerUrl: 'https://explorer.inkonchain.com/address/0x7A9D57C5a6988c5B13D5E7502B52B095147513C0',
    githubUrl: 'https://github.com/tradenexa/contracts/blob/main/contracts/oracles/OracleRelayer.sol',
    abiSummary: [
      'getPrice(bytes32) returns (uint256,uint256)',
      'updateFeeds(bytes[]) payable',
      'getBenchmarkPrice(uint32)'
    ],
  },
  {
    name: 'USDC (Ink Native / Bridged)',
    role: 'Standard institutional quote collateral asset on Ink Network L2.',
    address: '0xF181eD86D12255677B13941F7517E862024Ea461',
    category: 'token',
    verified: true,
    explorerUrl: 'https://explorer.inkonchain.com/address/0xF181eD86D12255677B13941F7517E862024Ea461',
    abiSummary: ['approve(address,uint256)', 'transfer(address,uint256)', 'balanceOf(address) returns (uint256)'],
  },
  {
    name: 'WETH (Wrapped Ether)',
    role: 'Canonical Wrapped Ether ERC-20 contract for margin and routing on Ink Network.',
    address: '0x4200000000000000000000000000000000000006',
    category: 'token',
    verified: true,
    explorerUrl: 'https://explorer.inkonchain.com/address/0x4200000000000000000000000000000000000006',
    abiSummary: ['deposit() payable', 'withdraw(uint256)', 'approve(address,uint256)'],
  },
];
