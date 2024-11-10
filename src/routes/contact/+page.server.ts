import { EMAIL } from "$env/static/private";
import sendEmail from "$lib/mailer.server";
import type { Actions } from "./$types";
import type Mail from "nodemailer/lib/mailer";

export const actions = {
	default: async ({ request }) => {
		try {
			const formData = await request.formData();
			const name = formData.get("name")?.toString() ?? "unknown";
			const email = formData.get("email")?.toString() ?? "unknown";
			const message = formData.get("message")?.toString() ?? "empty";

			const emailOptions = {
				from: EMAIL,
				to: [email],
				subject: "Contact Form",
				text: message,
				html: `
                <h2>Hello.</h2>
                    <p>
                        ${message}
                    </p>
                <h2>Best Regards, ${name}.
                `,
				attachments: undefined
			} satisfies Mail.Options;

			await sendEmail(emailOptions);

			return { success: "Success!" };
		} catch (error) {
			console.error("something went wrong...");
			console.error(error);
		}
	}
} satisfies Actions;

// NOTE: Page Settings 󰒓
export const prerender = false;
