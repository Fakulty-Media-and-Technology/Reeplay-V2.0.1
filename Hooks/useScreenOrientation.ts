import { useEffect, useState } from 'react'
import { Dimensions, Platform, ScaledSize } from 'react-native'
import Orientation, { LANDSCAPE, OrientationType } from 'react-native-orientation-locker'
import { singletonHook } from 'react-singleton-hook'

export const isAndroid = () => Platform.OS === 'android'

export const useScreenOrientation = singletonHook(
    {
        isLandscape: false,
        screenOrientation: Orientation.getInitialOrientation(),
    },
    () => {
        const [screenOrientation, setScreenOrientation] = useState(Orientation.getInitialOrientation())

        useEffect(() => {
            const onChange = (result: OrientationType) => {
                setScreenOrientation(result)
            }

            const onChangeAndroid = (result: { screen: ScaledSize }) => {
                return onChange(
                    result.screen.height > result.screen.width
                        ? OrientationType.PORTRAIT
                        : OrientationType['LANDSCAPE-LEFT'],
                )
            }

            if (isAndroid()) {
                Dimensions.addEventListener('change', onChangeAndroid)
            } else {
                Orientation.addOrientationListener(onChange)
            }

            return () => {
                if (isAndroid()) {
                    //   Dimensions.('change', onChangeAndroid)
                } else {
                    Orientation.removeOrientationListener(onChange)
                }
            }
        }, [])

        return {
            isLandscape: screenOrientation.includes(LANDSCAPE),
            screenOrientation
        }
    },
)