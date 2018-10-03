import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { Animated, Dimensions, StyleSheet, View } from 'react-native'
import MapView from 'react-native-maps'
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient'
import { Text } from 'native-base'
// import ContentComponent from './ContentComponent'
const { height: screenHeight, width: screenWidth } = Dimensions.get('window')

class EmptyScreen extends Component {
    constructor(props) {
        super(props)
    }
    scroll = new Animated.Value(0)
    headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, 56), -1)

    render() {
        const region = {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
        }
        return (
            <ActivityPanel style={{ flex: 1 }} title="Olala" hideActionbar={false} showFullScreen={true}>
                <View style={StyleSheet.absoluteFill}>

                    <Animated.ScrollView scrollEventThrottle={5}
                        showsVerticalScrollIndicator={false}
                        style={{ zIndex: 0 }}
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.scroll } } }], { useNativeDriver: true })}>
                        <Animated.View style={{
                            height: screenHeight * 0.8,
                            width: '100%',
                            transform: [{ translateY: Animated.multiply(this.scroll, 0.5) }]
                        }}>
                            <MapView style={StyleSheet.absoluteFill} region={region}>
                                <MapView.Marker title="Location" coordinate={region} />
                            </MapView>
                        </Animated.View>
                        <View style={{ position: 'absolute', height: screenHeight * 0.8, width: '100%' }}>
                            <LinearGradient
                                colors={['rgba(230, 51, 51, 0.33)', 'rgba(230, 51, 51, 0.70)', 'rgba(230, 51, 51, 1)']}
                                locations={[0, 0.7, 1]}
                                style={StyleSheet.absoluteFill} />
                        </View>
                        <View style={{
                            transform: [{ translateY: -100 }],
                            width: screenWidth,
                            paddingHorizontal: 30,
                            paddingVertical: 20,
                            backgroundColor: 'transparent'
                        }}>
                            <View style={{ ...StyleSheet.absoluteFillObject, top: -100, backgroundColor: 'rgb(245,245,245)' }} />
                            {/* <ContentComponent /> */}
                            <View>
                                <Text>
                                    > Configure project :react-native-image-crop-picker WARNING: The option 'android.enableAapt2' is deprecated and should not be used anymore. Use 'android.enableAapt2=true' to remove this warning. It will be removed at the end of 2018.. WARNING: Configuration 'compile' is obsolete and has been replaced with 'implementation' and 'api'. It will be removed at the end of 2018. For more information see: http://d.android.com/r/tools/update-dependency-configurations.html > Configure project :react-native-maps WARNING: The option 'android.enableAapt2' is deprecated and should not be used anymore. Use 'android.enableAapt2=true' to remove this warning. It will be removed at the end of 2018.. WARNING: The specified Android SDK Build Tools version (25.0.3) is ignored, as it is below the minimum supported version (27.0.3) for Android Gradle Plugin 3.1.2. Android SDK Build Tools 27.0.3 will be used. To suppress this warning, remove "buildToolsVersion '25.0.3'" from your build.gradle file, as each version of the Android Gradle Plugin now has a default version of the build tools. > Configure project :react-native-photo-view WARNING: The option 'android.enableAapt2' is deprecated and should not be used anymore. Use 'android.enableAapt2=true' to remove this warning. It will be removed at the end of 2018.. WARNING: Configuration 'compile' is obsolete and has been replaced with 'implementation' and 'api'. It will be removed at the end of 2018. For more information see: http://d.android.com/r/tools/update-dependency-configurations.html WARNING: The specified Android SDK Build Tools version (25.0.0) is ignored, as it is below the minimum supported version (27.0.3) for Android Gradle Plugin 3.1.2. Android SDK Build Tools 27.0.3 will be used. To suppress this warning, remove "buildToolsVersion '25.0.0'" from your build.gradle file, as each version of the Android Gradle Plugin now has a default version of the build tools. > Configure project :react-native-share WARNING: The option 'android.enableAapt2' is deprecated and should not be used anymore. Use 'android.enableAapt2=true' to remove this warning. It will be removed at the end of 2018.. WARNING: Configuration 'compile' is obsolete and has been replaced with 'implementation' and 'api'. It will be removed at the end of 2018. For more information see: http://d.android.com/r/tools/update-dependency-configurations.html WARNING: The specified Android SDK Build Tools version (25.0.3) is ignored, as it is below the minimum supported version (27.0.3) for Android Gradle Plugin 3.1.2. Android SDK Build Tools 27.0.3 will be used. To suppress this warning, remove "buildToolsVersion '25.0.3'" from your build.gradle file, as each version of the Android Gradle Plugin now has a default version of the build tools. > Configure project :realm WARNING: The option 'android.enableAapt2' is deprecated and should not be used anymore. Use 'android.enableAapt2=true' to remove this warning. It will be removed at the end of 2018.. The Task.leftShift(Closure) method has been deprecated and is scheduled to be removed in Gradle 5.0. Please use Task.doLast(Action) instead. at build_15ux74fb49vzwuzl13yhpk7dr.run(C:\Users\ISOFH\Desktop\work\isofh\isofh_care\node_modules\realm\android\build.gradle:77) (Run with --stacktrace to get the full stack trace of this deprecation warning.) WARNING: Configuration 'compile' is obsolete and has been replaced with 'implementation' and 'api'. It will be removed at the end of 2018. For more information see: http://d.android.com/r/tools/update-dependency-configurations.html WARNING: The specified Android SDK Build Tools version (26.0.2) is ignored, as it is below the minimum supported version (27.0.3) for Android Gradle Plugin 3.1.2. Android SDK Build Tools 27.0.3 will be used. To suppress this warning, remove "buildToolsVersion '26.0.2'" from your build.gradle file, as each version of the Android Gradle Plugin now has a default version of the build tools. > Configure project :rn-fetch-blob WARNING: The option 'android.enableAapt2' is deprecated and should not be used anymore. Use 'android.enableAapt2=true' to remove this warning. It will be removed at the end of 2018.. WARNING: Configuration 'compile' is obsolete and has been replaced with 'implementation' and 'api'. It will be removed at the end of 2018. For more information see: http://d.android.com/r/tools/update-dependency-configurations.html WARNING: The specified Android SDK Build Tools version (23.0.1) is ignored, as it is below the minimum supported version (27.0.3) for Android Gradle Plugin 3.1.2. Android SDK Build Tools 27.0.3 will be used. To suppress this warning, remove "buildToolsVersion '23.0.1'" from your build.gradle file, as each version of the Android Gradle Plugin now has a default version of the build tools. > Task :app:processDebugGoogleServices Parsing json file: C:\Users\ISOFH\Desktop\work\isofh\isofh_care\android\app\google-services.json > Task :app:installDebug Installing APK 'app-debug.apk' on 'Developer(AVD) - 8.1.0' for app:debug Installed on 1 device.
                                </Text>
                            </View>
                        </View>
                    </Animated.ScrollView>
                    <Animated.View style={{
                        width: "100%",
                        position: "absolute",
                        transform: [{
                            translateY: this.headerY
                        }],
                        flex: 1,
                        backgroundColor: 'transparent'
                    }}>
                    </Animated.View>
                </View>
            </ActivityPanel>
        )
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(EmptyScreen);