declare let window: any;
import Network from "@maticnetwork/meta/network";
import { createContext, useContext, useState } from "react";
import Web3 from "web3";

interface DataContextProps {
  account: string;
  loading: boolean;
  loadWallet: () => Promise<void>;
  sendPayment: ({
    amount,
    toAddress,
  }: {
    amount: any;
    toAddress: any;
  }) => Promise<any>;
  balance: number;
  selectedToken: Token;
  updateSelectedToken: (token: Token) => void;
}

const DataContext = createContext<DataContextProps | null>(null);

export const DataProvider: React.FC = ({ children }) => {
  const data = useProviderData();

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => useContext<DataContextProps | null>(DataContext);

export const useProviderData = () => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<string>();
  const [balance, setBalance] = useState<number>();
  const [selectedToken, setSelectedToken] = useState<Token>(tokensList[0]);
  const [erc20Abi, setErc20Abi] = useState<any>();

  const loadWallet = async () => {
    const network = new Network("mainnet", "v1");
    const ERC20ABI = network.abi("ERC20");
    setErc20Abi(ERC20ABI);

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;
      window.ethereum.on("accountsChanged", function (accounts) {
        loadWallet();
      });
      var allAccounts = await web3.eth.getAccounts();
      setAccount(allAccounts[0]);

      var paymentTokenInstance = new web3.eth.Contract(
        ERC20ABI,
        "0xC9a66EB35B359816EBeE3763e52ed6250EBC9ddF"
      );
      var bal = await paymentTokenInstance.methods
        .balanceOf(allAccounts[0])
        .call();
      setBalance(bal);

      setLoading(false);
    } else {
      window.alert("Non-Eth browser detected. Please consider using MetaMask.");
    }
  };

  const sendPayment = async ({ amount, toAddress }) => {
    try {
      var amountInDecimal;
      if (selectedToken.decimals === 18) {
        amountInDecimal = window.web3.utils.toWei(amount, "ether");
      } else {
        amountInDecimal = amount * Math.pow(10, selectedToken.decimals);
      }
      var tokenContract = new window.web3.eth.Contract(
        erc20Abi,
        selectedToken.address
      );

      var bal = await tokenContract.methods.balanceOf(account).call();
      if (bal < amountInDecimal) {
        return "You don't have enough balance";
      }
      const txHash = await tokenContract.methods
        .transfer(toAddress, amountInDecimal)
        .send({
          from: account,
        });
      setTimeout(async () => {
        var bal = await tokenContract.methods.balanceOf(account).call();
        setBalance(bal);
      }, 2000);
      return "Payment success";
    } catch (e) {
      return e.message;
    }
  };

  const updateSelectedToken = async (token: Token) => {
    var tokenContract = new window.web3.eth.Contract(erc20Abi, token.address);
    var bal = await tokenContract.methods.balanceOf(account).call();
    setBalance(bal);
    setSelectedToken(token);
  };

  return {
    account,
    loading,
    loadWallet,
    sendPayment,
    balance,
    selectedToken,
    updateSelectedToken,
  };
};

export interface Token {
  name: string;
  symbol: string;
  address: string;
  logo: string;
  decimals: number;
}

export const tokensList: Token[] = [
  {
    name: "ZERO Token",
    symbol: "Z3R0",
    address: "0xC9a66EB35B359816EBeE3763e52ed6250EBC9ddF",
    logo: "",
    decimals: 18,
  },
  // {
  //   name: "Chainlink",
  //   symbol: "LINK",
  //   address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
  //   logo: "https://gemini.com/images/currencies/icons/default/link.svg",
  //   decimals: 18,
  // },
  {
    name: "Wrapped Bitcoin",
    symbol: "wBTC",
    address: "0x1f12b61a35ca147542001186dea23e34eb4d7d95",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
    decimals: 8,
  },

  {
    name: "Wrapped Ethereum",
    symbol: "wETH",
    address: "0x1e33833a035069f42d68d1f53b341643de1c018d ",
    logo: "https://gemini.com/images/currencies/icons/default/link.svg",
    decimals: 18,
  },

  {
    name: "Tether USD",
    symbol: "USDT",
    address: "0x337610d27c682e347c9cd60bd4b3b107c9d34ddd",
    logo: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    decimals: 6,
  },
  {
    name: "Binance USD",
    symbol: "BUSD",
    address: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee ",
    logo: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x4Fabb145d64652a948d72533023f6E7A623C7C53/logo.png",
    decimals: 6,
  },

  // {
  //   name: "Aave",
  //   symbol: "AAVE",
  //   address: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
  //   logo: "https://gemini.com/images/currencies/icons/default/aave.svg",
  //   decimals: 18,
  // },
];
