/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {useEffect, useState} from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { StatusBar, useColorScheme } from 'react-native';

import {WebView} from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';
import {useNetInfo} from '@react-native-community/netinfo';
import LinearGradient from 'react-native-linear-gradient';
import {
  requestTrackingPermission,
  getTrackingStatus,
} from 'react-native-tracking-transparency';

function App(): React.JSX.Element {
  const {isConnected} = useNetInfo();
  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(false);

  let WebViewRef: any;

  useEffect(() => {
    const getPersmissions = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
      }
    };
    getPersmissions();
  }, []);

  useEffect(() => {
    setLoad(true)

  },[2000])

  useEffect(() => {
    const requestTrackingPermissions = async () => {
      const trackingStatus = await getTrackingStatus();
      if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
        // enable tracking features
      } else {
        //if tracking is not allowed
        await requestTrackingPermission();
      }
    };
    requestTrackingPermissions();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  const openPaymentsUrl = async (url: string) => {
    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url);
    }
  };

  if (isConnected === false) {
    return (
      <View style={styles.offlineScreenContainer}>
        <Image
          source={require('./assets/offline_screen.png')}
          style={styles.offlineScreen}
        />
        <TouchableOpacity
          style={styles.tryAgainBtn}
          onPress={() => {
            WebViewRef && WebViewRef.reload();
          }}>
          <Image
            source={require('./assets/btn_try_again.png')}
            style={styles.tryAgainBtnImg}
          />
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.webViewContainer}>
        {loading ? (
          <LinearGradient
            colors={['#126c96', '#35C3FF']}
            style={styles.offlineScreenContainer}>
            <ActivityIndicator
              hidesWhenStopped={true}
              color={'white'}
              style={{}}
            />
          </LinearGradient>
        ) : null}

       {load && <WebView
          ref={WEBVIEW_REF => (WebViewRef = WEBVIEW_REF)}
          source={{uri: 'https://www.dialogpay.net/login/'}}
          style={styles.webViewContainer}
          geolocationEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          allowFileAccess={true}
          onLoadStart={() => {
            console.log('onLoadStart');
          }}
          onLoad={() => {
            console.log('onLoad');
          }}
          onLoadEnd={() => {
            console.log('onLoadEnd');
            setLoading(false);
          }}
          onError={() => {
            console.log('onError');
          }}
          onMessage={event => {
            const data = JSON.parse(event.nativeEvent.data);
            console.log(data);
            if (data && data.data === 'ios-subscription-redirection') {
              openPaymentsUrl('https://www.dialogpay.net/subscription/');
            } else if (data && data.data === 'ios-registration-redirection') {
              openPaymentsUrl('https://www.dialogpay.net/register/');
            } else if (
              data &&
              data.data === 'static-subscription-redirection'
            ) {
              openPaymentsUrl('https://www.dialogpay.com/more/');
            }
          }}
        />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  webViewContainer: {
    flex: 1,
  },
  offlineScreenContainer: {
    backgroundColor: 'white',
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineScreen: {
    width: '100%',
    height: Dimensions.get('screen').height - 50,
    resizeMode: 'stretch',
  },
  tryAgainBtn: {
    position: 'absolute',
    bottom: 100,
    height: 50,
    left: 16,
    right: 16,
  },
  tryAgainBtnImg: {
    resizeMode: 'stretch',
    height: 50,
    width: '100%',
  },
});

export default App;
