import { Header } from '@nestjs/common';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiProperty, ApiSecurity } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveledgerService } from '../../activeledger/activeledger.service';
import { User } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { Repository } from 'typeorm';
import { IBaseTransaction } from '@activeledger/sdk';

class PostUser {
  userId?: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  uuid: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  telephone: string;
  @ApiProperty()
  otpk: string;
  @ApiProperty()
  ntx: string;
}

interface PostUserResponse {
  id: string;
  nId: string;
}

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private activeledger: ActiveledgerService,
  ) {}

  @Header('content-type', 'application/json')
  @ApiBody({ type: PostUser })
  @ApiSecurity('X-API-KEY', ['X-API-KEY'])
  @UseGuards(AuthGuard)
  @Post('onboard')
  async onboard(
    @Body() user: PostUser,
    @Request() req: any,
  ): Promise<PostUserResponse> {
    const parsedTx = JSON.parse(Buffer.from(user.ntx, 'base64').toString()) as IBaseTransaction;
    
    // create user
    const newUser = new User();
    newUser.appId = req.app.id;
    newUser.uuid = parsedTx.$tx.$i.otk.uuid;
    newUser.otpk = [parsedTx.$tx.$i.otk.publicKey];
    newUser.lastOtpk = parsedTx.$tx.$i.otk.publicKey;
    newUser.created = newUser.updated = new Date();
    console.log(user);
    // onboard user into ledger
    const result = await this.activeledger.send(parsedTx);

    if ((result.$summary as any).errors?.length) {
      throw (result.$summary as any).errors[0];
    }

    newUser.nId = result.$streams.new[0].id;

    const insert = await this.usersRepository.insert(newUser);

    // return notabox id
    return { id: insert.identifiers[0].id, nId: newUser.nId };
  }

  // @Header('content-type', 'application/json')
  // @ApiSecurity('X-API-KEY', ['X-API-KEY'])
  // @UseGuards(AuthGuard)
  // @Post('pending')
  // async pending(
  //   @Body() user: PostUser,
  //   @Request() req: any,
  // ): Promise<PostUserResponse> {
  //   // Check user against app doesn't exist
  //   const users = await this.usersRepository.find({
  //     where: { appId: req.app.id, email: user.email },
  //   });

  //   if (users.length) {
  //     const dbUser = users[0];

  //     console.log(dbUser);

  //     // onboard user into ledger
  //     const result = await this.activeledger.send(user.notaTx);
  //     console.log(result);
  //     dbUser.lastOtpk = user.otpk;
  //     dbUser.otpk.push(user.otpk);

  //     const insert = await this.usersRepository.save(dbUser);

  //     // return notabox id
  //     return { id: dbUser.id.toString(), notaId: dbUser.notaId };
  //   } else {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         error: 'User Not Found',
  //       },
  //       422,
  //     );
  //   }
  // }

  // @Header('content-type', 'application/json')
  // @ApiSecurity('X-API-KEY', ['X-API-KEY'])
  // @UseGuards(AuthGuard)
  // @Post('identity')
  // async getIdentity(
  //   @Body() user: PostUser,
  //   @Request() req: any,
  // ): Promise<PostUserResponse> {
  //   // Check user against app doesn't exist
  //   const users = await this.usersRepository.find({
  //     where: { appId: req.app.id, email: user.email },
  //   });

  //   if (users.length) {
  //     const dbUser = users[0];
  //     return { id: dbUser.id.toString(), notaId: dbUser.notaId };
  //   } else {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         error: 'User Not Found',
  //       },
  //       422,
  //     );
  //   }
  // }

  // @ApiBody({ type: User })
  // @ApiSecurity('X-API-KEY', ['X-API-KEY'])
  // @UseGuards(AuthGuard)
  // @Post('update')
  // async update(@Body() user: User, @Request() req: any): Promise<string> {
  //   // Check user against app doesn't exist

  //   // create user

  //   // onboard user into ledger

  //   // return notabox id

  //   console.log(req.app);

  //   return 'ok';
  // }

  @Header('content-type', 'application/json')
  @ApiBody({ type: User })
  @ApiSecurity('X-API-KEY', ['X-API-KEY'])
  @UseGuards(AuthGuard)
  @Post('recovery')
  async recovery(
    @Body('ntx') ntx: string,
    @Request() req: any,
  ): Promise<any> {
    // Just send it
    console.log('Sending Recovery Request');
    console.log(ntx);
    return await this.activeledger.send(ntx);
  }
}
