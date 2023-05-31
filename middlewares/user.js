const { isValidObjectId } = require("mongoose");
const PasswordResetToken = require("../models/passwordResetToken");
const {sendError} = require("../utils/helper")

exports.isValidPassResetToken = async (req, res, next) => {
    const {token, userId} = req.body;

    if(!token.trim() || !isValidObjectId(userId)) return sendError(res, "Invalid request");

    const resetToken = await PasswordResetToken.findOne({owner: userId})
    if(!resetToken) return sendError(res, "Invalid request");

    const isMatchedToken = await resetToken.compareToken(token);
    if(!isMatchedToken) return sendError(res,"please submit a valid token!!");

    req.resetToken = resetToken;
    next();
}