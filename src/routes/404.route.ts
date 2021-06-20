// Import libraries
import { Router, Request, Response } from "express";

const router: Router = Router();

router.route('/')
	.get(getRouteHandler);

function getRouteHandler(req: Request, res: Response): void {
	res.status(404).json({
		status: 'error',
		message: 'The specified path was not found.'
	}).end();
}

export default router;