// Import libraries
import fs from "fs";
import axios from "axios";
import { Router, Request, Response } from "express";
import logger from "../config/logger";

// Import config
import {
	DISCORD_AVATAR_URL,
	DISCORD_EMBED_COLOR,
	FEEDBACK_MAX_MESSAGE_LENGTH,
	FEEDBACK_MAX_NAME_LENGTH,
	FEEDBACK_MIN_MESSAGE_LENGTH,
	FEEDBACK_TYPES
} from "../config/constants";

// Initialize a router
const router: Router = Router();

router.route('/')
	.post(postRouteHandler);

interface WebhookElements {
	email: string;
	name: string;
	message: string;
	type: string;
}

function validateEmail(email: any): boolean {
	if (typeof email !== 'string') return false;

	const regex: RegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	return regex.test(String(email).toLowerCase());
}

function validateName(name: any): boolean {
	if (typeof name !== 'string') return false;
	else return name.length <= FEEDBACK_MAX_NAME_LENGTH;
}

function validateMessage(message: any): boolean {
	if (typeof message !== 'string') return false;
	else if (message.length > FEEDBACK_MAX_MESSAGE_LENGTH) return false;
	else return message.length >= FEEDBACK_MIN_MESSAGE_LENGTH;
}

function validateType(type: any): boolean {
	if (typeof type !== 'string') return false;
	else return FEEDBACK_TYPES.includes(type);
}

function validateWebhookElements(elements: WebhookElements) {
	let missing: string[] = [];
	let invalid: string[] = [];
	let isValid: boolean = false;

	// E-mail
	if (!elements.email) missing.push('email');
	else if (!validateEmail(elements.email)) invalid.push('email');

	// Name
	if (!elements.name) missing.push('name');
	else if (!validateName(elements.name)) invalid.push('name');

	// Message
	if (!elements.message) missing.push('message');
	else if (!validateMessage(elements.message)) invalid.push('message');

	// Type
	if (!elements.type) missing.push('type');
	else if (!validateType(elements.type)) invalid.push('type');


	missing[0] || invalid[0] ? isValid = false : isValid = true;

	return {
		isValid,
		missing,
		invalid
	}
}

async function postRouteHandler(req: Request, res: Response): Promise<void> {
	let webhookElements: WebhookElements = await req.body;
	let validation = validateWebhookElements(webhookElements);

	// Send an error if elements are missing or invalid
	if (!validation.isValid) {
		// Missing and invalid elements
		if (validation.missing[0] && validation.invalid[0])
			res.status(400).json({
				success: false,
				message: 'There are missing and invalid elements.',
				missing: validation.missing,
				invalid: validation.invalid
			}).end();
		// Missing elements
		else if (validation.missing[0])
			res.status(400).json({
				success: false,
				message: 'There are missing elements.',
				missing: validation.missing
			}).end();
		// Invalid elements
		else if (validation.invalid[0])
			res.status(400).json({
				success: false,
				message: 'There are invalid elements',
				invalid: validation.invalid
			}).end();
		return;
	}

	// Build the Discord webhook object
	const webhook = {
		username: 'Spyfall Feedback',
		avatar_url: DISCORD_AVATAR_URL,

		embeds: [
			{
				color: DISCORD_EMBED_COLOR,

				title: `New report: ${webhookElements.type}`,
				description: `📧**Email:** \`${webhookElements.email}\`\n` +
					`👩**Name:** \`${webhookElements.name}\`\n` +
					`💬**Message:** \`${webhookElements.message}\``,

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
			success: true,
			message: 'Thank you for your feedback. Your feedback has been delivered to our team.'
		}).end();
	}
	catch (err) {
		// Log the error
		logger.error('Failed to send a webhook.');

		let feedbackFilePath: string = 'feedbacks.json';
		let feedback = {
			email: webhookElements.email,
			name: webhookElements.name,
			type: webhookElements.type,
			message: webhookElements.type,
			sentAt: Date.now()
		};

		// Create the feedback.json file if it doesn't exists
		if (!fs.existsSync(feedbackFilePath))
			fs.writeFileSync(feedbackFilePath, '[]');

		// Parse the file content
		let feedbacksParsed: any[] = JSON.parse(fs.readFileSync(feedbackFilePath, 'utf-8'));
		feedbacksParsed.push(feedback);

		// Write the new feedback into the file
		fs.writeFileSync(feedbackFilePath, JSON.stringify(feedbacksParsed));

		// Respond with an error
		res.status(500).json({
			success: false,
			message: 'Something went wrong. Please try again later.'
		}).end();
	}
}

export default router;
