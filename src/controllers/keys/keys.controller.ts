import {
  Body,
  Controller,
  Header,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBody, ApiProperty, ApiSecurity } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveledgerService } from '../../activeledger/activeledger.service';
import { Key } from '../../entities/key.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { ObjectID, Repository } from 'typeorm';

class PostAccount {
  @ApiProperty()
  symbol: string;
  @ApiProperty()
  nId: string;
  @ApiProperty()
  ntx: string;
}

interface PostAccountResponse {
  id: string;
  nId: string;
  address: string;
  hashes: string[]
}

@Controller('keys')
export class KeysController {
  constructor(
    @InjectRepository(Key)
    private keyRepository: Repository<Key>,
    private activeledger: ActiveledgerService,
  ) {}

  @Header('content-type', 'application/json')
  @ApiBody({ type: PostAccount })
  @ApiSecurity('X-API-KEY', ['X-API-KEY'])
  @UseGuards(AuthGuard)
  @Post('')
  async new(
    @Body() account: PostAccount,
    @Request() req: any,
  ): Promise<PostAccountResponse> {
    // Get new key
    console.log("Creating key request")
    const result = await this.activeledger.send(account.ntx);

    // Now there will be a 2 second delay from the creation at this point, We will can do a recursive here if needed
    // for now keeping it super simple
    // next to keep checking every X and maybe send heartbeat?

    let pub = {} as any;
    do {
      // Keep checking for public address
      // Need to build in a counter to fail at
      try {
        console.log("waiting for 3");
        await new Promise((r) => setTimeout(r, 3000));
        console.log(`Checking : ${result.$streams.new[0].id}`);
        pub = (await this.activeledger.getPublicAddress(
          result.$streams.new[0].id,
        )) as any;
        console.log(pub);
      } catch (e) {
        console.log(e);
      }
    } while (!pub?.address);

    const newKey = new Key();
    newKey.userId = account.nId as any;
    newKey.appId = req.app.id;
    newKey.nId = result.$streams.new[0].id;
    newKey.symbol = account.symbol;
    newKey.address = pub.address;
    newKey.created = newKey.updated = new Date();
    const insert = await this.keyRepository.insert(newKey);

    return {
      id: insert.identifiers[0].id,
      nId: newKey.nId,
      address: newKey.address,
      hashes: pub.hashes as string[]
    };
  }


  @Header('content-type', 'application/json')
  @ApiBody({ type: PostAccount })
  @ApiSecurity('X-API-KEY', ['X-API-KEY'])
  @UseGuards(AuthGuard)
  @Post('preflight')
  async preflight(
    @Body("ntx") ntx: string,
    @Request() req: any,
  ): Promise<any> {
    // Get new key
    console.log("Preflight Sending")
    return await this.activeledger.send(ntx);
  }

  @Header('content-type', 'application/json')
  @ApiBody({ type: PostAccount })
  @ApiSecurity('X-API-KEY', ['X-API-KEY'])
  @UseGuards(AuthGuard)
  @Post('sign')
  async sign(
    @Body("ntx") ntx: string,
    @Request() req: any,
  ): Promise<any> {
    // Get new key
    console.log("sign Sending")
    return await this.activeledger.send(ntx);
  }

  @Header('content-type', 'application/json')
  @ApiBody({ type: PostAccount })
  @ApiSecurity('X-API-KEY', ['X-API-KEY'])
  @UseGuards(AuthGuard)
  @Post('diffconsensus')
  async diffconsensus(
    @Body("ntx") ntx: string,
    @Request() req: any,
  ): Promise<any> {
    // Get new key
    console.log("Diffy Consensus Sending")
    return await this.activeledger.send(ntx);
  }
}
