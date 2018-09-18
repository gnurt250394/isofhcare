module.exports = {
  username: 'Tên tài khoản',
  email: 'Email',
  phone: 'Số điện thoại',
  fullname: 'Họ và tên',
  confirm_password: 'Nhập lại mật khẩu',
  app_title: 'ISOFH CARE',
  login: "Đăng nhập",
  register: "Đăng ký",
  send_password: "GỬI MÃ",
  input_email: "Nhập địa chỉ email",
  input_username_or_email: 'Nhập Email hoặc số điện thoại',
  input_password: 'Mật khẩu',
  forgot_password: 'QUÊN MẬT KHẨU',
  ehealth: 'Y bạ điện tử',
  booking: 'Đặt lịch',
  home: 'Trang chủ',
  account: 'Tài khoản',
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
  change_password: 'Thay đổi mật khẩu',
  change_email: 'Thay đổi email',
  search: 'Tìm kiếm',
  share: "Chia sẻ",
  update: "Cập nhật",
  later: "Để sau",
  input_code: "Nhập mã xác thực",
  action: {
    create_navigation_global: "ACTION_SET_NAVIGATION_GLOBAL",
    action_change_login_token: "ACTION_CHANGE_LOGIN_TOKEN",
    action_user_login: "ACTION_USER_LOGIN",
    action_user_logout: "ACTION_USER_LOGOUT",
    action_change_notification_count: "ACTION_CHANGE_NOTIFICATION_COUNT",
    action_show_popup_notice_new_version: "ACTION_SHOW_POPUP_NOTICE_NEW_VERSION",
  },
  colors: {
    breakline: '#c0c0c0',
    white: 'white',
    primaryColor: '#065cb4',
    activity_background: 'white',
    actionbar_color: '#FFF',
    actionbar_title_color: 'rgb(0,151,124)',
    primary_bold: '#065cb4',
    buttonOkColor: '#ff9999',
  },
  key: {
    storage: {
      android_version: "ANDROID_VERSION",
      ios_version: "IOS_VERSION",
      current_account: "current_account",
      country: 'country',
      province: 'province',
      district: 'district',
      zone: 'zone',
      DATA_TOP_SPECIALIST: "DATA_TOP_SPECIALIST",
      DATA_TOP_FACILITY: "DATA_TOP_FACILITY",
      DATA_TOP_DISEASE: "DATA_TOP_DISEASE",
      DATA_TOP_SYMPTOM: "DATA_TOP_SYMPTOM",
      DATA_TOP_DRUG: "DATA_TOP_DRUG",
      DATA_PROVINCE: "DATA_PROVINCE",
      CURRENT_LOCATION: "CURRENT_LOCATION",
      INTRO_FINISHED: "INTRO_FINISHED"
    }
  },
  msg:
  {
    notification: {
      new_notification: "Bạn có một thông báo mới"
    },
    app:
    {
      check_connection: "Vui lòng kiểm tra lại kết nối internet",
      pull_to_reload_app: "Kéo xuống để tải lại danh sách",
      in_development: "Chức năng đang phát triển",
    },
    upload:
    {
      upload_image_error: "Upload ảnh không thành công"
    },
    error_occur: "Xảy ra lỗi, vui lòng thử lại sau",
    user:
    {
      this_account_not_active: "Tài khoản này chưa được kích hoạt",
      change_password_success: "Đổi mật khẩu thành công",
      change_password_not_success: "Đổi mật khẩu không thành công",
      confirm_code_success: "Xác thực thành công. Điền đủ thông tin để đổi mật khẩu",
      confirm_code_not_success: "Xác thực không thành công",
      please_input_verify_code: "Vui lòng nhập mã xác thực",
      not_found_user_with_email_or_phone: "Không tìm thấy tài khoản với email hoặc số điện thoại đã nhập",
      please_input_current_password: "Vui lòng nhập mật khẩu hiện tại",
      please_input_email_or_phone: "Vui lòng nhập địa chỉ email hoặc số điện thoại",
      please_input_correct_email_or_phone: "Vui lòng nhập đúng định dạng email hoặc số điện thoại",
      please_enter_the_correct_phone_number_format: "Vui lòng nhập đúng định dạng số điện thoại",
      input_phonenumber: "Nhập số điện thoại",
      please_enter_current_password: "Vui lòng nhập mật khẩu hiện tại",
      please_enter_new_password: "Vui lòng nhập mật khẩu mới",
      please_enter_new_email: "Vui lòng nhập mật địa chỉ email mới",
      please_select_an_image_to_update: "Vui lòng chọn một ảnh đại diện để update",
      update_profile_success: "Cập nhật thông tin thành công",
      update_profile_failed: "Cập nhật thông tin không thành công",
      please_login: "Vui lòng đăng nhập",
      please_input_email: "Vui lòng nhập địa chỉ email",
      please_enter_the_correct_email_format: "Vui lòng nhập đúng định dạng email",
      please_input_username: "Vui lòng nhập tên đăng nhập",
      please_input_password: "Vui lòng nhập mật khẩu",
      please_input_confirm_password: "Vui lòng xác nhận lại mật khẩu",
      password_must_greater_than_6_character: "Mật khẩu cần lớn hơn 6 ký tự",
      confirm_password_is_not_match: "Xác nhận mật khẩu không trùng khớp",
      please_input_username_and_password: "Vui lòng nhập tên đăng nhập và mật khẩu",
      please_input_email_to_receive_code: "Vui lòng nhập địa chỉ email để lấy lại mật khẩu",
      login_success: "Đăng nhập thành công",
      register_success: "Đăng ký thành công",
      username_or_email_existed: "Email đã tồn tại. Vui lòng thử lại",
      username_or_email_empty: "Tên đăng nhập hoặc email trống",
      account_blocked: "Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên",
      username_or_password_incorrect: "Email/tên đăng nhập hoặc mặt khẩu không đúng. Vui lòng thử lại!",
      send_mail_recovery_success: "Link xác nhận mật khẩu mới đã được gửi về email bạn đăng ký",
      send_sms_recovery_success: "Mã xác nhận đã được gửi về số điện thoại của bạn",
      send_mail_recovery_failed: "Không tìm thấy thông tin tài khoản với email bạn nhập",
      canot_get_user_info_in_account_facebook: "Không tìm thấy thông tin trong tài khoản facebook của bạn",
      canot_get_user_info_in_account_google: "Không tìm thấy thông tin trong tài khoản google của bạn",
      please_enter_the_correct_nickname_format: "Tên tài khoản không chứa khoảng trắng và ký tự đặc biệt",
      please_enter_the_correct_nickname_format_6_30: "Tên tài khoản nhập từ 6 đến 30 ký tự",
      please_enter_the_correct_fullname_format: "Vui lòng nhập đúng định dạng họ tên, không chứa các ký tự đặc biệt",
      please_input_fullname: "Vui lòng nhập họ tên",
      not_found_account: "Không tìm thấy thông tin tài khoản",
      password_incorrect: "Mật khẩu không đúng",
      update_email_success: "Thông tin xác nhận đã được gửi về Email mới của bạn. Vui lòng kiểm tra email để xác nhận!",
      update_email_same_current_email: "Email mới giống với email hiện tại của bạn",
      exist_account_with_this_email: "Địa chỉ email này đã tồn tại. Bạn vui lòng kiểm tra lại!",
      update_email_failed: "Cập nhật email không thành công",
      new_email_equal_current_current_email: "Email trùng với email hiện tại",
      update_avatar: "Cập nhật ảnh đại diện",
      change_password: "Thay đổi mật khẩu",
      new_password: "Mật khẩu mới",
      confirm_new_password: "Xác nhận mật khẩu"
    },
    facility:
    {
      please_select_value_for_rating: "Vui lòng chọn giá trị đánh giá",
      rating_facility_success: "Gửi đánh giá thành công",
      rating_facility_not_success: "Gửi đánh giá không thành công"
    },
    support:
    {
      send_support_success: "Gửi yêu cầu hỗ trợ thành công, chúng tôi sẽ liện hệ qua điện thoại với bạn trong thời gian sớm nhất",
      send_support_failed: "Yêu cầu của bạn chưa được gửi đi, vui lòng thử lại sau"
    },
    question:
    {
      please_input_content: "Vui lòng nhập nội dung câu hỏi",
      create_question_success: "Gửi câu hỏi thành công",
      create_question_failed: "Gửi câu hỏi không thành công"
    },
    conference:
    {
      checkin_failed: "Checkin không thành công. Vui lòng liên hệ quản trị viên để được trợ giúp",
      checkin_success: "Checkin thành công",
    }
  },
  api: {
    notification: {
      get_by_user: "notification/get-notification-by-user",
      get_detail: "notification/get-detail",
      get_detail_broadcast: "advertise/get-detail",
      set_read: "notification/set-read",
      get_unread_notification_count: "notification/get-unread-notification-count"
    },
    location:
    {
      getListCountry: 'profile/get-countries',
      getListProvince: 'province/get-all',
      getListDistrict: 'profile/get-districts',
      getListZone: 'profile/get-zone-by-district'
    },
    upload:
    {
      image: "image/upload"
    },
    user:
    {
      login: "user/login",
      login_social: "user/login-social",
      logout: "user/logout",
      register: "user/register",
      forgot_password: "user/forget-password",
      update: "user/update",
      change_password: "user/update-password",
      refresh_token: "user/refresh-token",
      change_email: "user/update-email",
      confirm_code: "user/confirm-code"
    },
    keyvalue: {
      get: "key-value/get-value",
      set: "key-value/set-value"
    },
    drug:
    {
      search: "drug/search",
      update_view_count: "drug/update-view-count"
    },
    facility:
    {
      search: "facility/search",
      update: "facility/update",
      create: "facility/create",
      search_by_query: "facility/search-by-query",
      review: 'facility/review'
    },
    disease:
    {
      search: "disease/search",
      update_view_count: "disease/update-view-count",
      get_detail: "disease/get-detail",
      search_by_disease_symptom: "disease/search-by-disease-symptom"
    },
    symptom: {
      search: "symptom/search",
    },
    specialist:
    {
      search: "specialist/search"
    }
  }
};