import nodemailer from "nodemailer";
import { app, client } from "../index.js";

export function managerSignUp() {
    app.post("/managerSignUp", async function (request, response) {
        const { email } = await request.body;
        const oldUserData = await client
            .db("CRM")
            .collection("Manager Data")
            .findOne({ email: email });
        if (oldUserData) {
            response
                .status(401)
                .send({ message: "Invalid Credentials try any other email" });
        } else if (email != "") {
            let randomNum = Math.random() * 100000;
            let otp = Math.floor(randomNum);
            const result = await client.db("CRM").collection("Manager OTP").insertOne({
                email: email,
                otp: otp,
            });
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "selvamdev6994@gmail.com",
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            let info = {
                from: "selvamdev6994@gmail.com",
                to: email,
                subject: "Welcome to CRM app",
                text: "Hi there! Your one time password is " + otp,
            };
            transporter.sendMail(info, (err) => {
                if (err) {
                    console.log("error", err);
                } else {
                    console.log("email sent successfully");
                    response.status(201).send({ message: "email sent successfully" });
                }
            });

            let findOtp = await client.db("CRM").collection("Manager OTP").findOne({
                email: email,
                otp: otp,
            });
            if (findOtp) {
                setTimeout(async () => {
                    const deleteOTP = await client
                        .db("CRM")
                        .collection("Manager OTP")
                        .deleteOne({
                            email: email,
                            otp: otp,
                        });
                }, 60000);
            }
        } else {
            response.send({ message: "enter valid email" });
        }
    });
}
