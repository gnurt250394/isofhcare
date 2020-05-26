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
        const query = route1.query;
        switch (routeName) {
            case 'doctor':
                NavigationService.navigate('listDoctor', { id: query?.id })
                break;
            case 'service':
                NavigationService.navigate('listOfServices', { item: { id: query?.id } })
                break;
            case 'hospital':
                NavigationService.navigate('addBooking1', { hospital: { id: query?.id, name: decodeURIComponent(query?.name) } })
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
