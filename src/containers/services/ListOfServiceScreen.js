import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image, FlatList } from 'react-native';
import ActivityPanel from '@components/ActivityPanel'
import ImageLoad from "mainam-react-native-image-loader";
import StarRating from 'react-native-star-rating';
import ScaleImage from 'mainam-react-native-scaleimage';
const { width, height } = Dimensions.get('window')
const ListOfServiceScreen = ({ navigation }) => {
    const item = navigation.getParam('item', {})
    console.log('item: ', item);
    const [description, setDescription] = useState('')
    const [state, setState] = useState({
        data: [
            {
                id: 1,
                name: 'Lê lê lê',
                rating: 4.5,
                comment: 'Tôi đã đặt khám ở đây và thấy dịch vụ rất tốt, chuyên nghiệp'
            },
            {
                id: 2,
                name: 'Lê lê lê',
                rating: 4.5,
                comment: 'Tôi đã đặt khám ở đây và thấy dịch vụ rất tốt, chuyên nghiệp'
            },
        ]
    })
    const onSelected = () => {
        console.log('item: ', item);
        item.hospital.address = item.hospital.contact.address
        navigation.navigate("addBooking1", {
            hospital: item.hospital,
            listServicesSelected: [item],
            allowBooking:true,
            disableService:true
        });
    }
    useEffect(() => {
        if (item.description.length > 300) {
            setDescription(item.description.substring(0, 300))
        } else {
            setDescription(item.description)
        }
    }, [])
    const showDescription = (item) => () => {
        setDescription(item.description)
    }
    const renderDescription = (item) => {

        return (
            <Text style={styles.txtDescription}>{description} {description.length == 300 ? <Text onPress={showDescription(item)} style={{
                color: '#FF8A00',
                fontStyle: 'italic'
            }}>Xem thêm</Text> : ''}</Text>

        )
    }
    const keyExtractor = (item, index) => `${index}`
    const renderItem = ({ item, index }) => {
        return (
            <View style={{
                paddingVertical: 10,

            }}>
                <View style={{
                    height: 0.5,
                    width: '98%',
                    alignSelf: 'center',
                    backgroundColor: '#00000070'
                }} />
                <Text style={{
                    color: '#000',
                    fontWeight: 'bold',
                    paddingTop: 10
                }}>{item.name}</Text>
                <StarRating
                    disabled={true}
                    starSize={11}
                    containerStyle={{ width: '20%' }}
                    maxStars={5}
                    rating={item.rating}
                    starStyle={{ margin: 1, marginVertical: 7 }}
                    fullStarColor={"#fbbd04"}
                    emptyStarColor={"#fbbd04"}
                    fullStar={require("@images/ic_star.png")}
                    emptyStar={require("@images/ic_empty_star.png")}
                    halfStar={require("@images/half_star.png")}
                />
                <Text numberOfLines={3}>{item.comment}</Text>
            </View>

        )
    }
    const url = item.image ? { uri: item.image } : require('@images/new/ic_default_service.png')
    const source = item.hospital.imagePath ? { uri: item.hospital.imagePath } : require("@images/new/user.png");
    return (
        <ActivityPanel title="Chi tiết dịch vụ khám">
            <ScrollView>
                <View style={{ paddingLeft: 25, }}>
                    <View style={styles.ContainerNameService}>
                        <View style={styles.flex}>

                            <Text style={styles.txtService}>{item?.name}</Text>
                            <Text style={styles.txtHospital}>{item?.hospital?.name}</Text>
                        </View>
                        <ImageLoad
                            resizeMode="cover"
                            imageStyle={styles.borderImgProfile}
                            borderRadius={25}
                            customImagePlaceholderDefaultStyle={[styles.avatar, styles.placeHolderImgProfile]}
                            placeholderSource={require("@images/new/user.png")}
                            resizeMode="cover"
                            loadingStyle={{ size: 'small', color: 'gray' }}
                            source={source}
                            style={styles.imgProfile}
                            defaultImage={() => {
                                return (
                                    <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={40} height={40} />
                                )
                            }}
                        />
                    </View>
                    <Image source={url} style={styles.imgService} />
                    <View style={styles.groupPrice}>
                        <Text style={styles.txtPriceFinal}>{item?.monetaryAmount?.value?.formatPrice()} đ</Text>
                        <Text style={styles.txtPriceUnit}>{item?.monetaryAmount?.value?.formatPrice()} đ</Text>

                        <Text style={styles.txtVoucher}>Giam 100k</Text>
                    </View>
                </View>
                <View style={styles.groupBookingRating}>
                    <View style={styles.groupBooking}>
                        <Text style={styles.txtBooking}>Lượt đặt khám</Text>
                        <Text>100</Text>
                    </View>
                    <View style={styles.groupBooking}>
                        <Text style={styles.txtBooking}>Lượt tư vấn</Text>
                        <Text>100</Text>
                    </View>
                    <View style={styles.groupRating}>
                        <Text style={styles.txtBooking}>Đánh giá</Text>
                        <Text style={styles.txtNumbberRating}>100</Text>
                    </View>
                </View>
                <View style={styles.containerDetail}>
                    <Text style={styles.txtlabel}>Mô tả chi tiết</Text>
                    {renderDescription(item)}
                </View>
                <View style={{
                    padding: 20,
                    borderTopColor: '#f2f2f2',
                    borderBottomColor: '#f2f2f2',
                    borderTopWidth: 10,
                    borderBottomWidth: 10,
                    marginTop: 20
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{
                            color: '#00BA99',
                            fontWeight: 'bold',
                            fontSize: 15
                        }}>ĐÁNH GIÁ</Text>
                        <Text>22 luot</Text>
                    </View>
                    <FlatList
                        data={state.data}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                    />
                </View>
            </ScrollView>
            <View style={styles.containerButtonSelect}>
                <Text style={styles.txtTitleSelect}>Bạn muốn chọn dịch vụ khám này?</Text>
                <TouchableOpacity
                    onPress={onSelected}
                    style={styles.buttonSelect}>
                    <Text style={styles.txtSelect}>CHỌN</Text>
                </TouchableOpacity>
            </View>
        </ActivityPanel>
    )
}

export default ListOfServiceScreen

const styles = StyleSheet.create({
    txtDescription: {
        color: '#00000090'
    },
    txtNumbberRating: {
        color: '#00BA99',
        fontWeight: 'bold'
    },
    groupBookingRating: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    txtVoucher: {
        paddingLeft: 10,
        color: '#FF7A00',
        fontWeight: 'bold'
    },
    txtPriceUnit: {
        color: '#000000',
        paddingLeft: 10,
        textDecorationLine: 'line-through'
    },
    txtPriceFinal: {
        color: '#00BA99',
        fontWeight: 'bold',
        fontSize: 16
    },
    groupPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    txtHospital: {
        textDecorationLine: 'underline',
        color: '#00000090',
        paddingBottom: 10
    },
    ContainerNameService: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 10
    },
    txtBooking: {
        color: '#00000090'
    },
    groupRating: {
        alignItems: 'center',
        flex: 1
    },
    groupBooking: {
        alignItems: 'center',
        flex: 1,
        borderRightColor: '#00000050',
        borderRightWidth: 1
    },
    flex: {
        flex: 1
    },
    imgProfile: {
        alignSelf: 'center',
        borderRadius: 25,
        width: 50,
        height: 50
    },
    placeHolderImgProfile: { width: 50, height: 50 },
    borderImgProfile: {
        borderRadius: 25,
        borderWidth: 0.5,
        borderColor: 'rgba(151, 151, 151, 0.29)'
    },
    imgService: {
        height: 200,
        width: width - 50,
        resizeMode: 'contain',
    },
    txtlabel: {
        color: '#000',
        paddingTop: 20,
        fontWeight: 'bold'
    },
    containerDetail: {
        paddingHorizontal: 25,
    },
    txtPrice: {
        color: 'rgba(0, 0, 0, 0.5)',
        paddingBottom: 15,
    },
    txtService: {
        color: '#3161AD',
        fontSize: 18,
        fontWeight: 'bold',
        paddingBottom: 6,
        paddingTop: 25,
    },
    txtSelect: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    },
    buttonSelect: {
        backgroundColor: '#00CBA7',
        height: 42,
        alignSelf: 'center',
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        marginBottom: 10
    },
    txtTitleSelect: {
        color: 'rgba(0, 0, 0, 0.5)',
        paddingBottom: 12,
        paddingLeft: 21,
        fontStyle: 'italic'
    },
    containerButtonSelect: {
        backgroundColor: '#FFF',
        borderTopColor: 'rgba(0, 0, 0, 0.05)',
        borderTopWidth: 1,
        paddingVertical: 10
    },
})