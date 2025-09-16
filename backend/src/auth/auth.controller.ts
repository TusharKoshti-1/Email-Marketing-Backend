import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { Response } from "express";

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

    const token = await this.authService.login(user);

    // ✅ Set JWT in HttpOnly cookie
    res.cookie("token", token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // false in dev
      sameSite: "lax", // Change from 'strict' to allow cross-port
      maxAge: 1000 * 60 * 60,
      path: "/",
      domain: "localhost", // Key fix: Share across localhost ports
    });

    return { message: "Login successful" };
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    // Clear the cookie
    res.clearCookie("token", { path: "/" });
    return { message: "Logged out successfully" };
  }
}
