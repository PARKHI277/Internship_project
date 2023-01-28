const { Schema, model, Types } = require("mongoose");

const followersSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    followers: {
      type: [Types.ObjectId],
      default: null,
    },
    following: {
      type: [Types.ObjectId],
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("followers", followersSchema);
