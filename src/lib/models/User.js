import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    gender: String,
    phoneNumber: String,
    country: String,
    profilePicture: String, // Store as URL or Base64
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
