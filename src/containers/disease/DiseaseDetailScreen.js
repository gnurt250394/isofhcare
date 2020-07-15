import React, { Component } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { ScrollView, View, Dimensions, Text } from 'react-native';
import Slide from '@components/slide/Slide';
import { connect } from 'react-redux';
import diseaseProvider from '@data-access/disease-provider'
import ImageLoad from 'mainam-react-native-image-loader';
import TopSearch from '@components/facility/TopFacility'
import constants from '@resources/strings';
class DiseaseDetailScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }

    }
    componentDidMount() {
        const disease = this.props.navigation.getParam("disease", null);
        // console.log("**********************************************************************")
        // console.log(disease);
        // console.log("**********************************************************************")
        if (disease && disease.disease) {
            diseaseProvider.updateViewCount(disease.disease.id, (s, e) => {

            })
        }
    }

    renderItemPager(item, index) {
        return <View style={styles.containerItemPaper} >
            <ImageLoad
                resizeMode="contain"
                source={{ uri: item && item.url ? item.url : "undefined" }} style={{ width: Dimensions.get('window').width, height: 135 }} />
        </View>
    }

    render() {
        const disease = this.props.navigation.getParam("disease", null);
        return (
            <ActivityPanel style={styles.flex} title="CHI TIẾT" showFullScreen={true}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {
                        disease.images && disease.images.length > 0 ?
                            <Slide autoPlay={true} inteval={3000} dataArray={disease.images} renderItemPager={this.renderItemPager.bind(this)} style={{ height: 150 }} />
                            : null
                    }
                    <View style={styles.box}>
                        <Text style={styles.name}>{disease.disease.name}</Text>
                        <View style={styles.card}>
                            <Text style={styles.title}>{constants.disease.age}: <Text style={styles.value}>{disease.disease.fromAge}-{disease.disease.toAge}</Text></Text>

                        </View>
                        {disease.disease.generalInfo ?
                            <View style={styles.card}>
                                <Text style={styles.title}>{constants.disease.over_view}:</Text>
                                <Text style={styles.value}>{disease.disease.generalInfo}</Text>
                            </View>
                            : <View />}
                        {disease.disease.reason ?
                            <View style={styles.card}>
                                <Text style={styles.title}>{constants.disease.cause}:</Text>
                                <Text style={styles.value}>{disease.disease.reason}</Text>
                            </View>
                            : <View />}
                        {disease.symptoms && disease.symptoms.length > 0 ?
                            <View style={styles.card}>
                                <Text style={styles.title}>{constants.disease.symptom}:</Text>
                                {
                                    disease.symptoms.map((item, index) => {
                                        return <Text key={index} style={styles.value}>{item.name}</Text>
                                    })
                                }

                            </View>
                            : <View />}
                        {disease.disease.treatment ?
                            <View style={styles.card}>
                                <Text style={styles.title}>{constants.disease.treatment}:</Text>
                                <Text style={styles.value}>{disease.disease.treatment}</Text>
                            </View>
                            : <View />}
                        <TopSearch />
                    </View>

                </ScrollView>
            </ActivityPanel >
        );
    }
}

const styles = {
    name: {
        color: 'rgb(74,74,74)',
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 20,
    },
    box: {
        paddingHorizontal: 15,
        paddingBottom: 20
    },
    card: {},
    title: {
        fontSize: 14,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0.1,
        color: "#2f5eac",
        paddingTop: 20,
        paddingBottom: 5
    },
    value: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0.1,
        color: 'rgb(74,74,74)'
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp
    };
}
export default connect(mapStateToProps)(DiseaseDetailScreen);

const styles = StyleSheet.create({
    flex: { flex: 1 },
    containerItemPaper: {
        flex: 1,
        elevation: 5,
        backgroundColor: 'white',
        marginBottom: 10,
        borderColor: 'rgb(204, 204, 204)',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
})