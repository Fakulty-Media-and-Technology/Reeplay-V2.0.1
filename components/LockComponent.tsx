import { View, Text, Modal } from 'react-native'
import React, { useState } from 'react'
import GetStartedScreen from '@/Screens/authentication/GetStartedScreen'
import AppPIN from '@/Screens/authentication/AppPIN'

export const LockComponent = () => {
 const [screen, setScreen] = useState<'getStarted'|'pin'>('getStarted')
 
 switch(screen){
    case 'getStarted':
        return <GetStartedScreen handleFunc={() => setScreen('pin')} screen={screen} />

    case 'pin':
        return <AppPIN handleFunc={() => setScreen('getStarted')} />
 }
}

const ModalComponent = () =>{
    return(
        <Modal visible style={{backgroundColor:'#000'}}>
            <View className='flex-1 bg-black'>
            <LockComponent />
            </View>
        </Modal>
    )
}

export default ModalComponent