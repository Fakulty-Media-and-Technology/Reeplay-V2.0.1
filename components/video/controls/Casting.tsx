import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { VideoCastingIcon } from '@/assets/icons';
import { CastButton } from 'react-native-google-cast'


interface VideoCastingProps {
  handleCastingFunc?: () => void;
}

const Casting = memo(
  ({
    handleCastingFunc,
  }:VideoCastingProps) => {
  return (
    // <TouchableOpacity
    // disabled={!handleCastingFunc}
    // onPress={() => handleCastingFunc?.()}
    //     style={{
    //         marginLeft: 24,
    //     }}>
    //     <VideoCastingIcon />
    // </TouchableOpacity>
     <CastButton style={{width: 24, height: 24,marginLeft: 24,}} />
  )
})

export default Casting

const styles = StyleSheet.create({
  extraControl: {
    color: 'white',
    padding: 8,
  },
});
