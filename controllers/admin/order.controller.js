
const Order = require("../../models/order.model");
module.exports.index = async (req, res) => {


    // Sử dụng Aggregation để nhóm đơn hàng theo userId và đếm số lượng
    const users = await Order.aggregate([
        {
          $group: {
            _id: "$userId",
            fullName: { $first: "$fullName" }, // Giả sử fullName không thay đổi cho mỗi userId
            totalOrders: { $sum: 1 }
          }
        },
        {
          $project: {
            userId: "$_id",
            fullName: 1,
            totalOrders: 1,
            _id: 0
          }
        }
      ]);
  
      console.log(users);
    res.render("admin/pages/orders/index", {
        pageTitle: "Order",
        users: users,
    });

}

module.exports.orderDetail = async (req, res) => {
    const userId = req.params.id;
         // Truy vấn tất cả các đơn hàng của người dùng này
    const orders = await Order.find({ userId }).lean();

    // Kiểm tra xem có đơn hàng nào không
    if (!orders.length) {
        return res.render("admin/pages/orders/order", {
            pageTitle: "Order Detail",
            userId,
            orders: [],
            message: "Not found any order",
        });
    }
    let description = [];
    let i = 0;
    for (const order of orders) {
       
        
        for(const item of order.products) {
          description[i] = `Color: ${item.color}<br>
                            Capacity: ${item.capacity}<br>
                            Repayment: ${item.repayment}<br>
                            Free-SMS: ${item.freeSMS}<br>
                            Free-Minutes: ${item.freeMinutes}<br>
                            Free-GB: ${item.freeGB}`;
          i++;
        }
    
    }   
    console.log(description);
         res.render("admin/pages/orders/order", {
        pageTitle: "Order Detail",
        orders : orders,
        description: description,
   
    });
}