import { Injectable, NotFoundException } from '@nestjs/common';
import { TemplateEnum } from '../enum/template.enum';
import { UserTemplateService } from '../template/user.template';

@Injectable()
export class TemplateService {
  constructor(private readonly userTemplateService: UserTemplateService) {}

  templateMapper(template: TemplateEnum): any {
    switch (template) {
      case TemplateEnum.USER_SIGN_UP:
        return this.userTemplateService.getSignUp;

      default:
        throw new NotFoundException('Not email template found');
    }
  }
}
