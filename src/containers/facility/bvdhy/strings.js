module.exports = {
    username: 'Tên tài khoản',
    email: 'Email',
    phone: 'Số điện thoại',
    fullname: 'Họ tên',
    confirm_password: 'Xác nhận mật khẩu',
    app_title: 'BVDHYHN TEST',
    login: "Đăng nhập",
    register: "Đăng ký",
    send_password: "GỬI MÃ",
    input_email: "Nhập địa chỉ email",
    input_username_or_email: 'Tên đăng nhập hoặc email',
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
    change_password: 'Thay đổi mật khẩu',
    change_email: 'Thay đổi email',
    search: 'Tìm kiếm',
    find_category: "Tìm chuyên khoa",
    find_doctor: "Tìm bác sĩ",
    share: "Chia sẻ",
    filenameSurgeryPDF: "ket_qua_giai_phau",
    filenameDiagnosticPDF: "ket_qua_chan_doan_hinh_anh",
    filenameCheckupPDF: "ket_qua_kham",
    filenameMedicalTestPDF: "ket_qua_xet_nghiem",
    filenamePDF: "ket_qua",
    profile: "Hồ sơ",
    action: {
      action_change_login_token: "ACTION_CHANGE_LOGIN_TOKEN",
      action_user_change_profile: "ACTION_USER_CHANGE_PROFILE",
      action_user_login: "ACTION_USER_LOGIN",
      action_user_logout: "ACTION_USER_LOGOUT",
      action_select_department: "ACTION_SELECT_DEPARTMENT",
      action_init_new_profile: "ACTION_INIT_NEW_PROFILE",
      action_load_booking_profile: "ACTION_LOAD_LIST_PROFILE",
      action_select_booking_specialist: "ACTION_SELECT_BOOKING_SPECIALIST",
      action_select_booking_specialist2: "ACTION_SELECT_BOOKING_SPECIALIST2",
      action_select_booking_doctor: "ACTION_SELECT_BOOKING_DOCTOR",
      action_select_booking_date: "ACTION_SELECT_BOOKING_DATE",
      action_select_booking_time: "ACTION_SELECT_BOOKING_TIME",
      action_init_booking: "ACTION_INIT_BOOKING",
      action_select_schedule: "ACTION_SELECT_SCHEDULE",
      action_add_new_booking: "ACTION_ADD_NEW_BOOKING",
      action_view_booking_detail: "ACTION_VIEW_BOOKING_DETAIL",
      action_view_booking_result: "ACTION_VIEW_BOOKING_RESULT",
      action_view_checkup_result: "ACTION_VIEW_CHECKUP_RESULT",
      action_view_diagnostic_result: "ACTION_VIEW_DIAGNOSTIC_RESULT",
      action_view_medical_test_result: "ACTION_VIEW_MEDICAL_TEST_RESULT",
      action_view_surgery_result: "ACTION_VIEW_SURGERY_RESULT",
      action_change_notification_count: "ACTION_CHANGE_NOTIFICATION_COUNT",
      action_set_pending_booking: "ACTION_SET_PENDING_BOOKING",
      action_trigger_load_list_booking: "ACTION_TRIGGER_LOAD_LIST_BOOKING",
      action_select_ehealth_tab: "ACTION_SELECT_HEALTH_TAB",
    },
    colors: {
      breakline: '#c0c0c0',
      white: 'white',
      primaryColor: '#065cb4',
      activity_background: 'white',
      actionbar_color: 'rgb(0,151,124)',
      primary_bold: '#065cb4',
      buttonOkColor: '#ff9999'
  
    },
    key: {
      storage: {
        current_account: "current_account",
        country: 'country',
        province: 'province',
        district: 'district',
        zone: 'zone',
        department: 'department',
        specialist_department: 'specialist_department',
        specialist_doctor: 'specialist_doctor',
        user_profile: 'user_profile'
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
        in_development: "Chức năng đang phát triển"
      },
      upload:
      {
        upload_image_error: "Upload ảnh không thành công"
      },
      error_occur: "Xảy ra lỗi, vui lòng thử lại sau",
      booking: {
        reason_booking: "Lý do đến khám",
        canot_view_detail_this_booking: "Không thể xem chi tiết đặt khám này",
        create_profile: "Tạo hồ sơ",
        please_select_department_first: "Vui lòng chọn chuyên khoa cần khám",
        please_select_service_first: "Vui lòng chọn chuyên khoa",
        please_select_country: "Vui lòng chọn quốc gia",
        please_select_province: "Vui lòng chọn tỉnh/thành phố",
        please_select_district: "Vui lòng chọn quận/huyện",
        please_select_zone: "Vui lòng chọn xã/phường",
        please_input_fullname: "Vui lòng nhập họ tên",
        please_input_guardian_phone_number: "Vui lòng nhập số điện thoại người bảo lãnh",
        please_input_guardian_fullname: "Vui lòng nhập họ tên người bảo lãnh",
        please_input_dob: "Vui lòng chọn ngày sinh",
        add_booking_success: "Gửi lịch thành công. Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục",
        add_booking_error: "Thêm đặt khám không thành công",
        please_input_booking_note: "Vui lòng nhập lý do đến khám",
        please_input_booking_note_less_than_150_character: "Vui lòng nhập lý do khám không quá 150 ký tự",
        not_found_schedule_of_doctor_in_this_day: "Không tìm thấy lịch khám của bác sĩ trong ngày này",
        add_booking_check_in_not_success: "Checkin không thành công",
        maximum_booking_count_in_this_time: "Đã quá số lượt đặt khám tối đa cho khung giờ này",
        cannot_booking_in_this_time: "Đã quá thời gian đặt khám cho khung giờ này",
        not_allow_booking_in_this_time: "Không có lịch của bác sĩ trong thời gian này",
        please_enter_the_correct_guardian_fullname_format: "Vui lòng nhập đúng định dạng họ tên người bảo lãnh, không chứa các ký tự đặc biệt",
        please_enter_the_correct_fullname_format: "Vui lòng nhập đúng định dạng họ tên, không chứa các ký tự đặc biệt",
        please_enter_the_correct_phone_number_format: "Vui lòng nhập đúng định dạng số điện thoại",
        please_enter_the_correct_guardian_phone_number_format: "Vui lòng nhập đúng định dạng số điện thoại người bảo lãnh",
        please_input_phone_number: "Vui lòng nhập số điện thoại",
        exist_booking_not_payment: "Tồn tại đặt khám chưa thanh toán",
        cancel_booking_success: "Hủy lịch khám thành công",
        cancel_booking_error: "Hủy lịch khám không thành công"
  
      },
      user:
      {
        please_login_on_web_to_management: "Để sử dụng tài khoản vui lòng đăng nhập trên website!",
        please_input_current_password: "Vui lòng nhập mật khẩu hiện tại",
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
        username_or_email_existed: "Email hoặc tên đăng nhập đã tồn tại. Vui lòng thử lại",
        username_or_email_empty: "Tên đăng nhập hoặc email trống",
        account_blocked: "Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên",
        username_or_password_incorrect: "Email/tên đăng nhập hoặc mặt khẩu không đúng. Vui lòng thử lại!",
        send_mail_recovery_success: "Mật khẩu mới của bạn đã được gửi về email bạn đăng ký. Vui lòng kiểm tra lại",
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
      ehealth:
      {
        not_found_result: "Không tìm thấy kết quả của mục này",
        not_found_result_of_this_booking: "Chưa có kết quả",
        exist_profile: "Người dùng này đã tồn tại một profile",
        create_profile_success: "Tạo mới hồ sơ thành công",
        select_date_to_view_schedule: "Chọn một ngày để xem lịch làm việc của bác sĩ"
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
      booking: {
        create: "booking/create",
        cancel: "booking/delete",
        get_by_doctor_and_date: "booking/get-by-doctor-specialist-department",
        get_by_user: "booking/get-by-current-user",
        get_list_patient_history_by_user: "booking/get-list-patient-history-by-profile",
        get_detail_patient_history: "booking/get-detail-patient-history",
        get_result_patient_history: "booking/get-result-patient-history",
        get_detail: "booking/get-detail"
      },
      booking_profile: {
        create: "profile/create",
        getProfiles: "profile/get-by-user"
      },
      booking_schedule: {
        get_by_doctor_specialist_department: "schedule/get-by-doctor-specialist-department"
      },
      booking_specialist: {
        get_by_doctor_department: "specialist/get-by-department-doctor"
  
      },
      booking_doctor: {
        get_by_specialist_department: "doctor/get-by-department-specialist",
      },
      department: {
        getList: "department/get-all"
      },
      profile: {
        create:"profile/create",
        update :"profile/update",                // -- profile/update/{id}
        get_profile: "profile/get-by-user",      // -- profile/get-by-user/{userId}
        get_detail_profile:"profile/get-detail"  // -- profile/get-detail/{id}
      },
      location: {
        getListCountry: 'country/get-by-hospital',
        getListProvince: 'province/get-by-hospital',
        getListDistrict: 'district/get-by-hospital',
        getListZone: 'zone/get-by-district-hospital'
      },
      upload: {
        image: "image/upload"
      },
      user: {
        login_social: 'user/login-social',
        login: "user/login",
        logout: "user/logout",
        register: "user/register",
        forgotPassword: "user/forgot-password",
        update: "user/update",
        changePassword: "user/change-password",
        refreshToken: "user/refresh-token",
        changeEmail: "user/update-email"
      },
      specialist: {
        get_all:'specialist/get-all'
      }
    }
  };