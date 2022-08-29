// Hàm lấy dữ liệu từ API về máy tính
function apiGetPeople(search) {
  return axios({
    url: "https://62f50939535c0c50e76847c3.mockapi.io/users",
    method: "GET", // GET dùng để lấy dữ liệu
    // Những giá trị được định nghĩa trong object params sẽ đc thêm vào url theo dang
    // url: ?key=value
    params: {
      account: search, // key : value
      
    },
  });
}

// Hàm request API để thêm dữ liệu vào server
function apiAddPeople(users) {
  return axios({
    url: "https://62f50939535c0c50e76847c3.mockapi.io/users",
    method: "POST", // Tạo mới vào sever
    data: users, // 'data: value' data là từ khóa  : value là giá trị dữ liệu muốn tạo mới trên sever
  });
}

// Hàm request API để xóa dữ liệu trên sever
function apiDeletePeople(userID) {
  return axios({
    url: `https://62f50939535c0c50e76847c3.mockapi.io/users/${userID}`,
    method: "DELETE",
  });
}

// Hàm lấy dữ liệu người dùng theo id để cập nhật
function apiGetPeopleByID(userID) {
  return axios({
    url: ` https://62f50939535c0c50e76847c3.mockapi.io/users/${userID}`,
    method: "GET", // GET dùng để lấy dữ liệu
  });
}

// Hàm request API để cập nhật thông tin
function apiGetPeopleByID(userID, user) {
  return axios({
    url: ` https://62f50939535c0c50e76847c3.mockapi.io/users/${userID}`,
    method: "Put",
    data: user, // user này mang những thông tin giá trị mới vừa đc người dùng thay đổi
  });
}
