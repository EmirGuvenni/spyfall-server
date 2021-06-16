// Import libraries
import { Router, Request, Response } from "express";

const router: Router = Router();

router.route('/')
	.get(getRouteHandler);

function getRouteHandler(req: Request, res: Response): void {
	res.status(404).send('path_not_found').end();
}

export default router;