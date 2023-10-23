import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBasicAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from '../enums/user-roles.enum';
import { Roles } from '../decorators/role.decorators';
import { CurrentUser } from '../decorators/current.user.decorators';
import { CurrentUserDto } from './dto/current-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guards';
import { JwtInterceptor } from '../auth/jwt/jwt.interceptor';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiExcludeEndpoint()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseInterceptors(JwtInterceptor)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleEnum.ADVERTISER])
  @Get('all')
  async findAll() {
    return this.userService.findAll();
  }

  @UseInterceptors(JwtInterceptor)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleEnum.ADVERTISER])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseInterceptors(JwtInterceptor)
  @UseGuards(AuthGuard)
  @ApiBasicAuth()
  @Get(':id/profile')
  async getProfile(@CurrentUser() currentUser: CurrentUserDto) {
    return this.userService.findById(currentUser.id);
  }

  @UseInterceptors(JwtInterceptor)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleEnum.ADMIN])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseInterceptors(JwtInterceptor)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleEnum.ADVERTISER])
  @Delete(':id/soft-delete')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }

  @UseInterceptors(JwtInterceptor)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleEnum.ADMIN])
  @Post(':id/restore')
  async restore(@Param('id') id: string) {
    return await this.userService.restore(+id);
  }
}
