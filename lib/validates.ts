import * as yup from "yup";

export const movieSchema = yup.object({
  name: yup
    .string()
    .required("Tên phim không được để trống")
    .max(200, "Tên phim quá dài"),
  subname: yup.string().max(200, "Tên phụ quá dài").nullable(),
  releaseYear: yup
    .number()
    .typeError("Năm phải là số")
    .required("Năm phát hành không được để trống")
    .integer("Năm phải là số nguyên")
    .min(1800, "Năm phát hành không hợp lệ")
    .max(new Date().getFullYear() + 10, "Năm không quá xa trong tương lai"),
  duration: yup
    .number()
    .typeError("Thời lượng phải là số")
    .nullable()
    .positive("Thời lượng phải lớn hơn 0")
    .integer("Thời lượng phải là số nguyên"),
  country: yup.string().nullable(),
  poster: yup.string().url("URL poster không hợp lệ").nullable(),
  coverImage: yup.string().url("URL ảnh bìa không hợp lệ").nullable(),
  genres: yup
    .array()
    .of(yup.string().required())
    .label("Thể loại")
    .min(0)
    .nullable(),
  status: yup
    .string()
    .oneOf(
      ["now_showing", "coming_soon", "released"],
      "Trạng thái không hợp lệ"
    )
    .required("Trạng thái phim không được để trống"),
  description: yup.string().nullable(),
});

export const cinemaSchema = yup.object({
  name: yup
    .string()
    .required("Tên rạp không được để trống")
    .max(150, "Tên rạp quá dài (tối đa 150 ký tự)"),
  address: yup
    .string()
    .required("Địa chỉ không được để trống")
    .max(255, "Địa chỉ quá dài (tối đa 255 ký tự)"),
  city: yup
    .string()
    .required("Thành phố không được để trống")
    .max(100, "Tên thành phố quá dài (tối đa 100 ký tự)"),
  lat: yup
    .number()
    .typeError("Vĩ độ phải là một số")
    .required("Vĩ độ không được để trống")
    .min(-90, "Vĩ độ phải nằm trong khoảng -90 đến 90")
    .max(90, "Vĩ độ phải nằm trong khoảng -90 đến 90")
    .label("Vĩ độ"),
  lon: yup
    .number()
    .typeError("Kinh độ phải là một số")
    .required("Kinh độ không được để trống")
    .min(-180, "Kinh độ phải nằm trong khoảng -180 đến 180")
    .max(180, "Kinh độ phải nằm trong khoảng -180 đến 180")
    .label("Kinh độ"),
});
