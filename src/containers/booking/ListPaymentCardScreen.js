import ActivityPanel from '@components/ActivityPanel'
import ItemPayment from '@components/payment/ItemPayment'
import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import paymentProvider from '@data-access/payment-provider';

const ListPaymentCardScreen = () => {
    const [data, setData] = useState([])
    const getData = async () => {
        try {
            let res = await paymentProvider.getListCard()
            
            setData(res)
        } catch (error) {

        }
    }
    useEffect(() => {
        getData()
    }, [])
    const onDeleteCard = (item) => () => {
        let list = data.filter(e => e.id != item.id)
        setData(list)
    }
    const renderItem = ({ item, index }) => {
        return (
            <ItemPayment item={item} onDelete={onDeleteCard(item)} />
        )
    }
    const keyExtractor = (item, index) => index.toString()
    return (
        <ActivityPanel title="Liên kết thẻ">
            <FlatList
                data={data}
                style={{ padding: 10 }}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
            />
        </ActivityPanel>
    )
}

export default ListPaymentCardScreen
