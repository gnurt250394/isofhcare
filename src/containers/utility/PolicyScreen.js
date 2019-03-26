import React, { Component } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { ScrollView, View, Text } from 'react-native';
import { connect } from 'react-redux';

class PolicyScreen extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <ActivityPanel
                style={{ flex: 1 }}
                title="CHÍNH SÁCH RIÊNG TƯ"
                showFullScreen={true}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ padding: 15 }}>
                        <Text style={styles.title}>1.	Những nguyên tắc bảo mật của ISofHcare</Text>
                        <Text style={styles.content}>Hoạt động của ISOFHCARE được xây dựng trên nền tảng sự tin tưởng giữa bạn với chúng tôi. Nhằm bảo mật thông tin cá nhân bạn cung cấp cho chúng tôi, ISOFHCARE luôn tuân thủ những nguyên tắc bảo mật sau:</Text>
                        <Text style={styles.content}>•	Chúng tôi chỉ yêu cầu những thông tin cá nhân mà chúng tôi tin là có liên quan và cần thiết để chúng tôi hiểu rõ các nhu cầu chăm sóc sức khỏe của bạn.</Text>
                        <Text style={styles.content}>•	Chúng tôi sử dụng thông tin cá nhân của bạn để cung cấp các dịch vụ và sản phẩm tốt hơn.</Text>
                        <Text style={styles.content}>•	ISOFHCARE có quyền chia sẻ thông tin cá nhân của bạn và sử dụng nó phù hợp với chính sách bảo mật của chúng tôi.</Text>
                        <Text style={styles.content}>•	Chúng tôi đặt mục tiêu lưu trữ thông tin cá nhân của bạn một cách chính xác và cập nhật.</Text>
                        <Text style={styles.content}>•	Chúng tôi sẽ không tiết lộ các thông tin cá nhân mà bạn cung cấp cho bất bỳ tổ chức bên ngoài trừ khi bạn đồng ý hoặc do pháp luật yêu cầu hoặc chúng tôi đã thông báo trước cho bạn.</Text>
                        <Text style={styles.content}>•	Chính sách bảo mật của chúng tôi có thể được thay đổi, cập nhật bất cứ lúc nào mà không cần sự cho phép của bạn và bạn hoàn toàn đồng ý với điều đó.</Text>
                        <Text style={styles.content}>Bằng cách duy trì cam kết của chúng tôi đối với những nguyên tắc trên, ISofHcare muốn khẳng định rằng chúng tôi luôn trân trọng sự tin tưởng mà bạn dành cho chúng tôi.</Text>
                        <Text style={styles.title}>2.	Định nghĩa các loại thông tin</Text>
                        <Text style={styles.content}>Các loại thông tin được định nghĩa như sau:</Text>
                        <Text style={styles.content}>•	Thông tin cá nhân là thông tin mà bạn cung cấp cho chúng tôi, bao gồm: danh tính cá nhân và thông tin sức khỏe cá nhân.</Text>
                        <Text style={styles.content}>•	Danh tính cá nhân là thông tin dùng để chúng tôi xác định danh tính và liên lạc với bạn trong các trường hợp cần thiết. Thông tin này bao gồm: họ tên, email, số điện thoại, địa chỉ, ảnh hồ sơ của bạn.</Text>
                        <Text style={styles.content}>•	Thông tin sức khỏe cá nhân là toàn bộ thông tin về bệnh án, hình ảnh bạn cung cấp cho bác sĩ, lịch sử sử dụng dịch vụ và các thông tin khác liên quan đến sức khỏe của bạn.</Text>
                        <Text style={styles.content}>•	Thông tin tổng hợp là thông tin được tổng hợp từ nhiều người dùng khác nhau và không liên kết với bất kỳ tài khoản cá nhân nào. Các thông tin này được sử dụng hoàn toàn cho mục đích phân tích và nghiên cứu, hoàn toàn không dùng để xác định danh tính cá nhân. Bất kì ai, kể cả ISOFHCARE, không được sử dụng thông tin tổng hợp để truy tìm thông tin sức khỏe của bất kì cá nhân nào.</Text>
                        <Text style={styles.content}>•	Thông tin phi cá nhân là dữ liệu mà không cho phép việc liên kết hay xác định danh tính của bất kỳ cá nhân nào cụ thể.</Text>
                        <Text style={styles.title}>3.	Thông tin cá nhân mà chúng tôi thu thập</Text>
                        <Text style={styles.content}>ISOFHCARE có quyền thu thập và sử dụng thông tin cá nhân, thông tin tổng hợp để phục vụ cho quá trình vận hành, nghiên cứu, phát triển sản phẩm và dịch vụ của chúng tôi.</Text>
                        <Text style={styles.content}>Chúng tôi sẽ thu thập thông tin của bạn khi:</Text>
                        <Text style={styles.content}>•	Bạn đăng ký hoặc sửa đổi tài khoản của bạn.</Text>
                        <Text style={styles.content}>•	Bạn đề nghị các dịch vụ theo yêu cầu.</Text>
                        <Text style={styles.content}>•	Bạn liên hệ với bộ phận hỗ trợ khách hàng.</Text>
                        <Text style={styles.content}>•	Hoặc bất kỳ cách nào khác mà bạn chọn để liên lạc với chúng tôi.</Text>
                        <Text style={styles.content}>Thông tin này có thể bao gồm nhưng không giới hạn, như: họ tên, email, số điện thoại, địa chỉ, ảnh hồ sơ, các ghi chú và thông tin khác mà bạn chọn cung cấp.</Text>
                        <Text style={styles.content}>Bạn phải chịu toàn bộ trách nhiệm với các thông tin mà bạn cung cấp. Vào bất cứ lúc nào, chúng tôi có quyền yêu cầu bạn gửi lại thông tin cá nhân khi bị phát hiện có bất kỳ sự thiếu sót hoặc nhầm lẫn nào.</Text>
                        <Text style={styles.title}>4.	Chúng tôi sử dụng thông tin của bạn như thế nào?</Text>
                        <Text style={styles.content}>ISOFHCARE sử dụng thông tin cá nhân của bạn cũng như các thông tin khác liên quan đến vấn đề y tế và chăm sóc sức khỏe của bạn để giúp chúng tôi cũng như các chuyên gia, bác sĩ đưa ra các đề xuất, thông báo, nhắc nhở liên quan đến việc chăm sóc sức khỏe của cá nhân bạn.</Text>
                        <Text style={styles.content}>Chúng tôi cũng có quyền tổng hợp thông tin sức khỏe cá nhân và các thông tin khác của bạn với các thông tin khác để trở thành thông tin tổng hợp. Thông tin này được dùng cho việc nghiên cứu và phát triển các sản phẩm, dịch vụ, nội dung và quảng cáo.</Text>
                        <Text style={styles.title}>5.	Chúng tôi bảo vệ thông tin của bạn như thế nào?</Text>
                        <Text style={styles.content}>ISOFHCARE luôn cố gắng đảm bảo dữ liệu cá nhân của quý khác được bảo vệ để không bị truy cập trái phép hoặc tình cờ, bị xử lý hoặc xóa bỏ.</Text>
                        <Text style={styles.content}>Chúng tôi duy trì cam kết bảo mật dữ liệu này bằng cách áp dụng những biện pháp vật lý, điện tử hiện đại và an toàn nhất để bảo vệ dữ liệu cá nhân của quý khách.</Text>
                        <Text style={styles.title}>6.	Chính sách sử dụng cookies</Text>
                        <Text style={styles.content}>Bạn có quyền lựa chọn chấp nhận hay không chấp nhận các cookie.</Text>
                        <Text style={styles.content}>Tuy nhiên, chúng là một phần quan trọng trong cách thức hoạt động của Dịch vụ của chúng tôi, vì vậy bạn cần lưu ý rằng nếu bạn chọn từ chối hoặc xóa các cookie, điều này có thể ảnh hưởng tới tình trạng sẵn có và chức năng của Dịch vụ.</Text>
                        <Text style={styles.title}>7.	Chính sách dành cho trẻ em</Text>
                        <Text style={styles.content}>Trẻ em dưới 18 tuổi không được phép để tự tạo tài khoản cá nhân trên hệ thống ISOFHCARE. </Text>
                        <Text style={styles.content}>Trẻ em chỉ được sử dụng dịch vụ tư vấn sức khỏe của ISOFHCARE khi có sự giám sát của bố mẹ hoặc người giám hộ.</Text>
                        <Text style={styles.content}>Mọi thông tin về sức khỏe, mọi thông tin cá nhân cũng như các thông tin khác bắt buộc phải lưu trữ trong tài khoản của bố mẹ hoặc người dám hộ như là một phần của hồ sơ y tế gia đình.</Text>
                        <Text style={styles.content}>Những thông tin này tuân theo quy định của chính sách bảo mật của ISOFHCARE tương đương với các thông tin khác của bố mẹ hoặc người giám hộ</Text>
                    </View>
                </ScrollView>
            </ActivityPanel>
        )
    }
}

const styles = {
    title: {
        fontSize: 14,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0.1,
        color: "#2f5eac",
        paddingTop: 20,
        paddingBottom: 5,
    },
    content: {
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
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(PolicyScreen);