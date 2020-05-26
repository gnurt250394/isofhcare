import React, { useEffect } from 'react'
import { View, Text, Linking } from 'react-native'
import NavigationService from '@navigators/NavigationService'
import queryString from 'query-string';
const Deeplink = () => {

    useEffect(() => {

        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(url => {
                navigate(url);
            });
        } else {
            Linking.addEventListener('url', handleOpenURL);
        }
        return () => {
            Linking.removeEventListener('url', handleOpenURL);
        }
    }, [])
    const handleOpenURL = (event) => { // D
        navigate(event.url);
    }

    const navigate = (url) => { // E
        const route = url.replace(/.*?:\/\//g, '');
        const route1 = queryString.parseUrl(route);
        const routeName = route1.url;
        const { data } = route1.query;
        let data2 = data ? JSON.parse(data) : {}
        switch (routeName) {
            case 'doctor':
                NavigationService.navigate('listDoctor', { id: data2?.id })
                break;
            case 'service':
                NavigationService.navigate('listOfServices', { item: { id: data2?.id } })
                break;
            case 'hospital':
                NavigationService.navigate('addBooking1', { hospital: { id: data2?.id, name: data2?.name } })
                break;
            default:
                break;
        }

    }
    return (
        <View></View>
    )
}

export default Deeplink
