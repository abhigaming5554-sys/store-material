import mongoose,
{
  Schema,
  models,
  model,
} from "mongoose";

const ReviewSchema =
  new Schema(

    {

      productId: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Product",

        required: true,

      },

      userId: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,

      },

      name: {

        type: String,

        required: true,

      },

      rating: {

        type: Number,

        required: true,

      },

      comment: {

        type: String,

        required: true,

      },

    },

    {

      timestamps: true,

    }

  );

const Review =

  models.Review ||

  model(
    "Review",
    ReviewSchema
  );

export default Review;