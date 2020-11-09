import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "./App";

const config = require("./config");
const Bridge = require("./contracts/Bridge");
const Token = require("./contracts/EdgewareToken");

export function Swap({assetID}) {
    const [balance, setBalance] = useState("");
    const [receiver, setReceiver] = useState("one1swpff8afhyyc2yds6z7v2mk8vr5am5gkupgnh4");
    const [assetName, setAssetName] = useState("");
    const [inputValue, setInputValue] = useState(0);
    const {harmony, account, updateBalance} = useContext(AppContext);

    const refreshInfo = async () => {
        if (!harmony) {
            return;
        }
        if (assetID === "Harmony") {
            setAssetName("Harmony");
        } else {
            const token = harmony.contracts.createContract(Token.abi, assetID);
            const balanceResult = await token.methods.balanceOf(account).call();
            setBalance(balanceResult.toString());
            const nameResult = await token.methods.name().call();
            setAssetName(nameResult);
        }
        await updateBalance();
    };

    useEffect(() => {
        refreshInfo().catch(console.error);
    }, [harmony, assetID]);

    const handleReceiver = (event) => {
        setReceiver(event.target.value);
    };

    const onChangeTransferValue = (event) => {
        setInputValue(event.target.value);
    };

    const handleTransferToken = async () => {
        if (!harmony) {
            return;
        }
        const bridge = await harmony.contracts.createContract(Bridge.abi, config.bridge);
        await bridge.methods.transferToken(receiver, inputValue, assetID).send({
            from: account,
            gasLimit: 8000000,
            gasPrice: 1000000000
        });

        refreshInfo().catch();
    };

    const handleTransferCoin = async () => {
        if (!harmony) {
            return;
        }
        const bridge = await harmony.contracts.createContract(Bridge.abi, config.bridge);
        await bridge.methods.transferCoin(receiver).send({
            from: account,
            gasLimit: 8000000,
            gasPrice: 1000000000,
            value: inputValue
        });

        refreshInfo().catch();
    };

    return <div className={"SWapContainer"}>
        <button onClick={refreshInfo}>
            get info from contract
        </button>
        <br/>

        <span>Token {assetName}({assetID})</span>
        <br/>

        {assetID === "Harmony" ? "" : <span>token balance {balance}</span>}
        <br/>

        <div className={"SwapParams"}>
            <span>Receiver:</span>
            <input type="text" value={receiver} onChange={handleReceiver}/>

            <span>Amount:</span>
            <input type="text" value={inputValue} onChange={onChangeTransferValue}/>

            <button onClick={assetID === "Harmony" ? handleTransferCoin : handleTransferToken}>
                {assetID === "Harmony" ? "Transfer coin" :  "Transfer token"}
            </button>
        </div>
    </div>
}
