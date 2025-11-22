import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { SubtitleIcon } from '@/assets/icons'

const Subtitle = () => {
  return (
    <TouchableOpacity
    style={{
        flexDirection: 'row',
        alignItems: 'center',
    }}>
        <SubtitleIcon />
        <Text className="ml-[5px] font-ROBOTO_700 text-white text-[10px]">
            Subtitle
        </Text>
    </TouchableOpacity>
  )
}

export default Subtitle