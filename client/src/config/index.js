export const registerFormControls = [
  {
    name: "userName",
    label: "Username",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your Password",
    componentType: "input",
    type: "password",
  },
]

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your Password",
    componentType: "input",
    type: "password",
  },
]

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Apparel Type",
    name: "apparel",
    componentType: "select",
    options: [
      { id: "full-sleeve", label: "Full Sleeve T-shirts" },
      { id: "five-sleeve", label: "Five Sleeve T-shirts" },
      { id: "hoodies", label: "Hoodies" },
      { id: "jogger", label: "Jogger Jeans" },
      { id: "jersey", label: "Jersey" },
      { id: "casual", label: "Casual Wear" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
]

export const shoppingVIewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/list",
  },
  {
    id: "men",
    label: "Men",
    path: "/shop/list",
  },
  {
    id: "women",
    label: "women",
    path: "/shop/list",
  },
  {
    id: "kids",
    label: "kids",
    path: "/shop/list",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/list",
  },
  {
    id: "footwear",
    label: "Footwear",
    path: "/shop/list",
  },
]

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
}

export const apparelOptionsMap = {
  "full-sleeve": "Full Sleeve T-shirts",
  "five-sleeve": "Five Sleeve T-shirts",
  hoodies: "Hoodies",
  jogger: "Jogger Jeans",
  jersey: "Jersey",
  casual: "Casual Wear",
}

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
  ],
  apparel: [
    { id: "full-sleeve", label: "Full Sleeve T-shirts" },
    { id: "five-sleeve", label: "Five Sleeve T-shirts" },
    { id: "hoodies", label: "Hoodies" },
    { id: "jogger", label: "Jogger Jeans" },
    { id: "jersey", label: "Jersey" },
    { id: "casual", label: "Casual Wear" },
  ],
}

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
]

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
]


