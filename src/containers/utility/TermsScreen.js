import React, { Component } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { ScrollView, View, Text } from 'react-native';
import { connect } from 'react-redux';

class TermsScreen extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <ActivityPanel
                style={{ flex: 1 }}
                title="ĐIỀU KHOẢN SỬ DỤNG"
                showFullScreen={true}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ padding: 15 }}>
                        <Text>Vui lòng đọc kỹ thỏa thuận sử dụng trước khi bạn tiến hành tải cài đặt, sử dụng tất cả hoặc bất kỳ phần nào của ứng dụng iSofHcare (“Ứng dụng”) (bao gồm nhưng không giới hạn phần mềm, các file và các tài liệu liên quan) hoặc sử dụng các dịch vụ do Công ty cổ phần công nghệ iSofH (“iSofH”) cung cấp để kết nối đến Ứng dụng. Bạn chấp thuận và đồng ý bị ràng buộc bởi các quy định và điều kiện trong thỏa thuận này khi thực hiện các thao tác trên đây. Trường hợp bạn không đồng ý với bất kỳ điều khoản sử dụng nào của chúng tôi (phiên bản này và các phiên bản cập nhật), bạn vui lòng không tải, cài đặt, sử dụng Ứng dụng hoặc tháo gỡ Ứng dụng ra khỏi thiết bị di động của bạn</Text>
                        <Text style={styles.title}>1. Cập Nhật</Text>
                        <Text style={styles.content}>
                            Thỏa thuận này có thể được cập nhật thường xuyên bởi iSofH, phiên bản cập nhất sẽ được chúng tôi công bố tại website: <Text style={{ color: 'blue' }}>http://iSofH.com/cdyt/dieukhoan</Text>. Phiên bản cập nhật này sẽ thay thế cho các quy định và điều kiện trong thỏa thuận ban đầu. Bạn có thể truy cập vào ứng dụng hoặc vào website trên đây để xem nội dung chi tiết của phiên bản cập nhật.
                        </Text>
                        <Text style={styles.title}>2. Giới Thiệu Về Ứng Dụng</Text>
                        <Text style={styles.content}>
                            iSofHcare là ứng dụng chẩn đoán, tra cứu về các triệu chứng, bệnh, nguyên nhân bệnh, cơ sở y tế, bác sỹ, thuốc và kết nối, trao đổi, chia sẻ thông tin trong iSofHcare dành riêng cho người dùng di động tại Việt Nam. Ứng dụng sử dụng số điện thoại và danh bạ làm nền tảng với các tính năng chính:  chẩn đoán, tra cứu về triệu chứng, bệnh, nguyên nhân bệnh, cơ sở y tế, bác sỹ, thuốc và kết nối, trao đổi, chia sẻ thông tin trong iSofHcare. Ứng dụng hỗ trợ tất cả các nền tảng Android, iOS và website.</Text>
                        <Text style={styles.title}>3. Quyền Sở Hữu Ứng Dụng</Text>
                        <Text style={styles.content}>
                            Ứng dụng này được phát triển và sở hữu bởi iSofH, tất cả các quyền sở hữu trí tuệ liên quan đến ứng dụng  (bao gồm nhưng không giới hạn mã nguồn, hình ảnh, dữ liệu, thông tin, nội dung chứa đựng trong Ứng dụng; các sửa đổi, bổ sung, cập nhật của ứng dụng) và các tài liệu hướng dẫn liên quan (nếu có) sẽ thuộc quyền sở hữu duy nhất bởi iSofH và không cá nhân, tổ chức nào được phép chép, tái tạo, phân phối, hoặc hình thức khác xâm phạm tới quyền của chủ sở hữu nếu không có sự đồng ý và cho phép bằng văn bản của iSofH.
                        </Text>
                        <Text style={styles.title}>4. Tài Khoản</Text>
                        <Text style={styles.content}>
                            Để sử dụng Ứng Dụng bạn phải tạo ra một tài khoản theo yêu cầu của chúng tôi, bạn cam kết rằng việc sử dụng tài khoản phải tuân thủ các quy định của iSofH, đồng thời các thông tin bạn cung cấp cho chúng tôi là đúng, chính xác, đầy đủ với tại thời điểm được yêu cầu. Mọi quyền lợi và nghĩa vụ của bạn sẽ căn cứ trên thông tin tài khoản bạn đã đăng ký, do đó nếu có bất kỳ thông tin sai lệch nào chúng tôi sẽ không chịu trách nhiệm trong trường hợp thông tin đó làm ảnh hưởng hoặc hạn chế quyền lợi của bạn.
                        </Text>
                        <Text style={styles.title}>5. Quyền Sử Dụng Ứng Dụng</Text>
                        <Text style={styles.content}>Bạn có quyền sử dụng Ứng dụng và các dịch vụ khác mà chúng tôi cung cấp, tuy nhiên việc sử dụng đó sẽ không bao gồm các hành vi sau đây nếu không có sự đồng ý bằng văn bản của iSofH.</Text>
                        <Text style={styles.content}>•  Sao chép, chỉnh sửa, tái tạo, tạo ra sản phẩm mới hoặc phiên bản phái sinh trên cơ sở Ứng dụng này;</Text>
                        <Text style={styles.content}>•  Bán, chuyển giao, cấp quyền lại, tiết lộ hoặc hình thức chuyển giao khác hoặc đưa một phần hoặc toàn bộ Ứng dụng cho bất kỳ bên thứ ba;</Text>
                        <Text style={styles.content}>•  Sử dụng Ứng dụng để cung cấp dịch vụ cho bất kỳ bên thứ ba (tổ chức, cá nhân);</Text>
                        <Text style={styles.content}>•  Di chuyển, xóa bỏ, thay đổi bất kỳ thông báo chính đáng hoặc dấu hiệu nào của Ứng dụng (bao gồm nhưng không giới hạn các tuyên bố về bản quyền);</Text>
                        <Text style={styles.content}>•  Thiết kế lại, biên dịch, tháo gỡ, chỉnh sửa, đảo lộn thiết kế của Ứng dụng hoặc nội dung Ứng dụng;</Text>
                        <Text style={styles.content}>•  Thay đổi hoặc hủy bỏ trạng thái ban đầu của Ứng dụng;</Text>
                        <Text style={styles.content}>•  Sử dụng Ứng dụng để thực hiện bất kỳ hành động gây hại cho hệ thống an ninh mạng của iSofH, bao gồm nhưng không giới hạn sử dụng dữ liệu hoặc truy cập vào máy chủ hệ thống hoặc tài khoản không được phép; truy cập vào hệ thống mạng để xóa bỏ, chỉnh sửa và thêm các thông tin; phát tán các chương trình độc hại, virus hoặc thực hiện bất kỳ hành động nào khác nhằm gây hại hoặc phá hủy hệ thống mạng;</Text>
                        <Text style={styles.content}>•  Đăng nhập và sử dụng Ứng dụng bằng một phần mềm tương thích của bên thứ ba hoặc hệ thống không được phát triển, cấp quyền hoặc chấp thuận bởi iSofH;</Text>
                        <Text style={styles.content}>•  Sử dụng, bán, cho mượn, sao chép, chỉnh sửa, kết nối tới, phiên dịch, phát hành, công bố các thông tin liên quan đến Ứng dụng, xây dựng mirror website để công bố các thông tin này hoặc để phát triển các sản phẩm phái sinh, công việc hoặc dịch vụ;</Text>
                        <Text style={styles.content}>•  Sử dụng ứng dụng để đăng tải, chuyển, truyền hoặc lưu trữ các thông tin vi phạm pháp luật, vi phạm thuần phong mỹ tục của dân tộc;</Text>
                        <Text style={styles.content}>•  Sử dụng Ứng dụng để sử dụng, đăng tải, chuyển, truyền hoặc lưu trữ bất kỳ nội dung vi phạm quyền sở hữu trí tuệ, bí mật kinh doanh hoặc quyền pháp lý của bên thứ ba;</Text>
                        <Text style={styles.content}>•  Sử dụng Ứng dụng hoặc các dịch vụ khác được cung cấp bởi iSofH trong bất kỳ hình thức vi phạm pháp luật nào, cho bất kỳ mục đích bất kỳ hợp pháp nào;</Text>
                        <Text style={styles.content}>•  Các hình thức vi phạm khác.</Text>
                        <Text style={styles.title}>6. Xử Lý Vi Phạm</Text>
                        <Text style={styles.content}>Trường hợp bạn vi phạm bất kỳ quy định nào trong Thỏa thuận này, iSofH có quyền ngay lập tức khóa tài khoản của bạn và/hoặc xóa bỏ toàn bộ các thông tin, nội dung vi phạm, đồng thời tùy thuộc vào tính chất, mức độ vi phạm bạn sẽ phải chịu trách nhiệm trước cơ quan có thẩm quyền, iSofH và bên thứ ba về mọi thiệt hại gây ra bởi hoặc xuất phát từ hành vi vi phạm của bạn.</Text>
                        <Text style={styles.title}>7. Quyền Truy Cập và Thu Thập Thông Tin</Text>
                        <Text style={styles.content}>(a) Khi sử dụng Ứng dụng, bạn thừa nhận rằng chúng tôi có quyền sử dụng những iSofH hệ thống sau để truy cập vào dữ liệu trên điện thoại của bạn: (1) Đọc và ghi vào danh bạ điện thoại, (2) Lấy vị trí hiện tại của bạn khi được sự đồng ý, (3) Ghi dữ liệu của Ứng dụng lên thẻ nhớ, (4)Truy cập vào Internet từ thiết bị của bạn. Tất cả các truy cập này đều được chúng tôi thực hiện sau khi có sự đồng ý của bạn, vì vậy bạn cam kết và thừa nhận rằng, khi bạn đã cấp quyền cho chúng tôi, bạn sẽ không có bất kỳ khiếu nại nào đối với iSofH về việc truy cập này.</Text>
                        <Text style={styles.content}>(b) Cùng với quyền truy cập, chúng tôi sẽ thu thập các thông tin sau của bạn:</Text>
                        <Text style={styles.content}>•	Thông tin cá nhân: bao gồm các thông tin bạn cung cấp cho chúng tôi để xác nhận tài khoản như tên, số điện thoại, số chứng minh nhân dân, địa chỉ email;</Text>
                        <Text style={styles.content}>•	Thông tin chung: như các thông tin về cấu hình điện thoại của bạn, thông tin phiên bản iSofH mà bạn đang sử dụng cho điện thoại của mình;</Text>
                        <Text style={styles.content}>•	Thông tin vị trí của bạn: dữ liệu về vị trí địa lý của bạn sẽ được lưu trữ trên máy chủ nhằm giúp bạn sử dụng chức năng tìm kiếm của Ứng dụng;</Text>
                        <Text style={styles.content}>•	Danh bạ điện thoại: chúng tôi sẽ lưu trữ danh bạ điện thoại của bạn trên máy chủ nhằm hỗ trợ tốt nhất cho bạn trong việc sử dụng Ứng dụng và tránh trường hợp bạn bị mất dữ liệu. Chúng tôi cam kết sẽ tôn trọng và không sử dụng danh bạ điện thoại của bạn vì bất kỳ mục đích nào nếu không có sự đồng ý của bạn;</Text>
                        <Text style={styles.content}>•	Chúng tôi không sử dụng bất kỳ biện pháp nào để theo dõi nội dung tin nhắn, trao đổi hoặc hình thức khác nhằm theo dõi người dùng khi sử dụng Ứng dụng này.</Text>
                        <Text style={styles.title}>8. Cam Kết Bảo Mật Thông Tin</Text>
                        <Text style={styles.content}>iSofH sử dụng các phương thức truyền tin an toàn https và mã hóa để truyền tải và lưu trữ các dữ liệu cá nhân và giao tiếp của bạn. Chúng tôi cam kết giữ bí mật tất cả thông tin mà bạn cung cấp cho iSofH hoặc chúng tôi thu thập từ bạn và không tiết lộ với bất kỳ bên thứ ba nào trừ khi có yêu cầu từ Cơ quan Nhà nước có thẩm quyền.</Text>
                        <Text style={styles.title}>9. Phí và Các Khoản Thu</Text>
                        <Text style={styles.content}>iSofH cam kết không thu bất cứ khoản phí nào từ người dùng cho các dịch vụ cơ bản mà hiện tại chúng tôi đang cung cấp.</Text>
                        <Text style={styles.title}>10. Quảng cáo và các nội dung thương mại được phân phối bởi iSofH</Text>
                        <Text style={styles.content}>Khi sử dụng ứng dụng, bạn thừa nhận rằng chúng tôi có quyền sử dụng các thông tin không định danh của bạn nhằm cung cấp các nội dung quảng cáo đúng đối tượng</Text>
                        <Text style={styles.title}>11. Lưu Ý Sử Dụng</Text>
                        <Text style={styles.content}>Một số tính năng kết bạn theo sở thích hay địa điểm như: Tìm bạn quanh đây có thể gây phiền toái cho người sử dụng. Khi sử dụng tính năng này, bạn có thể tìm thấy được bạn mới và đồng thời bạn cũng sẽ được tìm thấy bởi người lạ. Bạn phải cẩn thận khi quyết định hẹn gặp một người lạ thông qua tính năng này, nếu bạn phát hiện người lạ có dấu hiệu lừa đảo hoặc phạm tội, xin hãy báo cáo lại cho chúng tôi hoặc cơ quan Pháp luật gần nhất. Nếu bạn cảm thấy phiền toái sau khi sử dụng tính năng này, hãy chọn Ẩn vị trí để không bị làm phiền.</Text>
                        <Text style={styles.title}>12. Liên lạc với chúng tôi</Text>
                        <Text style={styles.content}>Địa chỉ email: <Text style={{ color: 'blue' }}>support@iSofHcare.com</Text> hoặc Công ty cổ phần công nghệ iSofH. Địa chỉ: Tầng 3, Toà AB, UDIC Complex, Hoàng Đạo Thuý, Trung Hoà, Cầu Giấy, Hà Nội</Text>
                        <Text style={styles.content}>Trân trọng cảm ơn bạn đã sử dụng sản phẩm và dịch vụ của chúng tôi.</Text>
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
        paddingBottom: 5
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
export default connect(mapStateToProps)(TermsScreen);