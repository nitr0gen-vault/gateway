import {
    Body,
    Controller,
    Header,
    Post,
    UseGuards,
  } from "@nestjs/common";
  import { ApiSecurity } from "@nestjs/swagger";
  import { ActiveledgerService } from "../../activeledger/activeledger.service";
  import { AuthGuard } from "../../guards/auth.guard";

@Controller()
export class GenericController {
    constructor(private activeledger: ActiveledgerService) {}

    @Header("content-type", "application/json")
    @ApiSecurity("X-API-KEY", ["X-API-KEY"])
    @UseGuards(AuthGuard)
    @Post("raw")
    async genericTransaction(@Body("ntx") ntx: string): Promise<any> {
      return await this.activeledger.send(ntx);
    }
}
