exports.signUpOTP = async ({ email, code }) => {
     let msg = `Your OTP for Account Registration : ${code}. Do not share the Credentials for security reasons.`;
     // return smtp.email(email, { body: msg });
};

exports.forgotPasswordOTP = async ({ email, code }) => {
     let msg = `Your forgot password otp is ${code}. Do not share the Credentials for security reasons.`;
     // return smtp.email(email, { body: msg });
};

exports.resendOTP = async ({ email, code }) => {
     let msg = `Your new otp is ${code}. Do not share the Credentials for security reasons.`;
     // return smtp.email(email, { body: msg });
};
