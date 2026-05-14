import mongoose,
{
  Schema,
  models,
  model,
} from "mongoose";

const OrderSchema =
  new Schema(

    {

      userId: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,

      },

      productId: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Product",

        required: true,

      },

      title: {

        type: String,

        required: true,

      },

      price: {

        type: Number,

        required: true,

      },

      fileUrl: {

        type: String,

        required: true,

      },

      paymentId: {

        type: String,

        required: true,

      },

      // Secure Download Token
      downloadToken: {

        type: String,

      },

    },

    {

      timestamps: true,

    }

  );

const Order =

  models.Order ||

  model(
    "Order",
    OrderSchema
  );

export default Order;