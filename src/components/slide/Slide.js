import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { IndicatorViewPager } from 'mainam-react-native-viewpager';

class Slide extends Component {
    constructor(props) {
        super(props);
        let array = this.props.dataArray;
        if (!array)
            array = [];
        this.state = {
            position: 0,
            array
        };
    }
    renderViewPager(array) {
        return <IndicatorViewPager style={{ flex: 1 }} ref={(viewPager) => { this.viewPager = viewPager }} onPageScroll={this.onPageScroll.bind(this)}>
            {
                array.map((item, index) => {
                    return (
                        <View key={index}>{this.props.renderItemPager ? this.props.renderItemPager(item, index) : <View />}</View>
                    )
                })
            }
        </IndicatorViewPager >
    }

    onPageScroll(e) {
        var position = e.position;
        var offset = e.offset * 100;
        if (position == -1 || (position == 1 && offset > 0))
            return;
        this.setState({
            position: position
        })
    }
    renderIndicator(array) {
        return <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {
                array.map((item, index) => {
                    return (
                        <View key={index} style={{ margin: 2, width: 6, height: 6, backgroundColor: '#000', borderRadius: 3.5, backgroundColor: this.state.position == index ? 'rgb(74,144,226)' : "#00000060" }}></View>
                    )
                })
            }
        </View >
    }
    nextPosition() {
        try {
            if (this.state.array && this.state.array.length > 1) {
                let position = this.state.position;
                position++;
                if (position >= this.state.array.length) {
                    position = 0;
                }
                this.setState({
                    position
                }, () => {
                    if (this.viewPager)
                        this.viewPager.setPage(position);
                });
            }
        } catch (error) {

        }
    }
    componentDidMount() {
        if (this.props.autoPlay && this.state.array && this.state.array.length > 1)
            this.myInteval = setInterval(() => { this.nextPosition() }, this.props.inteval ? this.props.inteval : 2000);
    }
    componentWillUnmount() {
        if (this.myInteval) {
            try {
                clearInterval(this.myInteval);
            } catch (error) {

            }
        }
    }
    render() {
        return (<View style={[{ height: this.props.height ? this.props.height : "100%" }, this.props.style]}>
            {this.renderViewPager(this.state.array)}
            {
                this.state.array.length > 1 ?
                    this.renderIndicator(this.state.array) : null
            }
        </View>);
    }
}
function mapStateToProps(state) {
    return {
        navigation: state.navigation
    }
}
export default connect(mapStateToProps, null, null, { withRef: true })(Slide);