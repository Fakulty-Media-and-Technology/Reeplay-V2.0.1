import { useEffect, useState } from 'react'
import { Dimensions, Platform, ScaledSize } from 'react-native'
import Orientation, { LANDSCAPE, OrientationType } from 'react-native-orientation-locker'
import { singletonHook } from 'react-singleton-hook'

export const isAndroid = () => Platform.OS === 'android'

const useForceUpdate = () => {
    const [, setValue] = useState(0);
    return () => setValue(value => value + 1);
};


export const useScreenOrientation = singletonHook(
    {
        isLandscape: false,
        screenOrientation: Orientation.getInitialOrientation(),
    },
    () => {
        const [screenOrientation, setScreenOrientation] = useState(Orientation.getInitialOrientation())
        const forceUpdate = useForceUpdate();

        useEffect(() => {
            const onChange = (result: OrientationType) => {
                setScreenOrientation(result);
                forceUpdate()
                // console.log(result)
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
                    //   Dimensions.remove('change', onChangeAndroid)
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