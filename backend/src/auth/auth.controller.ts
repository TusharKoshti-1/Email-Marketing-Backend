import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { Response, Request } from "express";
import * as jwt from "jsonwebtoken";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post("register")
  async register(@Body() body: { email: string; password: string }) {
    const bcrypt = await import("bcryptjs");
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(body.password, salt);

    const user = await this.usersService.create({
      email: body.email,
      password: hashed,
    });

    return { id: user.id, email: user.email };
  }

  @Post("login")
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = await this.authService.login(body.email, body.password);

    // Access Token (15 min)
    res.cookie("token", token.access_token, {
      httpOnly: false,
      secure: false,
      sameSite: "none", // Same-site, no partitioning needed
      maxAge: 1000 * 60 * 15,
      path: "/",
    });

    // Refresh Token (7 days)
    res.cookie("refreshToken", token.refresh_token, {
      httpOnly: false,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    });

    console.log(`${token.access_token}`);

    return { message: "Login successful" };
  }

  @Post("refresh")
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      throw new UnauthorizedException("No refresh token provided");
    }

    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET || "replace_this_with_a_strong_secret"
      ) as any;

      const newAccessToken = jwt.sign(
        { email: payload.email, sub: payload.sub },
        process.env.JWT_SECRET || "replace_this_with_a_strong_secret",
        { expiresIn: "15m" }
      );

      res.cookie("token", newAccessToken, {
        httpOnly: false,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 15,
        path: "/",
      });

      return { message: "Token refreshed" };
    } catch (err) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("token", { path: "/", domain: ".mydomain.com" });
    res.clearCookie("refreshToken", { path: "/", domain: ".mydomain.com" });
    return { message: "Logged out successfully" };
  }
}