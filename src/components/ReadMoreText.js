import React from "react";
import { StyleSheet, Text, View } from "react-native";

class ReadMoreText extends React.Component {
    state = {
        measured: false,
        shouldShowReadMore: false,
        showAllText: false
    };

    componentDidMount() {
        this.getLengthText()
    }
    getLengthText = async () => {
        this._isMounted = true;
        await nextFrameAsync();

        if (!this._isMounted) {
            return;
        }

        // Get the height of the text with no restriction on number of lines
        const fullHeight = await measureHeightAsync(this._text);
        this.setState({ measured: true });
        await nextFrameAsync();

        if (!this._isMounted) {
            return;
        }

        // Get the height of the text now that number of lines has been set
        const limitedHeight = await measureHeightAsync(this._text);

        if (fullHeight > limitedHeight) {
            this.setState({ shouldShowReadMore: true }, () => {
                this.props.onReady && this.props.onReady();
            });
        } else {
            this.props.onReady && this.props.onReady();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    onLayout = (event) => {
        const { height } = event.nativeEvent.layout
        if (height > 80) {
            this.setState({ shouldShowReadMore: true }, () => {
                this.props.onReady && this.props.onReady();
            });
        }
    }
    render() {
        let { measured, showAllText, shouldShowReadMore } = this.state;

        let { numberOfLines } = this.props;

        return (
            <View>
                <Text
                    numberOfLines={shouldShowReadMore && !showAllText ? numberOfLines : 0}
                    style={this.props.textStyle}
                    onLayout={this.onLayout}
                    ref={text => {
                        this._text = text;
                    }}
                >
                    {this.props.children}
                </Text>

                {this._maybeRenderReadMore()}
            </View>
        );
    }

    _handlePressReadMore = () => {
        this.setState({ showAllText: true });
    };

    _handlePressReadLess = () => {
        this.setState({ showAllText: false });
    };

    _maybeRenderReadMore() {
        let { shouldShowReadMore, showAllText } = this.state;


        if (shouldShowReadMore && !showAllText) {
            if (this.props.renderTruncatedFooter) {
                return this.props.renderTruncatedFooter(this._handlePressReadMore);
            }

            return (
                <Text style={styles.button} onPress={this._handlePressReadMore}>
                    Xem thêm
                </Text>
            );
        }
        // else if (shouldShowReadMore && showAllText) {
        //     if (this.props.renderRevealedFooter) {
        //         return this.props.renderRevealedFooter(this._handlePressReadLess);
        //     }

        //     return (
        //         <Text style={styles.button} onPress={this._handlePressReadLess}>
        //             Hide
        //         </Text>
        //     );
        // }
    }
}

function measureHeightAsync(component) {
    return new Promise(resolve => {
        component.measure((x, y, w, h) => {
            resolve(h);
        });
    });
}

function nextFrameAsync() {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

const styles = StyleSheet.create({
    button: {
        color: "#FF8A00",
        marginTop: 5,
        textDecorationLine: 'underline'
    }
});
export default ReadMoreText