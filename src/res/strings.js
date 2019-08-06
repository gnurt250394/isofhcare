let isofhcare_service = 'isofhcare-dev/';
// let wallet_services = 'wallet-services-test/'; //test
let wallet_services = 'wallet-services-dev/'; //dev
module.exports = {
  fbApplicationId: "457683741386685",
  username: "Tên tài khoản",
  email: "Email",
  phone: "Số điện thoại",
  fullname: "Họ và tên",
  confirm_password: "Nhập lại mật khẩu",
  app_title: "ISOFH CARE",
  login: "Đăng nhập",
  register: "Đăng ký",
  send_password: "GỬI MÃ",
  input_email: "Nhập địa chỉ email",
  input_username_or_email: "Nhập Email hoặc số điện thoại",
  input_phone: "Nhập số điện thoại",
  input_password: "Mật khẩu",
  password: "Mật khẩu",
  forgot_password: "QUÊN MẬT KHẨU",
  finish: "HOÀN THÀNH",
  ehealth: "Y bạ điện tử",
  booking: "Đặt lịch",
  home: "Trang chủ",
  account: "Tài khoản",
  update: "Cập nhật",
  about: "Giới thiệu",
  confirm: "Xác nhận",
  cancel: "Hủy bỏ",
  detail: "Chi tiết",
  exit: "Thoát",
  view: "Xem",
  alert: "Thông báo",
  save: "Lưu",
  send: "Gửi",
  change_password: "Thay đổi mật khẩu",
  change_email: "Thay đổi email",
  enter_old_password: 'Nhập mật khẩu cũ',
  enter_password: 'Nhập mật khẩu',
  password_not_null: 'Mật khẩu không được bỏ trống',
  old_password_not_null: 'Mật khẩu cũ không được bỏ trống',
  new_password_not_null: '"Mật khẩu mới không được bỏ trống"',
  confirm_new_password_not_null: "Xác nhận mật khẩu mới không được bỏ trống",
  confirm_password_not_null: 'Xác nhận mật khẩu không được bỏ trống',
  password_length_8: 'Mật khẩu dài ít nhất 8 ký tự',
  confirm_password_length_8: "Xác nhận mật khẩu dài ít nhất 8 kí tự",
  new_password_not_match: 'Mật khẩu và xác nhận mật khẩu không giống nhau',
  search: "Tìm kiếm",
  share: "Chia sẻ",
  update: "Cập nhật",
  later: "Để sau",
  input_code: "Nhập mã xác thực",
  dob: "Ngày sinh",
  select_dob: 'Chọn ngày sinh',
  filenamePDF: "ket_qua",
  gender: 'Giới tính',
  select_gender: 'Chọn giới tính',
  none_data: 'Không có dữ liệu',
  none_info: 'Hiện tại chưa có thông tin',
  none_service: 'Không tìm thấy dịch vụ nào phù hợp',
  none_service_type_match: 'Không tìm thấy loại dịch vụ nào phù hợp ',
  update_to_up_case: "CẬP NHẬT",
  hospital: {
    BENH_VIEN_DAI_HOC_Y: 1
  },
  action: {
    create_navigation_global: "ACTION_SET_NAVIGATION_GLOBAL",
    action_change_login_token: "ACTION_CHANGE_LOGIN_TOKEN",
    action_user_login: "ACTION_USER_LOGIN",
    action_user_logout: "ACTION_USER_LOGOUT",
    action_change_notification_count: "ACTION_CHANGE_NOTIFICATION_COUNT",
    action_show_popup_notice_new_version: "ACTION_SHOW_POPUP_NOTICE_NEW_VERSION",
    action_set_my_facility: "ACTION_SET_MY_FACILITY",
    action_select_hospital_get_ticket: "ACTION_SELECT_HOSPITAL_GET_TICKET",
    action_select_hospital_ehealth: "ACTION_SELECT_HOSPITAL_EHEALTH",
    action_select_patient_group_ehealth: "ACTION_SELECT_PATIENT_GROUP_EHEALTH"
  },
  colors: {
    breakline: "#c0c0c0",
    white: "white",
    primaryColor: "#065cb4",
    activity_background: "white",
    actionbar_color: "#FFF",
    actionbar_title_color: '#4A4A4A',
    primary_bold: "#065cb4",
    buttonOkColor: "#ff9999"
  },
  key: {
    payment_return_url:
    {
      vnpay: "http://localhost:8888/order/vnpay_return",
      payoo: "payoo://payment_isofhcare_return"
    },
    history: {
      user_ehealth: 'USER-EHEALTH'
    },
    storage: {
      android_version: "ANDROID_VERSION",
      ios_version: "IOS_VERSION",
      current_account: "current_account",
      country: "country",
      province: "province",
      district: "district",
      zone: "zone",
      DATA_TOP_SPECIALIST: "DATA_TOP_SPECIALIST",
      DATA_TOP_FACILITY: "DATA_TOP_FACILITY",
      DATA_TOP_DISEASE: "DATA_TOP_DISEASE",
      DATA_TOP_SYMPTOM: "DATA_TOP_SYMPTOM",
      DATA_SERVICE_TYPE: "DATA_SERVICE_TYPE",
      DATA_SPECIALIST: "DATA_SPECIALIST",
      DATA_TOP_DRUG: "DATA_TOP_DRUG",
      DATA_TOP_ADS: "DATA_TOP_ADS",
      USER_PROFILE: "USER_PROFILE",
      USER_MEDICAL_RECORD: "USER_MEDICAL_RECORD",
      DATA_PROVINCE: "DATA_PROVINCE",
      CURRENT_LOCATION: "CURRENT_LOCATION",
      INTRO_FINISHED: "INTRO_FINISHED",
      LASTEST_POSTS: "LASTEST_POSTS",
      LASTEST_PROFILE: "LASTEST_PROFILE",
      LASTEST_SPECIALIST: "LASTEST_SPECIALIST",
      LASTEST_SERVICE_TYPE: "LASTEST_SERVICE_TYPE",
      KEY_FINGER: 'KEY_FINGER',
      KEY_REFRESH_TOKEN: 'KEY_REFRESH_TOKEN',
      LOCATION: "LOCATION",
      LASTEST_INFO: "LASTEST_INFO",
      LIST_BANNER: "LIST_BANNER",
      DATA_TOP_NEWS: 'DATA_TOP_NEWS',
      DATA_TOP_HOSPITAL: 'DATA_TOP_HOSPITAL'
    }
  },
  msg: {
    notification: {
      new_notification: "Bạn có một thông báo mới",
      confirm_delete_all_notification:
        "Bạn chắc chắn muốn xóa hết các thông báo?"
    },
    app: {
      check_connection: "Vui lòng kiểm tra lại kết nối internet",
      pull_to_reload_app: "Kéo xuống để tải lại danh sách",
      in_development: "Chức năng đang phát triển",
      not_internet: 'Không có kết nối mạng',
      text_without_500: 'Không cho phép nhập quá 500 kí tự',
      err_try_again: 'Có lỗi, xin vui lòng thử lại',
      dob_must_lesser_150: 'Không cho phép chọn lớn hơn 150 tuổi'
    },
    upload: {
      upload_image_error: "Upload ảnh không thành công"
    },
    error_occur: "Xảy ra lỗi, vui lòng thử lại sau",
    chat: {
      cannot_make_chat_with_this_user: "Không thể nhắn tin cho tài khoản này"
    },
    user: {
      confirm_email_active_account:
        "Đăng ký thành công, Mã xác thực đã gửi tới email bạn đã đăng ký",
      confirm_phone_active_account:
        "Đăng ký thành công, Mã xác thực đã gửi tới số điện thoại bạn đã đăng ký",
      this_account_not_active: "Tài khoản này chưa được kích hoạt",
      change_password_success: "Cập nhật mật khẩu thành công",
      change_password_success_old_password_incorrect:
        "Mật khẩu cũ không đúng. Vui lòng nhập lại",
      change_password_not_success: "Đổi mật khẩu không thành công",
      confirm_code_success:
        "Xác thực thành công. Điền đủ thông tin để đổi mật khẩu",
      active_account_success:
        "Xác thực tài khoản thành công. Vui lòng đăng nhập lại để sử dụng ứng dụng",
      confirm_code_not_success: "Xác thực không thành công",
      please_input_verify_code: "Vui lòng nhập mã xác thực",
      not_found_user_with_email_or_phone:
        "Không tìm thấy tài khoản với email hoặc số điện thoại đã nhập",
      please_input_current_password: "Vui lòng nhập mật khẩu hiện tại",
      please_input_email_or_phone:
        "Vui lòng nhập địa chỉ email hoặc số điện thoại",
      please_input_correct_email_or_phone:
        "Vui lòng nhập đúng định dạng email hoặc số điện thoại",
      please_enter_the_correct_phone_number_format:
        "Vui lòng nhập đúng định dạng số điện thoại",
      input_phonenumber: "Nhập số điện thoại",
      please_enter_current_password: "Vui lòng nhập mật khẩu hiện tại",
      please_enter_new_password: "Vui lòng nhập mật khẩu mới",
      please_enter_new_email: "Vui lòng nhập mật địa chỉ email mới",
      please_select_an_image_to_update:
        "Vui lòng chọn một ảnh đại diện để update",
      update_profile_success: "Cập nhật thông tin thành công",
      update_profile_failed: "Cập nhật thông tin không thành công",
      please_login: "Vui lòng đăng nhập để thực hiện",
      please_input_email: "Vui lòng nhập địa chỉ email",
      please_enter_the_correct_email_format:
        "Vui lòng nhập đúng định dạng email",
      please_input_username: "Vui lòng nhập tên đăng nhập",
      please_input_password: "Vui lòng nhập mật khẩu",
      please_input_confirm_password: "Vui lòng xác nhận lại mật khẩu",
      password_must_greater_than_8_character: "Mật khẩu cần lớn hơn 8 ký tự",
      password_require_uppercase_lowercase_number_special_character:
        "Mật khẩu cần chứa chữ hoa, chữ thường, số và ký tự đặc biệt",
      confirm_password_is_not_match: "Xác nhận mật khẩu không trùng khớp",
      please_input_username_and_password:
        "Vui lòng nhập tên đăng nhập và mật khẩu",
      please_input_email_to_receive_code:
        "Vui lòng nhập địa chỉ email để lấy lại mật khẩu",
      login_success: "Đăng nhập thành công",
      register_success: "Đăng ký thành công",
      username_or_email_existed:
        "SĐT đã được sử dụng trong hệ thống. Vui lòng sử dụng SĐT khác",
      username_or_email_empty: "Tên đăng nhập hoặc email trống",
      account_blocked: "Tài khoản đã bị khóa. Vui lòng liên hệ với Admin của Isofhcare",
      username_or_password_incorrect:
        "Số điện thoại hoặc mặt khẩu không đúng. Vui lòng thử lại",
      send_mail_recovery_success:
        "Link xác nhận mật khẩu mới đã được gửi về email bạn đăng ký",
      send_sms_recovery_success:
        "iSofHCare đã gửi mã xác thực tới Email/SĐT của bạn",
      send_mail_recovery_failed:
        "Không tìm thấy thông tin tài khoản với email bạn nhập",
      canot_get_user_info_in_account_facebook:
        "Không tìm thấy thông tin trong tài khoản facebook của bạn",
      canot_get_user_info_in_account_google:
        "Không tìm thấy thông tin trong tài khoản google của bạn",
      please_enter_the_correct_nickname_format:
        "Tên tài khoản không chứa khoảng trắng và ký tự đặc biệt",
      please_enter_the_correct_nickname_format_6_30:
        "Tên tài khoản nhập từ 6 đến 30 ký tự",
      please_enter_the_correct_fullname_format:
        "Vui lòng nhập đúng định dạng họ tên, không chứa các ký tự đặc biệt",
      please_input_fullname: "Vui lòng nhập họ tên",
      not_found_account: "Không tìm thấy thông tin tài khoản",
      password_incorrect: "Mật khẩu không đúng",
      update_email_success:
        "Thông tin xác nhận đã được gửi về Email mới của bạn. Vui lòng kiểm tra email để xác nhận",
      update_email_same_current_email:
        "Email mới giống với email hiện tại của bạn",
      exist_account_with_this_phone: "SĐT đã được sử dụng trong hệ thống. Vui lòng sử dụng SĐT khác",
      update_email_failed: "Cập nhật email không thành công",
      new_email_equal_current_current_email: "Email trùng với email hiện tại",
      update_avatar: "Cập nhật ảnh đại diện",
      change_password: "Thay đổi mật khẩu",
      new_password: "Mật khẩu mới",
      confirm_new_password: "Xác nhận mật khẩu",
      user_not_login: 'Bạn chưa đăng nhập vui lòng',
      login: 'Đăng nhập',
      register: 'Đăng ký',
      phone_number_not_found: 'Xác minh số điện thoại không thành công',
      fullname_not_null: 'Họ và tên không được bỏ trống',
      text_without_255: 'Không cho phép nhập quá 255 kí tự',
      input_name: "Nhập họ tên",
      email_not_null: 'Email không được bỏ trống',
      email_does_not_exits: 'Email không hợp lệ',
      email_apply_with_people_15_old: 'Vui lòng nhập email với người trên 15 tuổi'
    },
    facility: {
      please_select_value_for_rating: "Vui lòng chọn giá trị đánh giá",
      rating_facility_success: "Gửi đánh giá thành công",
      rating_facility_not_success: "Gửi đánh giá không thành công"
    },
    support: {
      send_support_success:
        "Gửi yêu cầu hỗ trợ thành công, chúng tôi sẽ liện hệ qua điện thoại với bạn trong thời gian sớm nhất",
      send_support_failed:
        "Yêu cầu của bạn chưa được gửi đi, vui lòng thử lại sau"
    },
    conference: {
      checkin_failed:
        "Checkin không thành công. Vui lòng liên hệ quản trị viên để được trợ giúp",
      checkin_success: "Checkin thành công"
    },
    ehealth: {
      not_found_result_of_this_booking: "Chưa có kết quả",
      canot_view_detail_this_booking: "Không thể xem kết quả đặt khám này",
      not_result_of_this_date: 'Không có kết quả khám nào. Bạn không đi khám ở ngày này!',
      re_examination_in_date: 'Bạn có lịch tái khám vào ngày ',
      examination_in_date: 'Bạn có lịch khám lại vào ngày',
      not_re_examination: 'Bạn không có lịch tái khám nào!',
      not_examination: 'Bạn không có lịch khám lại nào!',
      not_result_ehealth_in_day: 'Bạn chưa có kết quả khám ở ngày này!',
      not_select_time_drug: 'Bạn chưa chọn giờ uống thuốc',


    },
    question: {
      confirm_delete_post: "Bạn có muốn xoá bài viết này",
      please_input_title: "Vui lòng nhập tiêu đề câu hỏi",
      please_input_content: "Vui lòng nhập nội dung câu hỏi",
      create_question_success: "Bạn đã gửi câu hỏi thành công",
      create_question_failed: "Gửi câu hỏi không thành công"
    },
    booking: {
      not_result_history_of_this_time: 'Không có lịch trong khung giờ này',
      full_slot_on_this_time: 'Đã kín lịch trong khung giờ này',
      booking_must_equal_datetime: 'Đặt khám phải cùng ngày giờ với lịch làm việc',
      booking_must_login: "Vui lòng đăng nhập để thực hiện",
      booking_err: 'Đặt khám không thành công',
      booking_note: "Ghi chú và mô tả triệu chứng",
      image_without_five: 'Chỉ được chọn tối đa 5 ảnh',
      not_booking_macth_require_date: 'Không có lịch khám trong ngày thoả mãn yêu cầu của bạn, xin vui lòng chọn ngày khác',
      contact_not_null: "Liên lạc với tôi không được bỏ trống",
      profile_not_null: "Hồ sơ không được bỏ trống",
      require_not_null: "Yêu cầu không được bỏ trống",
      service_not_null: 'Dịch vụ không được bỏ trống',
      date_booking_not_null: "Ngày khám không được bỏ trống",
      location_not_null: "Địa điểm không được bỏ trống",
      schedule_not_null: "Giờ khám không được bỏ trống",
      image_loading: 'Một số ảnh đang được tải lên. Vui lòng chờ',
      image_load_err: 'Ảnh tải lên bị lỗi, vui lòng kiểm tra lại',
      please_select_require: "Vui lòng chọn yêu cầu khám",
      please_select_location: "Vui lòng chọn địa điểm khám",
      please_select_service: 'Vui lòng chọn dịch vụ',
      booking_expired: 'Phiên đặt khám của bạn đã hết hạn. Vui lòng thực hiện lại',
      booking_err2: 'Xác nhận đặt khám không thành công',
      create_profile_success: 'Bạn đã tạo hồ sơ thành công',
      create_relatives_success: 'Bạn đã thêm người thân thành công',
      profile_arealy_exist: "Hồ sơ đã tồn tại trong hệ thống",
      cannot_show_details_booking: 'Không thể xem chi tiết đặt khám này',

    },
    message: {
      none_image: 'Không có ảnh nào'
    }
  },
  booking: {
    select_profile: 'Chọn hồ sơ',
    require: 'Yêu cầu',
    select_require: "Chọn yêu cầu",
    location: 'Địa điểm',
    select_location: 'Chọn địa điểm',
    select_service: 'Chọn dịch vụ',
    date_booking: 'Ngày khám',
    select_date_booking: "Chọn ngày khám",
    select_time_booking: 'Chọn giờ khám',
    select_time_note: 'Gợi ý: Chọn những giờ màu xanh sẽ giúp bạn được phục vụ nhanh hơn',
    phone: 'Điện thoại',
    sms: 'SMS',
    simptom_note: 'Mô tả triệu chứng sẽ giúp bạn được phục vụ tốt hơn',
    payment_csyt: 'Thanh toán sau tại CSYT',
    payment_payoo: "PAYOO - Cửa hàng tiện ích",
    booking_success: 'Đặt khám thành công!',
    name: 'Họ tên:',
    location_booking: 'Địa chỉ đặt khám:',
    time: 'Thời gian:',
    payment_method: 'Hình thức thanh toán:',
    code_payment: 'Mã thanh toán:',
    payment_duration: 'Hạn thanh toán:',
    code: 'Mã code:',
    code_booking: 'Mã đặt khám:',
    booking_send: 'Lịch đặt khám của bạn đã được gửi đi. Vui lòng đến trước hẹn 15 phút để thực hiện các thủ tục khác.',
    go_home: 'Về trang chủ',
    add_profile: 'Thêm hồ sơ',
    add_relatives: 'Thêm người thân',
    payment_error: 'Thanh toán không thành công!',
    payment_error_message: 'Chúng tôi gặp khó khăn trong quá trình kết nối với đối tác. Vui lòng gọi tới số hotline 0923678905 nếu như bạn đã bị trừ tiền.',
    payment_code: 'Mã giao dịch',
    service: 'Dịch vụ khám',
    payment_price: 'Số tiền thanh toán:',
    change_payment_method: 'Đổi phương thức thanh toán',
    location_premmission: 'Quyền truy cập vị trí',
    location_premission_content: "iSofHCare cần quyền truy cập vào vị trí của bạn",
    location_open: 'Bật vị trí trên thiết bị để tìm kiếm địa điểm gần bạn',
    location_around: 'Tìm kiếm gần tôi',
    status: {
      not_select_payment: 'Chưa chọn hình thức',
      payment_isofh: 'Ví Isofh',
      payment_VNPAY: 'VNPAY',
      payment_CSYT: 'Thanh toán sau tại CSYT',
      payment_payoo: 'Thanh toán Payoo',
      payment_payoo2: 'Payoo - Cửa hàng tiện ích',
      pending: 'Chờ phục vụ',
      cancel: 'Đã huỷ (không đến)',
      payment_failer: 'Thanh toán thất bại',
      paymented: 'Đã thanh toán',
      payment_last: 'Thanh toán sau',
      payment_pending: 'Chờ thanh toán',
      confirm: 'Đã xác nhận',
      have_profile: 'Đã có hồ sơ',
      rejected: 'Đã hủy (không phục vụ)'
    },

  },
  ehealth: {
    checkupResult: 'KẾT QUẢ KHÁM',
    diagnosticResult: 'KẾT QUẢ CHẨN ĐOÁN HÌNH ẢNH',
    describe: 'Mô tả',
    conclude: 'Kết luận',
    ehealth_location: 'Các Cơ Sở Y Tế đã khám',
    not_result_ehealth_location: 'Hiện tại chưa có thông tin',
    lastTime: 'Lần gần nhất: ',
    lastTime2: 'Gần nhất: ',
    time: 'lần',
    total: 'Tổng: ',
    member: ' thành viên',
    cancel: 'Hủy',
    inputKeyword: "Nhập từ khóa tìm kiếm",
    lastSearch: 'Tìm kiếm gần đây',
    not_result_for_last_search: 'Không có hồ sơ chia sẻ gần đây ',
    not_result_for_keyword: 'Không có kết quả nào cho hồ sơ ',
    result_ehealth: 'Kết quả khám',
    image_result: 'Kết quả chẩn đoán hình ảnh',
    money: 'Tiền',
    surgery_result: 'Kết quả giải phẫu',
    drug: 'Thuốc',
    test_result: 'Kết quả xét nghiệm',
    full_result: 'ĐẦY ĐỦ KẾT QUẢ',
    notifi_text: 'Thông báo',
    modal_confirm: 'OK, XONG',
    suggestion: 'Suggestion',
    re_examination: 'Lịch tái khám',
    share_ehealth: "Chia sẻ y bạ",
    note: 'Ghi chú',
    clock: 'Thời gian',
    redmine_drug: 'Nhắc uống thuốc',
    view_finish: 'XEM XONG'
  },
  actionSheet: {
    orther: 'Khác',
    cancel: 'Hủy',
    profile_on_isofhcare: 'Hồ sơ trên ISOFHCARE',
    cancel2: 'Hủy bỏ',
    confirm: 'Xác nhận',
    save: 'Lưu',
    male: 'Nam',
    female: 'Nữ',
    accept: 'Đồng ý'

  },
  title: {
    ehealth: 'Y BẠ ĐIỆN TỬ',
    list_profile_ehealth: 'HỒ SƠ Y BẠ GIA ĐÌNH',
    search_profile: 'Chọn hồ sơ',
    ehealth_details: 'CHI TIẾT Y BẠ',
    create_booking_success: 'Đặt lịch khám',
    patient_history_screen: 'Lịch sử đặt lịch',
    booking: "Đặt khám",
    location_near: 'Địa điểm gần bạn',
    select_profile: 'Tất cả hồ sơ',
    select_service_type: "Chọn loại dịch vụ",
    location: 'Địa điểm',
    service: 'Dịch vụ',
    change_password: 'Đổi mật khẩu',
    result_ehealth: "KẾT QUẢ KHÁM",
    result_ehealth_image: "KẾT QUẢ CHẨN ĐOÁN HÌNH ẢNH"
  },
  api: {
    notification: {
      search: isofhcare_service + "notification/search",
      get_detail: isofhcare_service + "notification/get-detail",
      delete: isofhcare_service + "notification/delete/all",
      set_read: isofhcare_service + "notification/active-watched",
      get_unread_notification_count: isofhcare_service + "notification/count-notification"
    },
    location: {
      getListCountry: isofhcare_service + "profile/get-countries",
      getListProvince: isofhcare_service + "province/get-all",
      getListDistrict: isofhcare_service + "profile/get-districts",
      getListZone: isofhcare_service + "profile/get-zone-by-district",
      getAllCountry: isofhcare_service + 'country/get-all',
      districtGetByProvince: isofhcare_service + 'district/get-by-province',
      zoneGetByDistrict: isofhcare_service + 'zone/get-by-district',
      getAllProvince: isofhcare_service + "province/get-all",
    },
    upload: {
      image: isofhcare_service + "upload/image"
    },
    user: {
      login: isofhcare_service + "user/login",
      login_social: isofhcare_service + "user/login-social",
      logout: isofhcare_service + "user/logout",
      register: isofhcare_service + "user/register",
      forgot_password: isofhcare_service + "user/forget-password",
      update: isofhcare_service + "user/update",
      change_password: isofhcare_service + "user/update-password",
      refresh_token: isofhcare_service + "user/refresh-token",
      change_email: isofhcare_service + "user/update-email",
      confirm_code: isofhcare_service + "user/confirm-code",
      get_detail: isofhcare_service + "user/get-detail",
      refresh_password_by_token: isofhcare_service + "user/refresh-password-by-token",
      check_used_phone: isofhcare_service + "user/check-used-phone",
      use_app: isofhcare_service + "user/use-app",
    },
    keyvalue: {
      get: isofhcare_service + "key-value/get-value",
      set: isofhcare_service + "key-value/set-value"
    },
    drug: {
      search: isofhcare_service + "drug/search",
      update_view_count: isofhcare_service + "drug/update-view-count"
    },
    facility: {
      search: isofhcare_service + "facility/search",
      update: isofhcare_service + "facility/update",
      create: isofhcare_service + "facility/create",
      search_by_query: isofhcare_service + "facility/search-by-query",
      review: isofhcare_service + "facility/review",
      search_from_drug: isofhcare_service + "facility/search-from-drug"
    },
    disease: {
      search: isofhcare_service + "disease/search",
      update_view_count: isofhcare_service + "disease/update-view-count",
      get_detail: isofhcare_service + "disease/get-detail",
      search_by_disease_symptom: isofhcare_service + "disease/search-by-disease-symptom",
      search_disease_by_symptom: isofhcare_service + "disease/search-disease-by-symptom"
    },
    symptom: {
      search: isofhcare_service + "symptom/search"
    },
    specialist: {
      get_all: isofhcare_service + "specialist/get-all",
      search: isofhcare_service + "specialist/search",
      update_view_count: isofhcare_service + "specialist/update-view-count"
    },
    booking: {
      get_list_booking: isofhcare_service + "booking/get-list-patient-history-by-profile",
      get_detail_patient_historyid: isofhcare_service + "booking/get-detail-patient-history",
      get_result_patient_historyid: isofhcare_service + "booking/get-result-patient-history",
      delete: isofhcare_service + "booking/delete",
      create: isofhcare_service + "booking/create",
      confirmPay: isofhcare_service + "booking/confirm-pay",
      detail: isofhcare_service + "booking/get-detail",
      getByAuthor: isofhcare_service + "booking/get-by-author"
    },
    question: {
      create: isofhcare_service + "post/create",
      search: isofhcare_service + "post/search",
      like: isofhcare_service + "post/like",
      detail: isofhcare_service + "post/get-detail",
      review: isofhcare_service + "post/review",
      get_result_review: isofhcare_service + "post/get-result-review"
    },
    comment: {
      create: isofhcare_service + "comment/create",
      search: isofhcare_service + "comment/search"
    },
    advertise: {
      create: isofhcare_service + "advertise/create",
      search: isofhcare_service + "advertise/search",
      get_list_banner: isofhcare_service + "advertise/list-banner",
    },
    hospital: {
      get_all: isofhcare_service + "hospital/get-all",
      get_hospital_by_profile: isofhcare_service + "hospital-profile/get-hospital-by-profile",
      get_hospital_by_service_type: isofhcare_service + "hospital/get-hospital-by-service-type",
      get_hospital_by_search: isofhcare_service + "hospital/search",
      get_by_location: isofhcare_service + "hospital/get-hospital-by-locate",
      get_default_hospital: isofhcare_service + 'hospital/get-default-hospital',
      get_details_hospital: isofhcare_service + 'hospital/get-detail',
      get_hospital_by_location: isofhcare_service + 'hospital/list-hospital-top-location'
    },
    profile: {
      get_by_user: isofhcare_service + "profile/get-by-user",
      get_details_user: isofhcare_service + '/user/get-detail',
      get_profile_family: isofhcare_service + 'booking/get-group-patient-history',
      get_list_profile: isofhcare_service + 'medical-records/get-list-medical-records',
      delete_family_profile: isofhcare_service + 'medical-records/delete',
      create_profile: isofhcare_service + 'medical-records/create-medical-records',
      update_profile: isofhcare_service + 'medical-records/update-medical-records',
      update_cover: isofhcare_service + 'user/update-cover',
      update_avatar: isofhcare_service + 'medical-records/update-avatar',
      send_confirm: isofhcare_service + 'medical-records/send-confirm',
      share_permission : isofhcare_service + 'medical-records/update-permission',
      check_otp : isofhcare_service + 'medical-records/check-otp',
      resend_otp : isofhcare_service + 'medical-records/resend-otp'
    },
    serviceType: {
      get_all: isofhcare_service + "service-type/get-all"
    },
    medicalRecord: {
      get_by_user: isofhcare_service + "medical-records/get-by-user",
      createMedical: isofhcare_service + "medical-records/create"
    },
    service: {
      get_all: isofhcare_service + "service/get-all"
    },
    schedule: {
      get_by_date_and_service: isofhcare_service + "schedule-booking/get-by-date-and-service",
      search: isofhcare_service + "schedule-booking/search"
    },
    wallet: {
      createOnlinePayment: wallet_services + "customers/{id}/online-payments",
      onlineTransactionPaid: wallet_services + "online-transactions/{transactionId}/paid",
      retry: wallet_services + "online-payment-orders/{transactionId}/retry"
    },
    ticket: {
      get_ticket: isofhcare_service + "information-user-hospital/create",
      get_history_ticket: isofhcare_service + "number-hospital/get-by-author",
      get_detail: isofhcare_service + "number-hospital/get-detail"
    },
    ehealth: {
      get_group_patient: isofhcare_service + 'booking/get-group-patient-history',
      update_data_user: isofhcare_service + 'patient-history-booking/update-data-note',
      search_profile_user: isofhcare_service + 'user/search',
      share_with_profile: isofhcare_service + 'booking/share-user'
    },
    home: {
      get_list_drug: isofhcare_service + '/medicine/list-medicine-top',
      get_list_news: isofhcare_service + 'news/list-news-top',
      get_list_hospital_top_rate: isofhcare_service + 'hospital/list-hospital-top-rate'
    }
  }
};
