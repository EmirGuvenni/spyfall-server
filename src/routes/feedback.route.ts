// Import libraries
import { DISCORD_AVATAR_URL, DISCORD_EMBED_COLOR } from "@config/constants";
import axios from "axios";
import { Router, Request, Response } from "express";

// Inıtialize a router
const router: Router = Router();

router.route('/')
	.post(postRouteHandler)

async function postRouteHandler(req: Request, res: Response): Promise<void> {
	// Build the webhook content
	const webhook = {
		username: 'Spyfall Feedback',
		avatar_url: DISCORD_AVATAR_URL,

		color: DISCORD_EMBED_COLOR,

		title: `New report: ${req.body.type}`,
		content: `📧**Email:** \`\`\`${req.body.email}\`\`\`\n👩**Name:** \`\`\`${req.body.name}\`\`\`\n💬**Message:** \`\`\`${req.body.message}\`\`\``,

		timestamp: new Date().toISOString()
	}

	try {
		// Send the message to the Discord webhook
		await axios.post(process.env.DISCORD_WEBHOOK!, webhook, {
			headers: { 'Content-type': 'application/json' }
		});

		res.send('successfully_sent').status(200).end();
	}
	catch (err) {
		// TODO log the error
		res.send('error_while_sending').status(500).end();
	}
}