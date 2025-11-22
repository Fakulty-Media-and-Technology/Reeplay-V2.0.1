import { View, Text, StatusBar, Dimensions } from 'react-native'
import React, { ReactNode, useEffect, useState } from 'react'
import { useScreenOrientation } from '@/Hooks/useScreenOrientation';
import Orientation from 'react-native-orientation-locker';
import Size from '@/Utils/useResponsiveSize';
// import { hideNavigationBar,showNavigationBar } from 'react-native-navigation-bar-color';
import SystemNavigationBar from 'react-native-system-navigation-bar';



export interface OrientationInjectedProps {
  isFullscreen: boolean;
  makePortrait: () => void;
  makeFullscreen: () => void;
}

interface OrientationWrapperProps {
  children: (injectedProps: OrientationInjectedProps) => ReactNode;
}

const OrientationWrapper = ({ children }: OrientationWrapperProps) => {
    const {isLandscape: landscape} = useScreenOrientation();
     const [manualLandscape, setManualLandscape] = useState<boolean>(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

   function makePortrait() {
    // showNavigationBar();
    SystemNavigationBar.fullScreen(false);
    Orientation.lockToPortrait();
    setManualLandscape(false);
    manualLandscape && setIsLandscape(false);
}

function makeFullscreen(){
    if(!isLandscape && !manualLandscape){
        if(isLandscape || manualLandscape){
            // showNavigationBar();
            SystemNavigationBar.fullScreen(false);
            Orientation.lockToPortrait()
        }else{
            // hideNavigationBar();
            SystemNavigationBar.fullScreen(true);
            Orientation.lockToLandscapeLeft()
        }
            setManualLandscape(!manualLandscape);
            manualLandscape && setIsLandscape(false);
    }
  }

    useEffect(() => {
    Orientation.getOrientation(result => {
      setManualLandscape(result.includes('LANDSCAPE'));
    });

  }, []);

   useEffect(() => {
    if (isLandscape) setManualLandscape(false);

    Orientation.addOrientationListener(result => {
      if (result.includes('LANDSCAPE')) {
        setManualLandscape(result.includes('LANDSCAPE'));
      } else {
        setManualLandscape(false);
        setIsLandscape(false);
      }
    });
  }, [isLandscape, landscape]);


  return (
    <View 
     style={[{
        height: !isLandscape
          ? manualLandscape
            ? Size.wp(100)
            : Size.hp(100)
          : Size.wp(100),
            width:
              isLandscape || manualLandscape
                ? screenHeight
                : Size.wp(100),
          },
        ]}
    >
      {children({
        isFullscreen: landscape || manualLandscape,
        makePortrait,
        makeFullscreen,
      })}
    </View>
  )
}

export default OrientationWrapper