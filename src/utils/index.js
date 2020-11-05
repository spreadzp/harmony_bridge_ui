import {HarmonyExtension} from "@harmony-js/core";
import {Messenger, Provider} from "@harmony-js/network";

const {ChainID, ChainType} = require('@harmony-js/utils');

const config = require("../config");

export async function getHarmony(what) {
    let ext = null;
    let wallet = what;
    if (wallet !== "MathWallet" && wallet !== "Harmony" && getWalletsList().length > 0) {
        wallet = getWalletsList().pop();
    }
    if (wallet === "MathWallet") {
        ext = await new HarmonyExtension(window.harmony);
        ext.provider = new Provider(config.endpoint).provider;

        ext.messenger = new Messenger(ext.provider, ChainType.Harmony, config.chainID);
        ext.setShardID(config.shard);
        ext.wallet.messenger = ext.messenger;
        ext.blockchain.messenger = ext.messenger;
        ext.transactions.messenger = ext.messenger;
        ext.contracts.wallet = ext.wallet;
    }

    if (wallet === "Harmony") {
        ext = await new HarmonyExtension(window.onewallet);
        ext.provider = new Provider(config.endpoint).provider;

        ext.messenger = new Messenger(ext.provider, ChainType.Harmony, config.chainID);
        ext.setShardID(config.shard);
        ext.wallet.messenger = ext.messenger;
        ext.blockchain.messenger = ext.messenger;
        ext.transactions.messenger = ext.messenger;
        ext.contracts.wallet = ext.wallet;
    }

    return ext
}

export function getWalletsList() {
    let result = [];
    if (window.harmony) {
        result.push("MathWallet");
    }

    if (window.onewallet) {
        result.push("Harmony");
    }

    if (result.length > 1) {
        result = ["Default", ...result];
    }

    return result;
}
