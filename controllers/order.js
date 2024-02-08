import Order from '../models/Order.js';

// [SECTION - ADMIN - ADDGOAL] Admin get specific order by Id
export async function getOrderById(req, res) {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({
                error: 'Not found',
                message: 'There is no order registered with that orderId'
            });
        };

        return res.status(200).send(order);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - ADMIN - ADDGOAL] Admin update order
export async function updateOrder(req,res) {
    const {id, userId, ...updates} = req.body
    try {
        const orderToUpdate = await Order.findById(req.params.orderId);
        if (!orderToUpdate) {
            return res.status(404).json({
                error: 'No file found',
                message: 'There is no order file associated with that orderId'
            });
        };

        const updateOrder = await Order.findByIdAndUpdate(req.params.orderId, updates, { new: true});

        return res.status(200).send(updateOrder);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - ADMIN - STRETCH] Retrieve all orders
export async function getAllOrders(req, res) {
    try {
        const allOrders = await Order.find({});
        if (!allOrders) {
            return res.status(204).send(false);
        };

        return res.status(200).send(allOrders)
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error')
    };
};

export default getOrderById;