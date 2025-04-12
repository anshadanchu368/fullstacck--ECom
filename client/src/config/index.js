
export const registerFormControls = [
    {
        name: 'userName',
        label: "Username",
        placeholder: "Enter your user name",
        componentType: 'input', 
        type: 'text' 
    },
    {
        name: 'email',
        label: "Email",
        placeholder: "Enter your email",
        componentType: 'input', 
        type: 'email' 
    },
    {
        name: 'password',
        label: "Password",
        placeholder: "Enter your Password",
        componentType: 'input',
        type: 'password' 
    },
];


export const loginFormControls = [

    {
        name: 'email',
        label: "Email",
        placeholder: "Enter your email",
        componentType: 'input', 
        type: 'email' 
    },
    {
        name: 'password',
        label: "Password",
        placeholder: "Enter your Password",
        componentType: 'input',
        type: 'password' 
    },
];

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
      label: "Brand",
      name: "brand",
      componentType: "select",
      options: [
        { id: "nike", label: "Nike" },
        { id: "adidas", label: "Adidas" },
        { id: "puma", label: "Puma" },
        { id: "levi", label: "Levi's" },
        { id: "zara", label: "Zara" },
        { id: "h&m", label: "H&M" },
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
  ];
  
  export const shoppingVIewHeaderMenuItems =[
    {
      id:'home',
      label:'Home',
      path:'/shop/home'
  },
    {
      id:'men',
      label:'Men',
      path:'/shop/list'
  },
    {
      id:'women',
      label:'women',
      path:'/shop/list'
  },
    {
      id:'kids',
      label:'kids',
      path:'/shop/list'
  },
    {
      id:'accessories',
      label:'Accessories',
      path:'/shop/list'
  },
    {
      id:'footwear',
      label:'Footwear',
      path:'/shop/list'
  },
]

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
};

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi",
  zara: "Zara",
  "h&m": "H&M",
};

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];