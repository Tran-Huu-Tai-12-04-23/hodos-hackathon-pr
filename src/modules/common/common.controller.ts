import { Controller, Get, Post, UploadedFile } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonService } from './common.service';

@ApiTags('Common API')
@Controller('common')
export class CommonController {
  constructor(private readonly service: CommonService) {}

  @ApiOperation({
    summary: 'Dashboard data',
  })
  @ApiResponse({ status: 201 })
  @Get('dashboard')
  async dashBoardData() {
    return await this.service.dashBoardData();
  }

  @ApiOperation({
    summary: 'upload img to get url',
  })
  @Post('upload-image')
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const downloadURL = await this.service.uploadImage(file);
    return { url: downloadURL };
  }
}
