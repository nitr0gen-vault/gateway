import { Controller, Header, Get, Param, Res, Query } from "@nestjs/common";
import type { Response } from "express";
import { ActiveledgerService } from "../../activeledger/activeledger.service";

@Controller("nft")
export class NftController {
  constructor(private activeledger: ActiveledgerService) {}

  @Header("content-type", "application/json")
  @Get(":id")
  async onboard(
    @Param("id") id,
    @Query("url") url,
    @Query("meta") meta
  ): Promise<any> {
    const nft = (await this.activeledger.getStream(id)) as any;

    // Delete _rev that is activeledger
    delete nft._rev;

    // By default remove url
    if (!url) {
      delete nft.url;
    }

    // Remove metastream and later add it if they want it
    const metaStream = nft.metastream;
    delete nft.metastream;

    if (meta) {
      nft.meta = (await this.activeledger.getStream(metaStream)) as any;

      // remove the statics here as well
      delete nft.meta._rev;
      delete nft.meta.nftstream;
    }

    return nft;
  }

  //@Header("content-type", "application/json")
  @Get("image/:id")
  async image(
    @Param("id") id,
    @Res({ passthrough: true }) res: Response
  ): Promise<Buffer> {
    const nft = (await this.activeledger.getStream(id)) as any;
    const [type, file] = nft.url.split(",");
    const [format, encoding] = type.split(";");

    res.setHeader("Content-Type", format.replace("data:", ""));
    res.end(Buffer.from(file, "base64"));
    return;
  }
}
