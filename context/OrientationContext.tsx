import { View, Text } from 'react-native'
import React, { ReactNode } from 'react'

interface Props{
    children: ReactNode
}

const OrientationContext = ({children}:Props) => {
  return (
    <>
        {children}
    </>
  )
}

export default OrientationContext