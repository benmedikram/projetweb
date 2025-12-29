import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) { }

  // 🔹 Vérifier email + password
  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    // ⚠️ Ici on compare en clair, dans la réalité tu utilises bcrypt.compare
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // on enlève le password dans l’objet retourné
    const { password, ...result } = user;
    return result;
  }

  // 🔹 Générer le token
  async login(user: any) {
    const payload = { sub: user.id || user._id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        name: user.name,
      }
    };
  }

  // 🔹 Inscription
  async signUp(createUserDto: any) {
    const newUser = await this.usersService.create(createUserDto);
    return this.login(newUser);
  }
}
