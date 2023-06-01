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

@Controller("layer2")
export class Layer2Controller {
  constructor(private activeledger: ActiveledgerService) {}

  @Header("content-type", "application/json")
  @ApiSecurity("X-API-KEY", ["X-API-KEY"])
  @UseGuards(AuthGuard)
  @Post("send")
  async diffconsensus(@Body("ntx") ntx: string): Promise<any> {
    console.log("Layer 2 Sending");
    return await this.activeledger.send(ntx);
  }
}
