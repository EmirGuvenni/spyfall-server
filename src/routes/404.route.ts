// Import libraries
import { Router, Request, Response } from "express";

const router: Router = Router();

router.route('/')
	.get(getRouteHandler)
	.post(postRouteHandler);

function getRouteHandler(req: Request, res: Response): void {
	res.status(404).json({
		status: 'error',
		success: false,
		message: 'The specified path was not found or does not accept GET requests.'
	}).end();
}

function postRouteHandler(req: Request, res: Response): void {
	res.status(404).json({
