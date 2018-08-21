import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import drugProvider from '@data-access/drug-provider';
import Slide from '@components/slide/Slide';
import clientUtils from '@utils/client-utils';
import stringUtils from 'mainam-react-native-string-utils';
import Dash from 'mainam-react-native-dash-view';
import ImageProgress from 'mainam-react-native-image-progress';
import Progress from 'react-native-progress/Pie';
import { Rating } from 'react-native-ratings';
import ItemFacility from '@components/facility/ItemFacility';

class DrugDetailScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    renderItemPager(item, index) {
        return <View style={{
            flex: 1,
            elevation: 5,
            backgroundColor: 'white',
            marginBottom: 10,
            borderColor: 'rgb(204, 204, 204)',
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
        }} shadowColor='#000000' shadowOpacity={0.2} shadowOffset={{}}>
            <ScaledImage uri={item && item.url ? item.url.absoluteUrl() : "undefined"} width={Dimensions.get('window').width} height={135} />
        </View>
    }
    getType(category) {
        switch (category) {
            case 1: return "Thuốc thường"
            case 2: return "Dịch truyền"
            case 4: return "Độc"
            case 8: return "Hóa chất"
            case 16: return "Hướng thần"
            case 32: return "Máu"
            case 64: return "Nghiên cứu khoa học"
            case 128: return "Thực phẩm chức năng"
            case 256: return "Thuốc gây nghiện"
            case 512: return "Vật tư tiêu hao"
            case 2014: return "Hàm lượng"
        }
    }
    getMethodUse(use) {
        switch (use) {
            case 1: return "Ngậm";
            case 2: return "Nhai";
            case 3: return "Ngậm dưới lưỡi";
            case 4: return "Truyền tĩnh mạch";
            case 5: return "Bôi";
            case 6: return "Xoa ngoài";
            case 7: return "Dán trên da";
            case 8: return "Xịt ngoài da";
            case 9: return "Thụt hậu môn - trực tràng";
            case 10: return "Thụt";
            case 11: return "Phun mù";
            case 12: return "Dạng hít";
            case 13: return "Bột hít";
            case 14: return "Xịt";
            case 15: return "Khí dung";
            case 16: return "Đường hô hấp";
            case 17: return "Xịt mũi";
            case 18: return "Xịt họng";
            case 19: return "Thuốc mũi";
            case 20: return "Nhỏ mũi";
            case 21: return "Nhỏ mắt";
            case 22: return "Tra mắt";
            case 23: return "Thuốc mắt";
            case 24: return "Nhỏ tai";
            case 25: return "Áp ngoài da";
            case 26: return "Áp sát khối u";
            case 27: return "Bình khí lỏng hoặc nén";
            case 28: return "Bình khí nén";
            case 29: return "Bôi trực tràng";
            case 30: return "Đánh tưa lưỡi";
            case 31: return "Cấy vào khối u";
            case 32: return "Chiếu ngoài";
            case 33: return "Dung dịch";
            case 34: return "Dung dịch rửa";
            case 35: return "Dung dịch thẩm phân";
            case 36: return "Phun";
            case 37: return "Đặt";
            case 38: return "Tiêm tĩnh mạch";
            case 39: return "Tiêm truyền tĩnh mạch";
            case 40: return "Tiêm truyền";
            case 41: return "Tiêm dưới da";
            case 42: return "Tiêm trong da";
            case 43: return "Tiêm trong dịch kính của mắt";
            case 44: return "Tiêm vào các khoang của cơ thể";
            case 45: return "Tiêm động mạch khối u";
            case 46: return "Tiêm vào khối u";
            case 47: return "Tiêm vào khoang tự nhiên";
            case 48: return "Tiêm";
            case 49: return "Đặt hậu môn";
            case 50: return "Đặt âm đạo";
            case 51: return "Đặt tử cung";
            case 52: return "Dùng ngoài";
            case 53: return "Hỗn dịch";
            case 54: return "Bột đông khô để pha hỗn dịch";
            case 55: return "Túi";
            case 56: return "Dùng thụt";
            case 57: return "Tiêm bắp";
            case 58: return "Tiêm nội nhãn cầu";
            case 59: return "Tiêm vào ổ khớp";
            case 60: return "Uống";
            case 61: return "Đặt dưới lưỡi";
        }
    }
    componentDidMount() {
        const drug = this.props.navigation.getParam("drug", null);
        if (drug && drug.drug) {
            drugProvider.updateViewCount(drug.drug.id, (s, e) => {

            })
        }
    }
    render() {
        const drug = this.props.navigation.getParam("drug", null);
        return (
            <ActivityPanel style={{ flex: 1 }} title="CHI TIẾT THUỐC" showFullScreen={true}>
                <ScrollView>
                    {
                        drug.images && drug.images.length > 0 ?
                            <Slide autoPlay={true} inteval={3000} dataArray={drug.images} renderItemPager={this.renderItemPager.bind(this)} style={{ height: 150 }} />
                            : null
                    }
                    <View style={{ padding: 20 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: 'rgb(74,74,74)', fontWeight: 'bold', fontSize: 20 }}>{drug.drug.name}</Text>
                                <Text style={{ color: 'rgb(74,144,226)', fontSize: 14, marginTop: 5 }}>{this.getType(drug.drug.category)}</Text>
                            </View>
                            {
                                drug.drug.price ?
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Text style={{ color: 'rgb(74,74,74)', marginTop: 2, fontSize: 14 }}>Giá tham khảo</Text>
                                        <Text style={{ color: 'rgb(208,2,27)', fontWeight: 'bold', fontSize: 18, marginTop: 5 }}>{drug.drug.price.formatPrice()} đ</Text>
                                    </View> : null
                            }
                        </View>
                        {drug.drug.activeSubstances ?
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text>Hoạt chất: {drug.drug.activeSubstances}</Text>
                                </View>
                                <Dash style={{ height: 1, flexDirection: 'row', marginTop: 7, marginBottom: 7 }} dashStyle={{ backgroundColor: 'rgb(131,147,202)' }} />
                            </View> : null
                        }
                        {drug.drug.methodUse ?
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text>Đường dùng: {this.getMethodUse(drug.drug.methodUse)}</Text>
                                </View>
                                <Dash style={{ height: 1, flexDirection: 'row', marginTop: 7, marginBottom: 7 }} dashStyle={{ backgroundColor: 'rgb(131,147,202)' }} />
                            </View> : null
                        }
                        {drug.drug.standard ?
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text>Quy cách đóng gói: {drug.drug.standard}</Text>
                                </View>
                                <Dash style={{ height: 1, flexDirection: 'row', marginTop: 7, marginBottom: 7 }} dashStyle={{ backgroundColor: 'rgb(131,147,202)' }} />
                            </View> : null
                        }
                        {drug.drug.manufacturer ?
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text>Nhà sản xuất: {drug.drug.manufacturer}</Text>
                                </View>
                                <Dash style={{ height: 1, flexDirection: 'row', marginTop: 7, marginBottom: 7 }} dashStyle={{ backgroundColor: 'rgb(131,147,202)' }} />
                            </View> : null
                        }
                        {drug.drug.useness ?
                            <Text style={{ fontWeight: 'bold', marginTop: 23 }}><Text style={{ color: 'rgb(0,151,124)' }}>Chỉ định: </Text>{drug.drug.useness}</Text>
                            : null
                        }
                        {drug.drug.avoidUseness ?
                            <Text style={{ fontWeight: 'bold', marginTop: 23 }}><Text style={{ color: 'rgb(0,151,124)' }}>Chống chỉ định: </Text>{drug.drug.avoidUseness}</Text>
                            : null
                        }
                    </View>
                    {/* <Text style={{ margin: 20, color: 'rgb(47,94,172)', fontWeight: '500' }}>CÓ BÁN TẠI CÁC NHÀ THUỐC</Text>
                    {
                        [1, 2, 3, 4, 5].map((item, index) => {
                            return <ItemFacility key={index} style={{ marginLeft: 14, marginRight: 14 }} />
                        })
                    } */}
                </ScrollView>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(DrugDetailScreen);