import nodemailer from "nodemailer"

export default async function sendVerificationEmail({name, email, link}: {name: string, email: string, link: string}){
    const mail = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "billjeshbaidya",
            pass: "fiituogkwsmobtet"
        }
    })
    await mail.sendMail({
        from: "billjeshbaidya@gmail.com",
        to: email,
        subject: "Verify Your Account for Affexon",
        html:
        `
            <h1>Hi ${name},</h1>
            <br>
            <p>You registered an account on Affexon before being able to use your account you need to verify that this is your email address by copying and pasting the url to browser: 
            <br>
            <a href = ${link}}>${link}</a></p>
            <br>
            <p>kind regards, Affexon</p>
        `
    })
}
