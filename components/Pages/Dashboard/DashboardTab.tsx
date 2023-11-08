import React, {useEffect, useState} from "react";
import {HStack, Image, Text, VStack} from "@chakra-ui/react"
import AssetTable, {DashboardData} from "components/Pages/Dashboard/AssetTable";
import {useGetLPTokenPrice} from "hooks/useGetLPTokenPrice";
import {useAssetsData} from "components/Pages/Dashboard/hooks/useAssetsData";
import useValidators from "hooks/useValidators";
import tokens from "public/mainnet/tokens.json";
import {Token} from "components/Pages/AssetOverview";
import {walletState} from "state/walletState";
import {useRecoilValue} from "recoil";
import {DashboardPieChart} from "components/Pages/Dashboard/DashboardPieChart";
import {USDCWhaleLogo} from "components/Pages/Dashboard/USDCWhaleLogo";
import {useCalculateAllianceAprs} from "components/Pages/Alliance/hooks/useCalculateAllianceAprs";
import {Apr, useCalculateAprs} from "components/Pages/Ecosystem/hooks/useCalculateAprs";


const dashboardTokenSymbols = [Token.WHALE, Token.ampLUNA, Token.bLUNA, Token.ASH, Token.mUSDC, Token["USDC-WHALE-LP"]]
export const DashboardTab = ({priceList}) => {
    const {address} = useRecoilValue(walletState)
    const [dashboardData, setDashboardData] = useState<DashboardData[]>([])
    const {lpTokenPrice} = useGetLPTokenPrice()
    const [initialized, setInitialized] = useState<boolean>(false)

    const {vtRewardShares, totalStakedBalances} = useAssetsData()

    const {data: {stakedAmpLuna, stakedBLuna, stakedWhale}} = useValidators({address})
    const [aprs, setAprs] = useState<Apr[]>([])
    const allianceAPRs = useCalculateAllianceAprs({address})
    const otherAprs = useCalculateAprs()

    useEffect(() => {
        if (allianceAPRs.length === 0 || otherAprs.length === 0 || !vtRewardShares) return
        const aprs = [...allianceAPRs, ...otherAprs].map((apr) => {
            const vtRewardShare = vtRewardShares.find((info) => info.tokenSymbol === apr.name)
            return {
                ...apr,
                weight: apr?.weight ?? (vtRewardShare?.distribution * 0.05)
            }
        })
        setAprs(aprs)
    }, [allianceAPRs, otherAprs])

    useEffect(() => {
        if (!totalStakedBalances || !stakedAmpLuna || !stakedBLuna || !stakedWhale || !priceList || !lpTokenPrice || aprs.length === 0 ) return
        const dashboardData = dashboardTokenSymbols.map((symbol) => {
            const asset = tokens.find((token) => token.symbol === symbol)
            const totalStakedBalance = totalStakedBalances.find((balance) => balance.tokenSymbol === symbol)
            const totalAmount = asset.symbol === Token.bLUNA ? stakedBLuna : asset.symbol === Token.ampLUNA ? stakedAmpLuna : asset.symbol === Token.WHALE ? stakedWhale : totalStakedBalance?.totalAmount
            const apr = aprs.find((apr) => apr.name === symbol)
            return {
                logo: symbol === 'USDC-WHALE-LP' ? <USDCWhaleLogo/> :
                    <Image
                        src={asset.logoURI}
                        alt="logo-small"
                        width="auto"
                        maxW="1.5rem"
                        maxH="1.5rem"
                    />,
                symbol: symbol,
                category: asset.tabType,
                totalStaked: totalAmount,
                totalValueStaked: (symbol === 'USDC-WHALE-LP' ? lpTokenPrice : symbol === Token.mUSDC ? 1 : priceList[asset.name]) * totalAmount,
                rewardWeight: (apr?.weight || 0 ) * 100,
                apr: apr?.apr || 0,
            }
        })
        setDashboardData(dashboardData)
        setInitialized(true)

    }, [vtRewardShares, totalStakedBalances, stakedAmpLuna, stakedBLuna, stakedWhale, priceList, lpTokenPrice, aprs])
    return <VStack
        pt={12}
        alignItems={'flex-start'}
        spacing={6}>
        <HStack width={"full"} justifyContent={"space-between"}>
            <Text as="h1"
                  fontSize="37"
                  fontWeight="700">
                Dashboard
            </Text>
        </HStack>
        <AssetTable dashboardData={dashboardData} initialized={initialized}/>
        <DashboardPieChart dashboardData={dashboardData}/>
    </VStack>
}
