import {useRecoilValue} from "recoil";
import {walletState} from "state/walletState";
import {useConnectedWallet} from "@terra-money/wallet-provider";
import {useQuery} from "react-query";
import {DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL} from "util/constants";
import {convertMicroDenomToDenom} from "util/conversion";


const fetchWhaleBalance = async ({client, address}) => {
    const coin = await client.getBalance(address, 'uwhale')
    const amount = coin ? Number(coin.amount) : 0
    return convertMicroDenomToDenom(amount, 6)
}
export const useGetWhaleBalance = () => {
    const {address, client, chainId} = useRecoilValue(walletState);
    const connectedWallet = useConnectedWallet();
    const selectedAddr = connectedWallet?.addresses[chainId] || address;

    const {
        data: balance = 0,
        isLoading,
        refetch,
    } = useQuery(
        ['tokenBalance', selectedAddr],
        async () => {
            return await fetchWhaleBalance({
                client,
                address
            });
        },
        {
            enabled: !!address && !!client,
            refetchOnMount: 'always',
            refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
            refetchIntervalInBackground: true,
        },
    )

    return {balance, isLoading, refetch}

}