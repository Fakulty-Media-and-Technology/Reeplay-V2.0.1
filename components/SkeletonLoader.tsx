import { View, ViewStyle } from 'react-native';
import Skeleton from "@thevsstech/react-native-skeleton";

export default function Placeholder ({ style, noAnimate }: { style: ViewStyle, noAnimate?:boolean }) {
  return (
    <>
    {noAnimate ? 
    <View style={[{backgroundColor:'#121212'},style]} />
  :<Skeleton
      backgroundColor="#121212"
      highlightColor="#333333"
      speed={1250}
    >
      <View style={style} />
    </Skeleton>}    
    </>
  );
};
