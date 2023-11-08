const { createOrderSer } = require("../services/userServices");

const createOrder = async (req, res) => {
  try {
    console.log("inside the createOrderSer controller--->");
    const data = await createOrderSer(req);
    return res.status(data.status).json(data);
  } catch (error) {
    console.log("inside the createUserSer Error--->", error.message);
    return res.status(error.status).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
};
