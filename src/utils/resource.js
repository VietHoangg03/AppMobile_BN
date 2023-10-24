const resourceMessenger = {
  msg: {
    err: {
      notExistAccount:
        "Xin lỗi, chúng tôi không thể tìm thấy tài khoản có địa chỉ email này. Vui lòng thử lại hoặc tạo tài khoản mới.",
      wrongPassword:
        "Sai tài khoản hoặc mật khẩu. Vui lòng thử lại",
      notExistUser: "Người dùng không tồn tại.",
      generalUserMsg: "Đã xảy ra lỗi, vui lòng liên hệ chúng tôi để được giúp đỡ.",
      emailErrMsg: "Email không đúng định dạng , vui lòng thử lại.",
      emailEmptyMsg: "Bạn chưa nhập email của mình.",
      passEmptyMsg: "Bạn chưa nhập mật khẩu của mình.",
      emailExist: "Email đã tồn tại, vui lòng nhập email khác.",
      passNotDuplicatedMsg: "Mật khẩu không hợp lệ.",
      fileNotFound: "Lỗi: Không tìm thấy tệp tin.",
      generalEmpty: "Rỗng.",
      notFound: "(id): Không tìm thấy",
      missingInfo: "Thiếu thông tin.",
      duplicated1vs1: "Duplicated 1vs1.",
      dateErrMsg: "Vui lòng nhập ngày tháng năm sinh hợp lệ (MM/DD/YYYY)",
      nameMsg: "Tên chứa các ký tự không phải số.",
    },
    success: {
      register: "Đăng ký thành công.",
      login: "Đăng nhập thành công.",
      logout: "Đã đăng xuất.",
      updateInfo: "Cập nhật thông tin thành công.",
      updatePrivacy: "Cập nhật thông tin riêng tư của người dùng thành công.",
      uploadFile: "File đã được tải lên.",
      messageCreate: "Tin nhắn được gửi thành công.",
      removeMessage: "Tin nhắn đã bị xoá",
    },
  },

  regex: {
    email:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },

  number: {
    defaultMsg: 20,
    defaultConversation: 15,
    defaultUser: 20,
  },
};

module.exports = resourceMessenger;
