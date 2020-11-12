import './App.css';
import React, {useState, createContext} from "react";
import {PickWallet} from "./PickWallet";
import {Swap} from "./Swap";
import {Select} from "antd";
import {EdgewareSwap} from "./EdgewareSwap";

const {Option} = Select;

export const AppContext = createContext({});
const config = require("./config");

function App() {
    const [account, setAccount] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [walletAPI, setWalletAPI] = useState(null);
    const [currentAsset, setCurrentAsset] = useState("Harmony");
    const [walletType, setWalletType] = useState("");
    const [assets, setAssets] = useState([]);

    const onWalletChanged = async () => {
        if (!walletAPI || !account) {
            return
        }

        if (walletType === "MathWallet Harmony") {
            setAssets([
                "Harmony",
                ...config.tokens,
            ]);
            setCurrentAsset("Harmony");
        } else {
            setAssets([
                "Edgeware",
                ...config["edgeware-tokens"],
            ]);
            setCurrentAsset("Edgeware");
        }
    };

    React.useEffect(onWalletChanged, [account, walletAPI, walletType]);

    const contextValues = {
        walletAPI,
        setWalletAPI,
        account,
        setAccount,
        setAccounts,
        setWalletType,
    };

    const getHarmonySwapBlock = () => {
        return account ? (
            <div>
                <span>Pick asset:</span>
                <Select value={currentAsset} onChange={setCurrentAsset}>
                    {assets.map(v => <Option key={v} value={v}>{v}</Option>)}
                </Select>
                <Swap assetID={currentAsset}/>
            </div>
        ) : ""
    };

    const getEdgewareSwapBlock = () => {
        return account ? (
            <div>
                <span>Pick asset:</span>
                <Select value={currentAsset} onChange={setCurrentAsset}>
                    {assets.map(v => <Option key={v} value={v}>{v}</Option>)}
                </Select>
                <EdgewareSwap assetID={currentAsset}></EdgewareSwap>
            </div>
        ) : ""
    };

    return (
        <AppContext.Provider value={contextValues}>
            <div className="App" style={{backgroundColor: "#9a9", height: "100vh"}}>
                <div className="Header">
                    <PickWallet/>
                    {
                        accounts.length === 1 ?
                            <span>Address {account}</span>
                            :
                            <div>
                                <span>Account</span>
                                <Select value={account} onChange={setAccount}>
                                    {accounts.map(v => <Option key={v} value={v}>{v}</Option>)}
                                </Select>
                            </div>
                    }

                </div>
                <br/>

                {
                    walletType === "MathWallet Harmony" || walletType === "Harmony" ? getHarmonySwapBlock() : getEdgewareSwapBlock()
                }
            </div>
        </AppContext.Provider>
    );
}

export default App;
