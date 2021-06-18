// Import libraries
import axios from "axios";
import { Router, Request, Response } from "express";
import logger from "../config/logger";

// Import config
import { DISCORD_AVATAR_URL, DISCORD_EMBED_COLOR } from "../config/constants";

// Initialize a router
const router: Router = Router();

router.route('/')
	.post(postRouteHandler)

function validateEmail(email: string) {
	const regex: RegExp = /^(([^<>()[]\.,;:\s@"]+(.[^<>()[]\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
	return regex.test(String(email).toLowerCase());
}

async function postRouteHandler(req: Request, res: Response): Promise<void> {
	let email: string = req.body.email;
	let name: string = req.body.name;
	let message: string = req.body.message;
	let type: string = req.body.type;

	// Validate the mail address of the incoming feedback
	if (validateEmail(req.body.email)) {
		res.send('invalid_mail').status(400).end();
		return;
	}

	// Build the webhook embed
	const webhook = {
		username: 'Spyfall Feedback',
		avatar_url: DISCORD_AVATAR_URL,

		embeds: [
			{
				color: DISCORD_EMBED_COLOR,

				title: `New report: ${type}`,
				description: `📧**Email:** \`${email}\`\n` +
					`👩**Name:** \`${name}\`\n` +
					`💬**Message:** \`${message}\``,

				timestamp: new Date().toISOString()
			}
		]
	}

	try {
		// Send the message to the Discord webhook
		await axios.post(process.env.DISCORD_WEBHOOK!, webhook, {
			headers: { 'Content-type': 'application/json' }
		});

		res.status(200).json({
			status: 'ok',
			message: 'Thank you for your feedback. Your feedback has been delivered to our team.'
		}).end();
	}
	catch (err) {
		logger.error(
			'Failed to send a webhook., ' +
			`Email: ${email}, ` +
			`Name: ${name}, ` +
			`Type: ${type}, ` +
			`Message: ${message}`
		);
		// Respond with an error
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong. Please try again later.'
		}).end();
	}
}

export default router;
