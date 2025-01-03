import { HCAPTCHA_SECRET_KEY } from "$env/static/private";
import sendEmail from "$lib/mailer.server";
import type { Actions } from "./$types";
import type Mail from "nodemailer/lib/mailer";

export const actions = {
	default: async ({ request, getClientAddress }) => {
		try {
			const formData = await request.formData();
			const params = new URLSearchParams({
				secret: HCAPTCHA_SECRET_KEY,
				response: formData.get("h-captcha-response")?.toString() ?? "no response",
				remoteip: getClientAddress()
			});

			const captchaResult = await fetch("https://api.hcaptcha.com/siteverify", {
				method: "POST",
				body: params
			});

			const data = await captchaResult.json();
			if (data.success) {
				const name = formData.get("name")?.toString() ?? "unknown";
				const email = formData.get("email")?.toString() ?? "unknown";
				const message = formData.get("message")?.toString() ?? "empty";
				const emailOptions = {
					from: "onboarding@resend.dev",
					to: "delivered@resend.dev",
					subject: "Contact Form",
					text: message,
					html: `
                        <h3>Email: ${email}<h3>
                        <h3>Date: ${new Date().toLocaleString()}</h3>
                            <p>
                                ${message}
                            </p>
                        <h3>Best Regards, ${name}</h3>.
                    `,
					attachments: undefined
				} satisfies Mail.Options;

				await sendEmail(emailOptions);

				return { success: true };
			} else {
				return { success: false };
			}
		} catch (error) {
			console.error("something went wrong...");
			console.error(error);
		}
	}
} satisfies Actions;

// NOTE: Page Settings 󰒓
export const prerender = false;
