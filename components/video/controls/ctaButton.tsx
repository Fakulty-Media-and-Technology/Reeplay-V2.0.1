import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Donate_VoteIcon } from '@/assets/icons'

interface Props{
    ctaType?:'vote'|'donate',
    handleCTAFunc: () => void
}
const CTAButton = ({ctaType, handleCTAFunc}:Props) => {
  return (
    <TouchableOpacity
                          onPress={handleCTAFunc}
    style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    }}>
        <View className="-mb-[10px]">
            <Donate_VoteIcon />
        </View>
        <Text className="ml-[5px] capitalize font-ROBOTO_700 text-[#FFCC00] text-[13px]">
            {ctaType}
        </Text>
    </TouchableOpacity>
  )
}

export default CTAButton