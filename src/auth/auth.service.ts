import { Injectable, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService,) { }

  async validate(createAuthDto: CreateAuthDto) {
    const key = await this.prisma.clientKey.findUnique({
      where: {
        key: createAuthDto.key,
      },
      include: {
        Devices: {
          where: {
            duid: createAuthDto.duid
          }
        },
        DataPacks: true
      }
    })

    if (!key) {
      throw new BadRequestException('Invalid key')
    } else {
      if (key.limit > key.deviceIds.length || key.Devices.length) {
        if (key.Devices.length) {
          await this.prisma.device.update({
            where: {
              duid: createAuthDto.duid
            },
            data: {
              authLog: {
                push: new Date(Date.now())
              }
            }
          })
          return key
        } else {
          const device = await this.prisma.device.findUnique({
            where: {
              duid: createAuthDto.duid
            }
          })
          let pushDevice = null
          if (device) {
            pushDevice = await this.prisma.device.update({
              where: {
                duid: createAuthDto.duid
              },
              data: {
                authLog: {
                  push: new Date(Date.now())
                }
              }
            })
          } else {
            pushDevice = await this.prisma.device.create({
              data: {
                duid: createAuthDto.duid,
                authLog: [new Date(Date.now())],
              }
            })
          }
          return this.prisma.clientKey.update(
            {
              where: {
                key: createAuthDto.key
              },
              data: {
                Devices: {
                  connect: {
                    id: pushDevice.id
                  }
                }
              },
              include: {
                Devices: {
                  where: {
                    duid: createAuthDto.duid
                  }
                },
                DataPacks: true
              }
            }
          )
        }
      } else {
        throw new ConflictException('The key has been used beyond the limit number of times')
      }
    }
  }

  async signIn(id: string, password: string) {
    console.log(process.env.ID, process.env.PASSWORD);
    if (process.env.ID === id && process.env.PASSWORD === password) {
      const payload = { admin: true };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new UnauthorizedException();
    }
  }
}
