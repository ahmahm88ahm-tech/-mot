import {
  Controller, Post, UploadedFile, UseGuards, UseInterceptors,
  BadRequestException, Param, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiParam, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// تأكد من وجود المجلد عند التشغيل
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

@ApiTags('Uploads')
@ApiBearerAuth('JWT')
@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {

  /**
   * R5 — File Upload: رفع صورة مرتبطة بطلب
   * POST /api/v1/uploads/order/:orderId/image
   * Content-Type: multipart/form-data
   * field name: file
   * max size: 5 MB | مقبول: image/jpeg, image/png, image/webp
   */
  @Post('order/:orderId/image')
  @UseInterceptors(FileInterceptor('file', { storage }))
  @ApiOperation({ summary: 'رفع صورة لطلب معين (JPEG / PNG / WebP — 5 MB حداً أقصى)' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'orderId', description: 'معرّف الطلب' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  uploadOrderImage(
    @Param('orderId') orderId: string,
    @CurrentUser() _user: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),          // 5 MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }), // صور فقط
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('لم يُرسل ملف');
    return {
      orderId,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      url: `/api/v1/uploads/files/${file.filename}`,
      uploadedAt: new Date().toISOString(),
    };
  }
}
