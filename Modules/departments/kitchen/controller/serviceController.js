const {
  createProductSer,
  updateProductSer,
  fetchProductSer
} = require("../services/productServices");

const createProduct = async (req, res) => {
  try {
    console.log("inside the createOrderSer controller--->");
    const data = await createProductSer(req);
    return res.status(data.status).json(data);
  } catch (error) {
    console.log("inside the createUserSer Error--->", error.message);
    return res.status(error.status).json({ error: error.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    console.log("inside the updateProduct controller--->");
    const data = await updateProductSer(req);
    return res.status(data.status).json(data);
  } catch (error) {
    console.log("inside the updateProduct Error--->", error.message);
    return res.status(error.status).json({ error: error.message });
  }
};
const fetchProduct = async (req, res) => {
  try {
    console.log("inside the fetchProduct controller--->");
    const data = await fetchProductSer(req);
    return res.status(data.status).json(data);
  } catch (error) {
    console.log("inside the fetchProduct Error--->", error.message);
    return res.status(error.status).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  fetchProduct
};
