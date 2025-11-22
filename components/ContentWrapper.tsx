import { View, Text, ViewStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IGenre, IVODContent } from '@/types/api/content.types'
import { getVODbyEnumID } from '@/api/content.api'
import AppCategories from './AppCategories'
import Size from '@/Utils/useResponsiveSize'
import colors from '@/configs/colors'
import { ImageStyle } from 'react-native-fast-image'
import { getData, storeData } from '@/Utils/useAsyncStorage'

interface Props{
    enums: IGenre
    showPagination?:boolean
    style?:ViewStyle
    imageStyle?: ImageStyle
    tag?: boolean
    live?:boolean
    isMusic?:boolean
}

const ContentWrapper = ({enums, live,isMusic, showPagination,imageStyle, tag, style}:Props) => {
    const [content, setContent] = useState<IVODContent[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    async function fetchVODContent(){
        try {
           if(content.length === 0) setLoading(true);       
            const res = await getVODbyEnumID({enumId: enums._id, pagination:{page:1, limit:100}})
            if(res.ok && res.data){
                setContent(res.data.data)
                await storeData(enums._id, JSON.stringify(res.data.data))
            }
        } catch (error) {
            
        }finally{
            setLoading(false);
        }
    }

    async function handleFetContent(){
        const cacheContent = await getData(enums._id);
        if(cacheContent) setContent(JSON.parse(cacheContent))
            fetchVODContent();
    }

    useEffect(() =>{
        handleFetContent();
    }, [enums._id]);

  return (
    <>
         <AppCategories
            title={enums.name}
            movieCategories={content}
            onPress={() => console.log('popular')}
            style={style ?? { marginRight: Size.calcHeight(12) }}
            imageStyle={imageStyle}
            tag={tag}
            isLoading={loading || content.length === 0}
            video={isMusic}
        />

    {(showPagination && (!loading && content.length > 5)) &&
         <View className="flex-row items-center justify-center gap-x-1.5 -mb-4 mt-4">
            {[...Array(5)].map((item, i) => {
                const active = i === 1 || i === 2 || i === 3;
                const color = active ? colors.RED : 'rgba(255, 19, 19, 0.4)';
                      return (
                        <View
                          key={i}
                          style={{
                            marginTop: active ? 0 : 1,
                            width: active ? 9 : 7,
                            height: active ? 9 : 7,
                            borderRadius: 99,
                            backgroundColor: color,
                          }}
                        />
                    );
            })}
        </View>
    }
    </>
  )
}

export default ContentWrapper