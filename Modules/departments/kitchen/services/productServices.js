const mongoose = require("mongoose");
const productDB = require("../../../../Models/kitchen/product");

const createProductSer = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { mealType, name, image, basePrice, tasteOptions } = req.body;
      console.log("L-8, createUserSer--------------->", req.body);
      let product = await productDB.findOne({ name: name });
      if (product) {
        return reject({
          status: 400,
          message: "product already exist !!",
          data: {},
        });
      } else if (!product) {
        let newObj = {
          mealType: mealType,
          name: name,
          image: image,
          basePrice: basePrice,
          tasteOptions: tasteOptions,
        };
        console.log(
          "L-30, -----------------else if / createOrderSer--------------->",
          newObj
        );
        const savedProduct = await productDB.create(newObj);
        if (!savedProduct) {
          return reject({
            status: 500,
            message:
              "something went wrong :  product creation failed, Please try again later ",
            data: {},
          });
        }
        if (savedProduct) {
          return resolve({
            status: 201,
            message: "Successfully product created",
            data: savedProduct,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
      return reject({
        status: 500,
        message: "Something went wrong",
        data: {},
      });
    }
  });
};
const updateProductSer = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { productId, mealType, name, image, basePrice, tasteOptions } = req.body;
      console.log("L-60 createUserSer--------------->", req.body);
      let product = await productDB.findOne({ _id: productId });
      if (product || product.length >= 0) {
        let newObj = {
          mealType: mealType || product.mealType,
          name: name || product.name,
          image: image || product.image,
          basePrice: basePrice || product.basePrice,
          tasteOptions: tasteOptions || product.tasteOptions
        };
        console.log("L-77, -----------------else if / createOrderSer--------------->", newObj);
        const savedProduct = await productDB.findOneAndUpdate({ _id: productId }, newObj);
        if (!savedProduct) {
          return reject({
            status: 500,
            message:
              "something went wrong :  product updation failed, Please try again later ",
            data: {},
          });
        };
        if (savedProduct) {
          return resolve({
            status: 200,
            message: "Successfully product updated",
            data: savedProduct,
          });
        }
      } else {
        return reject({
          status: 400,
          message: "product doesn't exist, Kindly create new one",
          data: {},
        });
      }
    } catch (error) {
      console.log(error.message);
      return reject({
        status: 500,
        message: "Something went wrong",
        data: {},
      });
    }
  });
};
const fetchProductSer = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("L-60 createUserSer--------------->", req.body);
      let { mealType } = req.body;
      if (mealType) {
        let products = await productDB.find({ mealType: mealType }).lean();
        console.log("L-111 products--->", products)
        if (products || products.length > 0) {
          return resolve({
            status: 200,
            count: products.length,
            message: `successfully fetched ${mealType}`,
            data: {
              productList: products
            }
          });
        } else {
          return resolve({
            status: 400,
            message: `There is no data in this category ${mealType}`,
            data: {
              productList: products
            }
          });
        }
      } else {
        return resolve({
          status: 400,
          message: `Sorry for Inconvenience, Please try again later`,
          data: {}
        });
      };
    } catch (error) {
      console.log(error.message);
      return reject({
        status: 500,
        message: "Something went wrong",
        data: {},
      });
    }
  });
};

module.exports = {
  createProductSer,
  updateProductSer,
  fetchProductSer
};
