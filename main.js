let phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
let i = -1;
let arr = [];
let arr_dis = [];
let arr_ward = [];
let prov = "",
  dist = "",
  ward = "";
let arr_obj = [];
const postApi = "https://provinces.open-api.vn/api/?depth=3";
fetch(postApi)
  .then((response) => response.json())
  .then((json) => {
    arr = json;
    $("#exampleFormControlSelect1").append(
      "<option selected disabled hidden></option>"
    );
    json.forEach((value, index) => {
      $("#exampleFormControlSelect1").append(
        "<option value=" + index + ">" + value.name + "</option>"
      );
    });
    return json;
  });

function changed_Province(item) {
  $("#exampleFormControlSelect2").empty();
  $("#exampleFormControlSelect3").empty();
  $("#exampleFormControlSelect2").append(
    "<option selected disabled hidden></option>"
  );
  $("#exampleFormControlSelect2").prop("disabled", false);
  $("#exampleFormControlSelect2")[0].style.cursor = "pointer";
  $("#exampleFormControlSelect3")[0].style.cursor = "no-drop";
  $("#exampleFormControlSelect3").prop("disabled", true);
  prov = $("#exampleFormControlSelect1").val();
  $("#addr").val(arr[prov].name);
  arr_dis = arr[item.value].districts;
  arr_dis.forEach((value, index) => {
    $("#exampleFormControlSelect2").append(
      '<option value="' + index + '">' + value.name + "</option>"
    );
  });
}
function changed_District(item) {
  $("#exampleFormControlSelect3").empty();
  $("#exampleFormControlSelect3").append(
    "<option selected disabled hidden></option>"
  );
  $("#exampleFormControlSelect3").prop("disabled", false);
  $("#exampleFormControlSelect3")[0].style.cursor = "pointer";
  prov = $("#exampleFormControlSelect1").val();
  dist = $("#exampleFormControlSelect2").val();
  $("#addr").val(arr[prov].name + ", " + arr_dis[dist].name);
  arr_ward = arr_dis[item.value].wards;
  arr_ward.forEach((value, index) => {
    $("#exampleFormControlSelect3").append(
      '<option value="' + index + '">' + value.name + "</option>"
    );
  });
}

function changed_Ward(item) {
  prov = $("#exampleFormControlSelect1").val();
  dist = $("#exampleFormControlSelect2").val();
  ward = $("#exampleFormControlSelect3").val();
  $("#addr").val(
    arr[prov].name + ", " + arr_dis[dist].name + ", " + arr_ward[ward].name
  );
}

function add_to_list() {
  let name = $("#name").val(),
    phone = $("#phone").val(),
    addr = $("#addr").val(),
    full_addr = $("#full-addr").val(),
    prov = $("#exampleFormControlSelect1").val(),
    dist = $("#exampleFormControlSelect2").val(),
    ward = $("#exampleFormControlSelect3").val();
  defau = 0;
  if (name && phone.match(phoneno) && ward && full_addr) {
    var content = {
      name,
      phone,
      prov,
      dist,
      ward,
      addr,
      full_addr,
      defau,
    };
    if (i != -1) {
      arr_obj[i].name = name;
      arr_obj[i].phone = phone;
      arr_obj[i].addr = addr;
      arr_obj[i].prov = prov;
      arr_obj[i].dist = dist;
      arr_obj[i].ward = ward;
      arr_obj[i].full_addr = full_addr;
      i = -1;
    } else arr_obj.push(content);
    localStorage.setItem("address", JSON.stringify(arr_obj));
    show_list(arr_obj);
    $("#information").modal("hide");
  } else {
    alert("Vui lòng nhập đầy đủ thông tin!!!");
  }
}
function show_list(arr_obj) {
  $(".list").empty();
  if (arr_obj.length == 0)
    $('<h5 class="mt-5 text-center">Bạn chưa có địa chỉ</h5>').appendTo(
      ".in4 > ul"
    );
  arr_obj.forEach((item, index) => {
    var cont =
      '<div class="col-9">   <div class="col-9"> <div class="row"><div class="col-4"> <p class="text-right text-secondary">Họ và tên</p> </div> <div class="col-8"> <span>' +
      item.name +
      '</span> <span class="badge badge-success">Mặc định</span>    </div> </div> <div class="row"> <div class="col-4"> <p class="text-right text-secondary">Số điện thoại</p> </div> <div class="col-8"> <p>' +
      item.phone +
      '</p> </div> </div> <div class="row"> <div class="col-4"> <p class="text-right text-secondary">Địa chỉ</p> </div> <div class="col-8"> <p>' +
      item.full_addr +
      "</p> <p>" +
      item.addr +
      '</p> </div> </div> </div> </div> <div class="col-3 "> <div class="py-4"> <button type="button" class="btn btn-outline-secondary small-s ml-3"  data-toggle="modal" data-target="#information" onclick= "edit(' +
      index +
      ')">Sửa</button> <button type="button" class="btn btn-outline-secondary small-s float-right" onclick= "remove(' +
      index +
      ')">Xóa</button> </div> <button type="button" class="btn btn-outline-secondary small-s ml-2 styl" onclick= "defaults(' +
      index +
      ')">Đặt làm mặc định</button> </div>';
    $(
      "<li class = 'row mb-3 border-bot li_num_" + index + "'>" + cont
    ).appendTo(".in4 > ul");

    setTimeout(function () {
      $(".li_num_" + index)[0].style.display = "flex";
    }, 100);
    if (arr_obj.length == 1) item.defau = 1;
    if (item.defau) {
      $(".badge")[index].style.display = "inline-block";
      $(".styl")[index].style.cursor = "no-drop";
    } else {
      $(".badge")[index].style.display = "none";
      $(".styl")[index].style.cursor = "pointer";
    }
  });
}
function edit(index) {
  $("#name").val(arr_obj[index].name);
  $("#phone").val(arr_obj[index].phone);
  $("#exampleFormControlSelect1").val(arr_obj[index].prov);
  $("#exampleFormControlSelect1").change();
  $("#exampleFormControlSelect2").val(arr_obj[index].dist);
  $("#exampleFormControlSelect2").change();
  $("#exampleFormControlSelect3").val(arr_obj[index].ward);
  $("#exampleFormControlSelect3").change();
  $("#addr").val(arr_obj[index].addr);
  $("#full-addr").val(arr_obj[index].full_addr);
  i = index;
}
function remove(index) {
  if (confirm("Are you sure you want to delete this data?")) {
    arr_obj.splice(index, 1);
    localStorage.setItem("address", JSON.stringify(arr_obj));
    show_list(arr_obj);
  }
}
function out() {
  i = -1;
}
function defaults(index) {
  if (confirm("Are you sure you want to set defaults this data?")) {
    arr_obj.forEach((item, position) => {
      if (position != index) item.defau = 0;
      else item.defau = 1;
    });
    localStorage.setItem("address", JSON.stringify(arr_obj));
    show_list(arr_obj);
  }
}

$(document).ready(function () {
  arr_obj = JSON.parse(localStorage.getItem("address")) || [];
  show_list(arr_obj);
});
