// mảng chứa object
let users1 = [];


// tạo object contructor People
function User(
  id,
  account,
  passWord,
  name,
  email,
  image,
  type,
  language,
  description
) {
  this.id = id;
  this.account = account;
  this.passWord = passWord;
  this.name = name;
  this.email = email;
  this.image = image;
  this.type = type;
  this.language = language;
  this.description = description;
}

//Hàm DOM
function DOM(selector) {
  return document.querySelector(selector);
}

// function lấy thông tin dữ liệu người dùng từ phía API và trả về dưới trình duyệt
getPeople();
function getPeople(search) {
  apiGetPeople(search)
    .then((response) => {
      // duyệt qua danh sách people lấy từ api và tạo mới lại 1 danh sách People
      let users = response.data.map((user) => {
        return new User(
          user.id,
          user.account,
          user.passWord,
          user.name,
          user.email,
          user.image,
          user.type,
          user.language,
          user.description
        );
      });
      // push dữ liệu vào mảng global users để kiểm tra trùng validdation ở dòng 272
      users1 = [...users];
      console.log(users1);
      display(users);
    })
    .catch((error) => {
      console.log(error);
    });
}

//Hàm dùng để lấy thông tin ng dùng nhập vào & request API để thêm dữ liệu người dùng vào kho dữ liệu trên sever
function addPeople(users) {
  //kiểm tra nếu ng dùng nhập chưa đúng thì return thoát chương trình ko cần chạy típ phần lấy thông tin bên dưới
  let valForm = validForm();
  if (!valForm) {
    return false;
  }

  // dùng peoples để request API để thêm người dùng vào sever
  apiAddPeople(users)
    .then(() => {
      //NOTE: dữ liệu đc thêm chỉ mới tồn tại ở sever
      // Ta cần gọi lại apiGetPeople để lấy dữ liệu mới đc thêm về , khi lấy về dữ liệu ở dạng JSON.parse , nó chỉ đơn thuần là 1 object bình thường , nếu ta muốn object sử dụng đc các phương thức thì ta phải new nó thành 1 object peoples mới thì mới có thể sử dụng đc và ta đã làm những việc đó ở hàm "getPeople" nên ta chỉ việc gọi hàm này là đc
      getPeople();
    })
    .catch((error) => {
      console.log(error);
    });
}

//======Hàm xóa người dùng
function deletePeople(userID) {
  apiDeletePeople(userID)
    .then(() => {
      // vì khi xóa chỉ thực hiện ở trên sever nên ta cần phải làm lại thao tác lấy lại dự liệu từ sever và hiển thị lại trên trình duyệt bằng cách ta gọi lại hàm getPeople()
      getPeople();
    })
    .catch((error) => {
      console.log(error);
    });
}

//======== Hàm cập nhật thông tin người dùng
function updateUser(userID, user) {
  apiGetPeopleByID(userID, user).then(() => {
    // sau khi thay đổi trên server ta cần gọi request API để lấy dữ liệu và hiển thị ra trình duyệt
    getPeople();
  });
}

// ==== Hàm hiển thị ra trình duyệt
function display(peoples) {
  let display = peoples.reduce((result, people, index) => {
    return (
      result +
      `
        <tr>
        <td>${index + 1}</td>
        <td>${people.account}</td>
        <td>${people.passWord}</td>
        <td>${people.name}</td>
        <td>${people.email}</td>
        <td><img src="${people.image}" width="50px" height="50px"> </td>
        <td>${people.type}</td>
        <td>${people.language}</td>
        <td>${people.description}</td>   
        <td>
        <button class="btn btn-primary" data-id="${people.id}" data-type="Edit"
          data-target="#myModal"
          data-toggle="modal">Edit</button> 
          </td>
        <td>
        <button class="btn btn-danger" data-id="${
          people.id
        }" data-type="delete">Delete</button>
        </td>
        </tr>
        `
    );
  }, "");
  DOM("#tblDanhSachNguoiDung").innerHTML = display;
}

// === Hàm reset form
function resetForm() {
  DOM("#TaiKhoan").value = "";
  DOM("#HoTen").value = "";
  DOM("#MatKhau").value = "";
  DOM("#Email").value = "";
  DOM("#HinhAnh").value = "";
  DOM("#loaiNguoiDung").value = "0";
  DOM("#loaiNgonNgu").value = "0";
  DOM("#MoTa").value = "";
}

//========= DOM & Dùng cú pháp 'EventListener'  ==============
DOM("#btnThemNguoiDung").addEventListener("click", () => {
  // khi nhấn vào nút thêm mới  thì sẽ thay đổi phần header
  DOM(".modal-title").innerHTML = "Thêm Người Dùng";

  //khi nhấn vào nút thêm mới  thì sẽ thay đổi phần footer
  DOM(".modal-footer").innerHTML = `
  <button class="btn btn-success" data-type="add">Thêm</button>
    <button class="btn btn-danger" data-dismiss="modal">Đóng</button>
    `;

  //resetForm
  resetForm();
});

//lợi dụng sự kiện 'EventBubbling'để lắng nghe sự kiện 'click' vào nút "Thêm" ở thẻ có class là modal-footer ( ta gọi là event delegation)
DOM(".modal-footer").addEventListener("click", (evt) => {
  // console.log(evt.target); kiểm tra thẻ gốc phát sinh ra sự kiện dùng (evt.target)
  // tạo 1 biến để lấy giá trị thuộc tính từ btn Thêm
  let ELtype = evt.target.getAttribute("data-type");

  // DOM để lấy thông tin từ phía người dùng nhập vào
  let id = DOM("#maUser").value;
  let account = DOM("#TaiKhoan").value;
  let name = DOM("#HoTen").value;
  let passWord = DOM("#MatKhau").value;
  let email = DOM("#Email").value;
  let image = DOM("#HinhAnh").value;
  let type = DOM("#loaiNguoiDung").value;
  let language = DOM("#loaiNgonNgu").value;
  let description = DOM("#MoTa").value;

  // kiểm tra valid nếu ko đúng thì ngừng mảng
  let valForm = validForm();
  if (!valForm) {
    return false;
  }

  // khởi tạo mảng đối tượng mới từ object dectructor People
  let users = new User(
    null,
    account,
    passWord,
    name,
    email,
    image,
    type,
    language,
    description
  );

  if (ELtype === "add") {
    // nếu sự kiện click đúng vào thẻ button Thêm thì ta sẽ thực hiện hành động thêm người dùng
    addPeople(users);
  } else if (ELtype === "Edit") {
    updateUser(id, users);
  }
});

// DOM tới thẻ cha của nút delete/Edit ở Tbody
DOM("#tblDanhSachNguoiDung").addEventListener("click", (evt) => {
  let peopleId = evt.target.getAttribute("data-id");
  let Deltype = evt.target.getAttribute("data-type");
  if (Deltype === "delete") {
    deletePeople(peopleId);
  } else if (Deltype === "Edit") {
    //khi bấm vào nút edit thì sẽ hiện ra bảng điền thông tin và thay đổi phần header & footer trong đó

    // khi nhấn vào nút Edit thì sẽ thay đổi phần header
    DOM(".modal-title").innerHTML = "Cập nhật thông tin người dùng";

    //khi nhấn vào nút Edit  thì sẽ thay đổi phần footer
    DOM(".modal-footer").innerHTML = `
  <button class="btn btn-success" data-type="Edit">Cập Nhật</button>
    <button class="btn btn-danger" data-dismiss="modal">Hủy</button>
    `;

    // Lấy thông tin người dùng điền ngược vào bảng cập nhật bằng cách request API và trả về dữ liệu của 1 người dùng duy nhất để fill ngược lên
    apiGetPeopleByID(peopleId)
      .then((response) => {
        let user = response.data;
        //lấy chi tiết object fill ngược lên ô inputs
        DOM("#maUser").value = user.id; // ô input ẩn
        DOM("#TaiKhoan").value = user.account;
        DOM("#HoTen").value = user.name;
        DOM("#MatKhau").value = user.passWord;
        DOM("#Email").value = user.email;
        DOM("#HinhAnh").value = user.image;
        DOM("#loaiNguoiDung").value = user.type;
        DOM("#loaiNgonNgu").value = user.language;
        DOM("#MoTa").value = user.description;
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

// lắng nghe sự kiện keydown của ô input search
DOM("#search").addEventListener("keydown", (evt) => {
  // console.log(evt.key);

  // kiểm tra nếu không phải kí tự "Enter" => kết thúc hàm ko làm gì cả
  if (evt.key !== "Enter") return;

  getPeople(evt.target.value);
});

// ========== VALIDATION ====================================================
// Hàm kiểm tra userName
function validUserName() {
  let valUserName = DOM("#TaiKhoan").value;
  let spanUserName = DOM("#valUserName");

  // ko đc để trống
  if (valUserName === "") {
    spanUserName.innerHTML = "UserName không đc để trống";
    return false;
  }

  // không được trùng
  for (let i = 0; i < users1.length; i++) {
    if (valUserName === users1[i].account) {
      spanUserName.innerHTML = "UserName đã có người sử dụng";
      return false;
    } else {
      spanUserName.innerHTML = "";
      return true;
    }
  }

  // // nếu đúng hết yêu cầu thì ko hiện ra thông báo
  // spanUserName.innerHTML = "";
  // return true;
}

// ==== Hàm kiểm tra tên người dùng
function validName() {
  let valName = DOM("#HoTen").value;
  let spanName = DOM("#valName");

  // kiểm tra rỗng
  if (valName === "") {
    spanName.innerHTML = "Họ và tên không được để trống";
    return false;
  }

  //Kiểm tra định dạng :không chứa số và ký tự đặc biệt ( chỉ có chữ cái )
  let reGex = /^[^\d]+$/;
  if (!reGex.test(valName)) {
    spanName.innerHTML = "Họ và tên không được điền số và có kí tự đặc biệt";
    return false;
  }

  // nếu đúng valid thì ko hiện thông báo
  spanName.innerHTML = "";
  return true;
}

// ===== Hàm kiểm tra passWork
function validPassWork() {
  let valPassWork = DOM("#MatKhau").value;
  let spanPassWork = DOM("#valPassWord");

  // kiểm tra input rỗng
  if (valPassWork === "") {
    spanPassWork.innerHTML = "Mật khẩu không đc để trống";
    return false;
  }

  // kiểm tra độ dài 6-8 kí tự
  if (valPassWork.length < 6 || valPassWork.length > 8) {
    spanPassWork.innerHTML = "Mật khẩu ít nhất 6 kí tự và dài nhất 8 kí tự";
    return false;
  }

  // kiểm tra định dạng : (có ít nhất 1 ký tự hoa, 1 ký tự đặc biệt, 1 ký tự số, độ dài 6-8)
  let reGex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,8}$/;
  if (!reGex.test(valPassWork)) {
    spanPassWork.innerHTML =
      "Mật khẩu phải có ít nhất 1 ký tự hoa, 1 ký tự đặc biệt, 1 ký tự số";
    return false;
  }

  // đúng định dạng thì ko hiện thông báo
  spanPassWork.innerHTML = "";
  return true;
}

// == Hàm kiểm tra Email
function validEmail() {
  let valEmail = DOM("#Email").value;
  let spanEmail = DOM("#valEmail");

  // kiểm tra input rỗng
  if (valEmail === "") {
    spanEmail.innerHTML = "Email không được bỏ trống";
    return false;
  }

  // kiểm tra định dạng email:
  let reGex = /^[\w-\.,';]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!reGex.test(valEmail)) {
    spanEmail.innerHTML = "Email không đúng định dạng";
    return false;
  }

  // đúng định dạng thì ko hiện thông báo
  spanEmail.innerHTML = "";
  return true;
}

// === Hàm kiểm tra hình ảnh
function validImage() {
  let valImage = DOM("#HinhAnh").value;
  let spanImage = DOM("#valImage");

  // kiểm tra rỗng
  if (valImage === "") {
    spanImage.innerHTML = " Hình ảnh không đc bỏ trống";
    return false;
  }
  // đúng định dạng thì ko hiện thông báo
  spanImage.innerHTML = "";
  return true;
}

// == Hàm kiểm tra loại ng dùng
function validType() {
  let valType = DOM("#loaiNguoiDung").value;
  let spanType = DOM("#valType");

  //kiểm tra nếu ko chọn
  if (valType === "0") {
    spanType.innerHTML = "Vui lòng chọn người dùng";
    return false;
  }
  // đúng định dạng thì ko hiện thông báo
  spanType.innerHTML = "";
  return true;
}

// == Hàm kiểm tra ngôn ngữ
function validLanguage() {
  let valLanguage = DOM("#loaiNgonNgu").value;
  let spanLanguage = DOM("#valLanguage");

  //kiểm tra nếu ko chọn
  if (valLanguage === "0") {
    spanLanguage.innerHTML = "Vui lòng chọn loại ngôn ngữ";
    return false;
  }
  // đúng định dạng thì ko hiện thông báo
  spanLanguage.innerHTML = "";
  return true;
}

// == Hàm kiểm tra description
function validDescription() {
  let valDescription = DOM("#MoTa").value;
  let spanDescription = DOM("#valDescription");

  //kiểm tra độ dài ko vượt quá 60 ký tự
  if (valDescription.length > 60) {
    spanDescription.innerHTML = "Mô tả không vượt quá 60 ký tự";
    return false;
  }
  // đúng định dạng thì ko hiện thông báo
  spanDescription.innerHTML = "";
  return true;
}

// ===== hàm validForm
function validForm() {
  let valForm =
    validUserName() &
    validName() &
    validPassWork() &
    validEmail() &
    validImage() &
    validType() &
    validLanguage() &
    validDescription();

  // nếu có 1 hoặc nhiều thông tin sai thì return về false
  if (!valForm) {
    return false;
  }

  // nếu đúng hết thì return true
  return true;
}
