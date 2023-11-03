import React, { useMemo } from 'react'
import { BsCircleFill } from 'react-icons/bs'
import { useQuery } from 'react-query'

import { HStack, Icon, Text } from '@chakra-ui/react'
import { useChains } from 'hooks/useChainInfo'
import {MIGALOO_CHAIN_ID} from "constants/common";

const Status = () => {
  const chains: Array<any> = useChains()

  const url = useMemo(() => {
    return chains?.find((c) => c?.chainId === MIGALOO_CHAIN_ID)?.rpc;
  }, [chains])

  const { data: status } = useQuery(
    ['status', url],
    async () => {
      const res = await fetch(`${url}/status?`);
      const resJons = await res?.json();
      return {
        block: resJons?.result?.sync_info?.latest_block_height || status?.block,
        active: !!resJons?.result?.sync_info?.latest_block_height,
      }
    },
    {
      refetchInterval: 6000,
      enabled: !!url,
    },
  )

  return (
    <HStack
      borderRadius="23px"
      backgroundColor="rgba(0, 0, 0, 0.5)"
      width="fit-content"
      color="white"
      paddingX={5}
      paddingY={1}
    >
      <Text color="#7A7A7A">Latest synced block</Text>
      <Text color="white">{status?.block}</Text>
      <Icon
        as={BsCircleFill}
        color={!!status?.active ? '#3CCD64' : 'gray'}
        boxShadow="0px 0px 14.0801px #298F46"
        bg="#1C1C1C"
        borderRadius="full"
        width="11px"
        height="11px"
      />
    </HStack>
  )
}

export default Status
