import BannerData from "../../../assets/data/bannerV10";
import Button from "../../../components/button/Button";
import Countdown from "../../../components/countdown/Countdown";
import Dropdown from "../../../components/dropdown/Dropdown";
import Progressbar from "../../../components/progressbar/Progressbar";
import TokenInfo from "../../../components/tokenInfo/TokenInfo";
import BannerWrapper from "./Banner.style";
import StatusIcon from "../../../assets/images/icons/status.png";

import { usePresaleData } from "../../../utils/PresaleContext";
import { useEffect, useState } from "react";
import ConnectWalletButton from "../../../components/connectWalletButton/ConnectWalletButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Logo from "../../../assets/images/inso_logo.webp";
import Logo_ETH from "../../../assets/images/token/eth.png";
import Logo_BNB from "../../../assets/images/token/bnb.png";
import Logo_USDT from "../../../assets/images/token/usdt.png";
import { useAccount } from "wagmi";



library.add(fab,fas)



const Banner = () => {
  const {
    bnbChainId,
    ethChainId,
    userChainId,
    userBalance,
    userBalanceUSDT,
    currentStage,
    currentBonus,
    currentPrice,
    nextPrice,
    stageEnd,
    makeEmptyInputs,
    totalAmount,
    presaleStatus,
    handlePaymentInput,
    buyToken,
    buyTokenWithUsdt,
    claimToken,
    buyersToken,
    buyersVestingEnd,
    handlePaymentUsdtInput,
    totalRaised,
    totalRaisedCap,
    inputETHValue,
    inputUsdtValue
  } = usePresaleData();

  const [isLockToken, setisLockToken] = useState(false);
  const [isActivePayWithEth, setIsActivePayWithEth] = useState(true);
  const [isActivePayWithUsdt, setIsActivePayWithUsdt] = useState(false);
  const [isActivePayWithBnb, setIsActivePayWithBnb] = useState(false);
  const {chainId} = useAccount();


  useEffect(() => {
    const now = Date.now();
    const difference = buyersVestingEnd * 1000 - now;

    console.log('Price: ', currentPrice);
    if(currentPrice > 0) {
      console.log('Price', 123123);
      // setPrice((Number(currentPrice)/10 ** 4).toFixed(2));
    }
    
    
    if (difference <= 0 && buyersToken > 0) {
      setisLockToken(false);
    } else {
      setisLockToken(true);
    }
  }, [chainId, buyersToken]);

  return (
    <BannerWrapper>
            <div className="row aurora">

            <div className="col-md-7 col-sm-12">
              <div className="mb-30 p-4 justify-content-center">
                <h1 className="banner-title  letter-spacing">{BannerData.title}</h1>

              <h5 className="banner-subtitle text-center ">{BannerData.subtitle}</h5>
              </div>
              <div className="token-panel flex flex-column">
                <h4 className="fs-700 text-white">Current Stage : ${Number(currentPrice)/10**18}</h4>
                <h4 className="fs-700 text-white">Next Stage    : ${Number(nextPrice)/10**18}</h4>
                <h4 className="fs-700 text-white">MCAP Valuation:$5M</h4>
              </div>
          </div>
          <div className=" col-md-5 col-sm-12 ">
            <div className="gittu-banner-card">
              <div className="gittu-banner-card-right">
                <h5 className="fs-700 text-white letter-spacing-2 text-center p-3"> PRICE INCREASE IN</h5>
                <div className="" style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: '10px'
                }}>
                   <Countdown endDate={stageEnd} size="medium" />
                </div>
                <div className="gittu-banner-card-right-content">

                  <div className="d-flex align-items-center justify-content-between flex-wrap mb-10">
                    <h6 className="fw-600 text-white letter-spacing stage-raised">STAGE {currentStage}</h6>
                    <h6 className="fw-600 text-white stage-raised">
                      ${totalRaised} / {totalRaisedCap}
                    </h6>
                  </div>

                  {/* <div className="mb-20">
                    <Progressbar done={tokenPercent} variant="green" />
                  </div> */}


                  { (buyersToken>0) &&  <div className="inso-wallet-container">
                    <div className="wallet-title"><h6 className="text-white">YOUR PURCHASE</h6> </div>
                    <div className="wallet-balance-container">
                      {<span className="justify-content-center">{Number(buyersToken)} FASH  </span>}
                    </div>
                  </div>}
                  <div className="wallet-balance-container">
                    {<span className="wallet-balance-bar"> FASH Price: {Number(currentPrice)/10**18} </span>}
                  </div>

                  <div className="presale-item">
                    <div className="presale-item-inner">
                        <Dropdown
                            userChainId={userChainId}
                            ethChainId={ethChainId}
                            bnbChainId={bnbChainId}
                            setIsActivePayWithEth={setIsActivePayWithEth}
                            setIsActivePayWithUsdt={setIsActivePayWithUsdt}
                            setIsActivePayWithBnb={setIsActivePayWithBnb}
                            inputAmount={makeEmptyInputs}
                            />
                    </div>
                  </div>
                  <div className="wallet-balance-container">
                  {isActivePayWithEth && <span className="wallet-balance-bar"> ETH Balance: {userBalance} </span>}
                  {isActivePayWithUsdt && <span className="wallet-balance-bar"> USDT Balance: {userBalanceUSDT} </span>}
                  {isActivePayWithBnb && <span className="wallet-balance-bar"> BNB Balance: {userBalance} </span>}
                  </div>

                  <div className="presale-item mb-10">
                    {isActivePayWithEth && (
                        <div className="presale-item-inner">
                          <h6 className="letter-spacing">You Pay</h6>
                          <div className="inso-input-group">
                          <span className="inso-input-group-payment-addon"><img src={Logo_ETH}/></span>
                          <input  type="number"
                              min={Number(currentPrice)/10**4}
                              step={Number(currentPrice)/10**4}
                              placeholder={Number(currentPrice)/10**4}
                              value={inputETHValue}
                              onChange={handlePaymentInput}/>
                            <span className="inso-input-group-end">ETH</span>
                          </div>
                        </div>
                    )}

                    {isActivePayWithBnb && (
                        <div className="presale-item-inner">
                          <h6 className="letter-spacing">You Pay</h6>
                          <div className="inso-input-group">
                            <span className="inso-input-group-payment-addon"><img src={Logo_BNB}/></span>
                            <input  type="number"
                                    min={Number(currentPrice)/10**4}
                                    step={Number(currentPrice)/10**4}
                                    placeholder={Number(currentPrice)/10**4}
                                    value={inputETHValue}
                                    onChange={handlePaymentInput}/>
                            <span className="inso-input-group-end">BNB</span>
                          </div>
                        </div>
                    )}

                    {isActivePayWithUsdt && (
                        <div className="presale-item-inner">
                          <h6 className="letter-spacing">You Pay</h6>
                          <div className="inso-input-group">
                            <span className="inso-input-group-payment-addon"><img src={Logo_USDT}/> </span>
                            <input  type="text" min={Number(currentPrice)/10**4} step={Number(currentPrice)/10**4} placeholder={Number(currentPrice)/10**4} value={inputUsdtValue} onChange={handlePaymentUsdtInput} />
                            <span className="inso-input-group-end">USDT</span>
                          </div>
                        </div>
                    )}

                  </div>

                  <div className="presale-item mb-37">
                    <div className="presale-item-inner">
                      <h6 className="letter-spacing">You Receive</h6>
                      <div className="inso-input-group">
                        <span className="inso-input-group-addon"><img src={Logo}/></span>
                        <input type="number" placeholder="0" value={Number(totalAmount)/1e18} disabled />
                        <span className="inso-input-group-end">FASH</span>
                      </div>
                    </div>
                  </div>

                  <div className="presale-item-msg">
                    {presaleStatus && (
                      <div className="presale-item-msg__content">
                        <img src={StatusIcon} alt="icon" />
                        <p>{presaleStatus}</p>
                      </div>
                    )}
                  </div>

                  {isActivePayWithEth && (
                    <div className="">
                      <div className="presale-item-inner">
                        <Button variant="green" onClick={buyToken}>Buy Now</Button>
                      </div>
                      <div className="presale-item-inner">
                        {
                          (buyersToken > 0 && Date.now() >= buyersVestingEnd) &&  (<Button variant="green" onClick={claimToken}>Claim Token</Button>)
                        }
                      </div>
                    </div>
                  )}

                  {isActivePayWithBnb && (
                      <div className="">
                        <div className="presale-item-inner">
                          <Button variant="green" onClick={buyToken}>Buy Now</Button>
                        </div>
                        <div className="presale-item-inner">
                          {
                            (buyersToken > 0 && Date.now() >= buyersVestingEnd) && (<Button variant="green" onClick={claimToken}>Claim Token</Button>)
                          }
                        </div>
                      </div>
                  )}

                  {isActivePayWithUsdt && (
                    <div className="">
                      <div className="presale-item-inner">
                        <Button variant="green" onClick={buyTokenWithUsdt}> Buy Now</Button>
                      </div>
                      <div className="presale-item-inner">
                        {
                          (buyersToken > 0 && Date.now() >= buyersVestingEnd) > 0 && (<Button variant="green" onClick={claimToken}>Claim Token</Button>)
                        }
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
    </BannerWrapper>
  );
};

export default Banner;
