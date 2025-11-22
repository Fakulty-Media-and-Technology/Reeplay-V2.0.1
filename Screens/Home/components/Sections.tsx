import {StyleSheet} from 'react-native';
import React from 'react';
import {AppView} from '@/components';
import Size from '@/Utils/useResponsiveSize';
import ContentWrapper from '@/components/ContentWrapper';
import { useAppSelector } from '@/Hooks/reduxHook';
import { selectCategories } from '@/store/slices/bannerSlice.slice';

interface Props {
  isSkipped: boolean;
}

const Sections = ({isSkipped}: Props) => {
  const cat = useAppSelector(selectCategories);

  if(cat.length === 0) return <></>
  return (
    <>
      {isSkipped && (
        <AppView className="mt-10 pl-5">
          <ContentWrapper
              enums={cat[0]}
              showPagination
            />
        </AppView>
      )}
      <AppView style={{marginTop: isSkipped ? 24 : 40}} className="pl-5">
            {cat.length > 1 && <ContentWrapper
              enums={cat[1]}
            />}
      </AppView>

      {cat.slice(2, cat.length-1).map((x,i) =>{
        const isTop10 = x.name.toLowerCase().includes('top 10') 
        const isComingSoon = x.name.toLowerCase().includes('comming soon')
        const isLive = x.name.toLowerCase().includes('live')
        const isMusic = x.name.toLowerCase().includes('music')
        return (
          <AppView key={i} className={`mt-6 pl-5 ${isComingSoon ? 'mb-[40px]' :''}`}>
             <ContentWrapper
              enums={x}
              style={{marginRight: Size.calcHeight((isTop10 || isComingSoon) ? 8 : 12)}}
              imageStyle={(isComingSoon || isTop10) ? {} : isMusic ? styles.videoBackdrop:{}}
              tag={isTop10}
              live={isLive}
              isMusic={isMusic}
            />
          </AppView>
        )
      })}
    </>
  );
};

export default Sections;

const styles = StyleSheet.create({
  videoBackdrop: {
    width: Size.calcWidth(182),
    height: Size.calcHeight(146),
  },
});
