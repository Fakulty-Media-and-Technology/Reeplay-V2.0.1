import Toast, {ToastType} from 'react-native-toast-message';

interface Props {
  type: ToastType;
  text?: string;
}

const ToastNotification = (type: ToastType, text?: string) => {
  switch (type) {
    case 'success':
      Toast.show({
        type: 'success',
        text1: 'Hooray🎉🎉',
        text2: text,
      });
      break;
    case 'info':
      Toast.show({
        type: 'info',
        text1: 'Heads up💡',
        text2: text,
      });
      break;
    case 'error':
      Toast.show({
        type: 'error',
        text1: 'Opps❗❗❗',
        text2: text ? text : 'Sorry for the inconveneince',
      });
  }
};

export default ToastNotification;