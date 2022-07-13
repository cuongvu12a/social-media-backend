import { Controller, Get, Param, Res } from "@nestjs/common";
import { UPLOADS_FOLDER } from "./constants";

@Controller()
export class AppController {
  @Get(`uploads/:fileId`)
	getUpload(@Param('fileId') fileId, @Res() res): any {
		return res.sendFile(fileId, {
			root: UPLOADS_FOLDER
		})
	}
}