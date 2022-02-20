import nodemailer from "nodemailer"

export default async function sendVerificationEmail({name, email, link}: {name: string, email: string, link: string}){
    const mail = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "kuraakani.noreply",
            pass: "4252760b"
        }
    })
    await mail.sendMail({
        from: "kuraakani.noreply@gmail.com",
        to: email,
        subject: "Verify Your Account for Kuraakani",
        html:
        `
            <h1>Hi ${name},</h1>
            <br>
            <p>You registered an account on Kuraa Kani before being able to use your account you need to verify that this is your email address by copying and pasting the url to browser: 
            <br>
            <a href = ${link}}>${link}</a></p>
            <br>
            <p>kind regards, kuraakani</p>
        `
    })
}
