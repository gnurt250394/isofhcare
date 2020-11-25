import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from 'mainam-react-native-scaleimage';

const CategoriesNews = ({ navigation, props }) => {
    return (
        <View
            style={styles.container}
        >
            <TouchableOpacity
                onPress={() => navigation.pop()}
                style={styles.btnCancel}>
                <ScaleImage
                    source={require('@images/ic_close.png')}
                    height={18}
                    style={{ tintColor: '#000' }}
                />
            </TouchableOpacity>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#fff',
    },
    btnCancel: {
        padding: 5,
        alignSelf: 'flex-start'
    }
})
export default CategoriesNews