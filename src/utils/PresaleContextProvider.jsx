import React, { useEffect, useRef, useState } from "react";
import { PresaleContext } from "./PresaleContext";
import * as configModule1 from "../contracts/config";
import * as configModule2 from "../contracts/configBnb";
import Data from "../assets/data/networkInfo";
import {
  useAccount,
  useBalance,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { formatEther, formatUnits, parseEther } from "viem";
import EthIcon from "../assets/images/token/eth.png";
import BnbIcon from "../assets/images/token/bnb.png";
import Notification from "../components/notification/Notification";
import { toast ,Bounce} from 'react-toastify';
import {usdtContractAddress} from "../contracts/config";
import { writeContract } from "wagmi/actions";
import {PresaleContractAbi} from "../contracts/PresaleContractAbi";
import { setBalance } from "viem/actions";
import {ethers} from 'ethers';
import { faL } from "@fortawesome/free-solid-svg-icons";
import { UNSAFE_ViewTransitionContext } from "react-router-dom";

const SEPOLIA_ADDRESS = '0x4f7329612846f0483b356d850ad50055f80d8a7d';
const BSC_ADDRESS = '0x3873517fA64e3E9B7EAc0a597b5B5ED93F60Dda7'

const PresaleContextProvider = ({ children }) => {
  
  const {chainId} = useAccount();
  const ethChainId = Data[0]?.chainId;
  const bnbChainId = Data[1]?.chainId;

  console.log("presaleContextProvider start")
  const [configModule, setConfigModule] = useState(
    chainId == 11155111?configModule1: configModule2
  );

  const [IsActiveBuyOnEth, setIsActiveBuyOnEth] = useState(false);
  const [IsActiveBuyOnBnb, setIsActiveBuyOnBnb] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isBuyTokenCall, setIsBuyTokenCall] = useState(false);

  const [buyOnItem, setBuyOnItem] = useState(2);
  const [buyOnText, setBuyOnText] = useState("BUY ON BNB");
  const [buyOnIcon, setBuyOnIcon] = useState(BnbIcon);
  const [selectedImg, setSelectedImg] = useState(EthIcon);

  const handleBuyOn = (itemId) => {
    if (itemId == 1) {
      setIsActiveBuyOnBnb(false);
      setIsActiveBuyOnEth(true);
      switchChain({ chainId: ethChainId });
      setConfigModule((prev) => configModule1);
      makeEmptyInputs();
    }

    if (itemId == 2) {
      setIsActiveBuyOnEth(false);
      setIsActiveBuyOnBnb(true);
      switchChain({ chainId: bnbChainId });
      setConfigModule((prev) => configModule2);
      makeEmptyInputs();
    }
  };

  const [userChainId, setUserChainId] = useState(1);
  const [userBalance, setUserBalance] = useState(0);
  const [userBalanceUSDT, setUserBalanceUSDT] = useState(0);

  const [maxStage, setMaxStage] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [currentBonus, setCurrentBonus] = useState("0");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [nextPrice, setNextPrice] = useState();
  const [usdtPrice, setUsdtPrice] = useState(0.05);
  const [tokenName, setTokenName] = useState("FASH TOKEN");
  const [tokenSymbol, setTokenSymbol] = useState("FASH");
  const [presaleToken, setPresaleToken] = useState(30000000);
  const [totalRaisedCap,setTotalRaisedCap] = useState("0")
  const [tokenSold, setTokenSold] = useState(0);
  const [totalRaised,setTotalRaised] = useState("0")
  const [tokenPercent, setTokenPercent] = useState(0);
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [tokenSubDecimals, setTokenSubDecimals] = useState(0);
  const [usdtDecimals, setUsdtDecimals] = useState(6);
  const [usdtAllowance, setUsdtAllowance] = useState(0);

  const [tokenAmount, setTokenAmount] = useState(0);
  const [buyersToken, setBuyersToken] = useState(0);
  const [buyersVestingEnd, setBuyersVestingEnd] = useState(1723910399);
  const [usdExRate, setUsdExRate] = useState(0);
  const [paymentUsd, setPaymentUsd] = useState(0);
  const [paymentPrice, setPaymentPrice] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [inputETHValue, setInputETHValue] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [inputUsdtValue, setInputUsdtValue] = useState(0);

  const [presaleStatus, setPresaleStatus] = useState(null);

  const { switchChain } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const { address: addressData, isWalletConnected:Boolean } = useAccount();

  const { data: balanceUSDTData, refetch: refetchUsdtBalance, balance_error } = useBalance({address: addressData, token:configModule1.usdtContractAddress});
  const { data: balanceData, refetch: refetchBalance, usdt_balance_error } = useBalance({address: addressData,blockTag: 'latest'});

  console.log("address data ", (addressData))
  console.log("balanceData", (balanceData), balance_error, usdt_balance_error);

  //const stageData = 1;
  const { data: stageData } = useReadContract({...configModule.getStageCall})
  const { data: tokenNameData } = useReadContract({...configModule.tokenNameCall});
  const { data: tokenSymbolData } = useReadContract({...configModule.tokenSymbolCall});
  const { data: tokenDecimalsData } = useReadContract({...configModule.tokenDecimalsCall});
  const { data: usdtDecimalsData } = useReadContract({...configModule.usdtDecimalsCall });
  const { data: usdtAllowanceData } = useReadContract({...configModule.usdtAllowanceCall,
    args: [addressData, configModule.presaleContractAddress],
  });
  // const {
  //   data: usdtApproveData,
  //   writeContract: usdtApproveWrite,
  //   isPending: usdtApproveIsLoading,
  //   isSuccess: usdtApproveIsSuccess,
  //   error: usdtApproveError,
  // } = useWriteContract();

  const { data: getTotalTokenAmountData } = useReadContract({...configModule.getTotalTokenAmountCall});
  const { data: getCurrentPriceData, refetch: refetchCurrentPrice } = useReadContract({...configModule.getStagePriceCall, args: [1]});
  const { data: getNextPriceData } = useReadContract({...configModule.getStagePriceCall, args: [parseInt(1) + 1]});
  const { data: getCurrentStageEndData } = useReadContract({...configModule.getStageEndTimeCall, args: [1]}); 
  console.log('Vesting End Time: ', getCurrentStageEndData, getCurrentPriceData);
  console.log('current stage: ', stageData, getCurrentPriceData, getNextPriceData, getCurrentStageEndData);
  
  
  // const contract = new ethers.Contract("0x01D5647567D27196FcF6f8406AdAC2Fc1f38E163", PresaleContractAbi, provider);
  // const vestingTime = contract.getVestingTime();
  // console.log(vestingTime); // Ensure this returns a value
  const { data: getTokenAmountData } = useReadContract({...configModule.getTokenAmountCall, args: [addressData]});
  const { data: buyersData, refetch: refetchBuyersData } = useReadContract({...configModule.buyersCall,args: [addressData]});
  const { data: getBuyTokenAmountData, refetch: refetchBuyTokenAmount, error } = useReadContract({
    address: configModule.presaleContractAddress,
    abi: PresaleContractAbi,
    functionName: "getTokenAmount",
    chainId: chainId, 
    args: [parseEther(inputETHValue.toString())]
  })
  console.log('BuyPrice: ', getBuyTokenAmountData, error);
  const { data: getBuyTokenAmountForUsdtData, refetch: refetchBuyTokenAmountForUsdt } = useReadContract({
    address: configModule.presaleContractAddress,
    abi: PresaleContractAbi,
    functionName: "getTokenAmountForUsdt",
    chainId: chainId, 
    args: [Number(inputUsdtValue)*1e6]
  })
  console.log('Buyer: ', configModule.presaleContractAddress, buyersData);
  
  const {
    data: buyTokenData,
    writeContractAsync: buyTokenWrite,
    isPending: buyTokenIsLoading,
    isSuccess: buyTokenIsSuccess,
    error: buyTokenError,
  } = useWriteContract();

  const {
    data: buyTokenWithUsdtData,
    writeContractAsync: buyTokenWithUsdtWrite,
    isPending: buyTokenWithUsdtIsLoading,
    isSuccess: buyTokenWithUsdtIsSuccess,
    error: buyTokenWithUsdtError,
  } = useWriteContract();

  const {
    data: claimTokenData,
    writeContractAsync: claimTokenWrite,
    isPending: claimTokenIsLoading,
    isSuccess: claimTokenIsSuccess,
    error: claimTokenError,
  } = useWriteContract();

  const makeEmptyInputs = () => {
    setTotalAmount(0);
    setInputETHValue(0);
    setInputUsdtValue(0);
  };

  //handle payment input
  const handlePaymentInput = async (e) => {
    let _inputValue = e.target.value;
    //setPaymentAmount(_inputValue);
    setInputETHValue(_inputValue);
    //setPaymentPrice(_inputValue);
  };

  useEffect(() => {
    if(!inputETHValue || inputETHValue == "") {
     // setPresaleStatus(null);
      setTotalAmount(0);
      //setPaymentPrice(0);
      return;
    } 
    refetchBuyTokenAmount();    
    if(getBuyTokenAmountData) setTotalAmount(getBuyTokenAmountData);
    if (parseFloat(userBalance) < parseFloat(inputETHValue)) {
      setPresaleStatus("Insufficient funds in your wallet");
    } else {
      if (getBuyTokenAmountData > 0) {
        setPresaleStatus(null);
      } else {
        setPresaleStatus("Please buy at least 1 token!");
        setTotalAmount(0);
        setPaymentPrice(0);
      }
    }
  }, [inputETHValue, getBuyTokenAmountData]);

  useEffect(() => {
    if(!inputUsdtValue || inputUsdtValue == ""){
      setPresaleStatus(null);
      setTotalAmount(0);
      setPaymentPrice(0);
      return;
    } 
    refetchBuyTokenAmountForUsdt();
    if(getBuyTokenAmountForUsdtData) setTotalAmount(getBuyTokenAmountForUsdtData);
    if (parseFloat(userBalanceUSDT) < parseFloat(inputUsdtValue)) {
      setPresaleStatus("Insufficient funds in your wallet");
    } else {
      if (getBuyTokenAmountForUsdtData > 0) {
        setPresaleStatus(null);
      } else {
        setPresaleStatus("Please buy at least 1 token!");
        setTotalAmount(0);
        setPaymentPrice(0);
      }
    }
  }, [inputUsdtValue, getBuyTokenAmountForUsdtData]);

  // buy token
  const buyToken = async () => {
    console.log("Buy: ", inputETHValue, addressData);
    
    if (inputETHValue != "") {
      setPresaleStatus(null);
  
      try {
        const tx = await buyTokenWrite({
          ...configModule.buyTokenCall,
          args: [addressData],
          value: parseEther(inputETHValue.toString()),
        });
      
        refetchDataAfterBuy();  // This should be called after transaction
        makeEmptyInputs();      // This should reset inputs
      } catch (error) {
        console.error("Error during transaction or function execution:", error);
      }
      
    } else {
      setPresaleStatus("Please enter pay amount!");
    }
  };

  // claim token
  const claimToken = () => {
    toast('🦄 Wow so easy!', {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });

    claimTokenWrite({ ...configModule.claimTokenCall });
  };

  //handle payment usdt input
  const handlePaymentUsdtInput = async (e) => {
    let _inputValue = e.target.value;
    setInputUsdtValue(_inputValue);
    setPaymentAmount(_inputValue);
    setPaymentPrice(_inputValue);
  };
  const buyTokenWithUsdt = async () => {
      if (inputUsdtValue != "") {
        setPresaleStatus(null);
        const _presaleContractAddress = configModule.presaleContractAddress;
        const _usdtAmount = inputUsdtValue * 10 ** usdtDecimals;
        console.log('usdt approval: ', _presaleContractAddress, _usdtAmount, inputUsdtValue);
        const txHash = await writeContractAsync({
          ...configModule.usdtApproveCall,
          args: [_presaleContractAddress, _usdtAmount],
        });
        console.log('TxResponse: ', txHash);
        const provider = new ethers.JsonRpcProvider(
          'https://rpc.sepolia.org'
        );
        console.log('approved0');
        try {
          const receipt = provider.waitForTransaction(txHash);
          console.log('Transaction receipt:', receipt);
          console.log('approved1');
          setIsApproved(!isApproved);
          console.log('approved2');
        } catch (error) {
          console.error('Error waiting for transaction:', error);
        }
      } else {
        setPresaleStatus("Please enter pay amount!");
      }
      setIsProcessing(false);
      setIsBuyTokenCall(true); 
  };

  useEffect(() => {
    if(inputUsdtValue == 0 || inputUsdtValue == "" || !inputUsdtValue) return;
    const _usdtAmount = inputUsdtValue * 10 ** usdtDecimals;
    buyTokenWithUsdtWrite({
      ...configModule.buyTokenWithUsdtCall,
      args: [addressData, _usdtAmount],
    });
    //refetchDataAfterBuy();  // This should be called after transaction
    makeEmptyInputs();
  }, [isApproved])

  // buy token notification
  const [isActiveNotification, setIsActiveNotification] = useState(false);
  const [notificationDone, setNotificationDone] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");

  const buyTokenLoadingMsg = (textMsg) => {
    setIsActiveNotification(true);
    setNotificationMsg(textMsg);
  };

  const buyTokenSuccessMsg = () => {
    setNotificationDone(true);
    setNotificationMsg("Your transaction has been successfully completed");
    setTimeout(() => {
      setNotificationDone(false);
    }, 5000);
  };

  useEffect(() => {
    if (chainId) {
      setUserChainId(chainId);
      if (chainId == 11155111) {
        setConfigModule(configModule1);
        setSelectedImg(EthIcon);
        setBuyOnItem(2);
        setBuyOnText("BUY ON BNB");
        setBuyOnIcon(BnbIcon);
      }
      if (chainId == 97) {
        setConfigModule(configModule2);
        setSelectedImg(BnbIcon);
        setBuyOnItem(1);
        setBuyOnText("BUY ON ETH");
        setBuyOnIcon(EthIcon);
      }
    }

    if (
        buyTokenIsLoading ||
        claimTokenIsLoading ||
        buyTokenWithUsdtIsLoading 
    ) {
      buyTokenLoadingMsg("Transaction Processing. Click “Confirm”.");
    }

    if (buyTokenError || claimTokenError || buyTokenWithUsdtError) {
      setIsActiveNotification(true);
      setPresaleStatus(buyTokenError);
      setTimeout(() => {
        setIsActiveNotification(false);
      }, 300);
    }

    if (buyTokenIsSuccess || buyTokenWithUsdtIsSuccess || claimTokenIsSuccess) {
      buyTokenSuccessMsg();
      // const timeoutId = setTimeout(() => {
      //   window.location.reload();
      // }, 2000);

      //return () => clearTimeout(timeoutId);
    }
    
    //console.log("getEndTime: ", tokenNameData, getCurrentStageEndData, configModule.presaleContractAddress, chainId, getVestingEndTimeData);
  }, [
    isBuyTokenCall,
    isActiveNotification,
    notificationDone,
    notificationMsg,
    buyTokenData,
    buyTokenIsLoading,
    buyTokenError,
    buyTokenIsSuccess,
    claimTokenData,
    claimTokenIsLoading,
    claimTokenError,
    claimTokenIsSuccess,
    buyTokenWithUsdtData,
    buyTokenWithUsdtIsLoading,
    buyTokenWithUsdtError,
    buyTokenWithUsdtIsSuccess,
  ]);

  useEffect(() => {
    if (chainId) {
      setUserChainId(chainId);
      if (chainId == 11155111) {
        setConfigModule(configModule1);
        setSelectedImg(EthIcon);
        setBuyOnItem(2);
        setBuyOnText("BUY ON BNB");
        setBuyOnIcon(BnbIcon);
      }
      if (chainId == 97) {
        setConfigModule(configModule2);
        setSelectedImg(BnbIcon);
        setBuyOnItem(1);
        setBuyOnText("BUY ON ETH");
        setBuyOnIcon(EthIcon);
      }
    }

    if (balanceData) {
      let tmp = parseFloat(balanceData?.formatted).toFixed(2);
      console.log("tmp Balance Data", chainId, balanceData, tmp);
      setUserBalance(tmp);
    }

    if (tokenNameData) {
      setTokenName(tokenNameData);
    }

    if (tokenSymbolData) {
      setTokenSymbol(tokenSymbolData);
    }

    if (tokenDecimalsData) {
      let _subDecimal = 18 - tokenDecimalsData;
      setTokenDecimals(tokenDecimalsData);
      setTokenSubDecimals(_subDecimal);
    }

    if (usdtDecimalsData) {
      setUsdtDecimals(usdtDecimalsData);
      if (balanceUSDTData) {
        let tmp = parseFloat(balanceUSDTData?.formatted).toFixed(2);
        setUserBalanceUSDT(tmp);
      }
    }

    if (usdtAllowanceData) {
      setUsdtAllowance(formatUnits(usdtAllowanceData, usdtDecimals));
    }

    if (getTotalTokenAmountData >= 0) {
      const _tokenAmount = getTotalTokenAmountData.toString();
      //Raised in private funding
      const privateSaleSoldToken = .103*presaleToken
      const _totalTokenAmount = _tokenAmount / 10 ** tokenDecimals + privateSaleSoldToken;
      setTokenSold(_totalTokenAmount);

      const totalRaised = (_totalTokenAmount * usdtPrice)
      setTotalRaised(totalRaised.toLocaleString())

      const _totalRaisedCap = (presaleToken + privateSaleSoldToken)* usdtPrice;

      setTotalRaisedCap(_totalRaisedCap.toLocaleString())
    }

    if (stageData) {
      setCurrentStage(Number(stageData));
    }
    if (buyersData) {
      const _tokenAmount = buyersData[0].toString();
      const _buyersTokenAmount = _tokenAmount / 1e18;
      setBuyersToken(_buyersTokenAmount);
      setBuyersVestingEnd(buyersData[1].toString());
    }
    if (getCurrentPriceData) {
      setCurrentPrice(getCurrentPriceData);
    }
    if (getNextPriceData) {
      setNextPrice(getNextPriceData);
    }
    if (getCurrentStageEndData) {
      setEndTime(Number(getCurrentStageEndData));
    }
    if(getTokenAmountData) {
      setTokenAmount(Number(getTokenAmountData)/10**18);
    }
    console.log('token amount: ', getTokenAmountData);

    let _tokenPercent = parseInt((tokenSold * 100) / presaleToken);
    setTokenPercent(_tokenPercent);

    if (_tokenPercent > 100) {
      setTokenPercent(100);
    }

    configModule.GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });    
    let pay = parseFloat(usdExRate * paymentPrice).toFixed(2);
    setPaymentUsd(pay);
  }, [
    chainId,
    configModule,
    tokenNameData,
    tokenSymbolData,
    tokenDecimalsData,
    usdtDecimalsData,
    usdtAllowanceData,
    getTotalTokenAmountData,
    presaleToken,
    buyersData,
    maxStage,
    usdExRate,
    paymentPrice,
  ]);

  const refetchDataAfterBuy = async () => {
    //alert("asfsadf");
      console.log('refetch: ', configModule.presaleContractAddress);
      await refetchBalance();
      await refetchUsdtBalance();
      await refetchBuyersData();
      if(balanceUSDTData) {
        setUserBalanceUSDT(balanceUSDTData);
      }
      if(balanceData) {
        setBalance(balanceData);
      }
      if (buyersData) {
        const _tokenAmount = buyersData[0].toString();
        const _buyersTokenAmount = _tokenAmount / 10 ** tokenDecimals;
        setBuyersToken(_buyersTokenAmount);
        setBuyersVestingEnd(buyersData[1].toString());
      }
  }

  return (
      <PresaleContext.Provider
          value={{
            configModule,
            handleBuyOn,
            IsActiveBuyOnEth,
            setIsActiveBuyOnEth,
            IsActiveBuyOnBnb,
            setIsActiveBuyOnBnb,
            switchChain,
            buyOnItem,
            setBuyOnItem,
            buyOnText,
            setBuyOnText,
            buyOnIcon,
            setBuyOnIcon,
            selectedImg,
            setSelectedImg,
            bnbChainId,
            ethChainId,
            userChainId,
            userBalance,
            userBalanceUSDT,
            inputETHValue,
            inputUsdtValue,
            setUserBalanceUSDT,
            setUserBalance,
            maxStage,
            endTime,
            currentStage,
            currentBonus,
            currentPrice,
            usdtPrice,
            nextPrice,
            tokenName,
            tokenSymbol,
            presaleToken,
            tokenSold,
            tokenPercent,
            tokenDecimals,
            tokenSubDecimals,
            buyersToken,
            setBuyersToken,
            buyersVestingEnd,
            usdExRate,
            paymentUsd,
            paymentPrice,
            paymentAmount,
            totalAmount,
            presaleStatus,
            setPresaleStatus,
            makeEmptyInputs,
            handlePaymentInput,
            buyToken,
            buyTokenData,
            buyTokenIsLoading,
            buyTokenIsSuccess,
            buyTokenError,
            handlePaymentUsdtInput,
            buyTokenWithUsdt,
            claimToken,
            claimTokenData,
            claimTokenIsLoading,
            claimTokenIsSuccess,
            claimTokenError,
            totalRaised,
            totalRaisedCap,
            tokenAmount
          }}
      >
        {children}

        {/* notification modal */}
        {isActiveNotification && (
            <Notification
                notificationDone={notificationDone}
                textMessage={notificationMsg}
            />
        )}
      </PresaleContext.Provider>
  );
};

export default PresaleContextProvider;
