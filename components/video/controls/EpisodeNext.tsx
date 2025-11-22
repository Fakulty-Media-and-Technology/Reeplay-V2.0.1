import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { NextIcon } from '@/assets/icons'

const EpisodeNext = () => {
  return (
    <TouchableOpacity
    style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 5,
    }}>
        <NextIcon />
        <Text className="ml-[5px] font-ROBOTO_700 text-white text-[10px]">
            Next
        </Text>
    </TouchableOpacity>
  )
}

export default EpisodeNext